import { NextResponse } from "next/server";

import { rewriteWithLLM, rewriteWithLLMStream } from "@/lib/analyzers/llm";
import { removeBannedPhrases } from "@/lib/analyzers/rules";
import { computeEdits } from "@/lib/redline/computeEdits";
import {
  rewriteRequestSchema,
  rewriteResponseSchema,
  type RewriteResponse
} from "@/lib/schema";

function clipLengthAroundOriginal(
  original: string,
  candidate: string,
  contentType: string
): { revisedCopy: string; clipped: boolean } {
  if (contentType === "Social") return { revisedCopy: candidate, clipped: false };
  const originalWords = original.trim().split(/\s+/).filter(Boolean);
  const candidateWords = candidate.trim().split(/\s+/).filter(Boolean);
  const min = Math.floor(originalWords.length * 0.85);
  const max = Math.ceil(originalWords.length * 1.15);

  if (candidateWords.length < min) {
    return { revisedCopy: candidate, clipped: false };
  }
  if (candidateWords.length > max) {
    return { revisedCopy: candidateWords.slice(0, max).join(" "), clipped: true };
  }
  return { revisedCopy: candidate, clipped: false };
}

function fallbackRewrite(originalCopy: string, vertical: string): { revisedCopy: string; changeLog: string[] } {
  let revised = removeBannedPhrases(originalCopy, vertical as "Performance" | "Bet" | "Media");
  const changeLog: string[] = ["Removed banned or high-risk marketing phrases."];

  if (!/\bFAQ\b/i.test(revised)) {
    revised += "\n\nFAQ\nQ: What is [DEFINE TERM]?\nA: [DEFINE TERM] is [PROOF NEEDED].";
    changeLog.push("Added FAQ placeholder block for AEO coverage.");
  }

  if (!/\bis\b/i.test(revised.slice(0, 500))) {
    revised = `[DEFINE TERM] is [PROOF NEEDED].\n\n${revised}`;
    changeLog.push("Added direct definition placeholder near the opening.");
  }

  return { revisedCopy: revised, changeLog };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = rewriteRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid rewrite payload", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { originalCopy, analysis, stream: useStream } = parsed.data;
    const contentType = analysis.meta.contentType;

    if (useStream) {
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        async start(controller) {
          try {
            let fullRevisedCopy = "";
            let hadChunks = false;
            for await (const { chunk } of rewriteWithLLMStream({
              originalCopy,
              analysis,
              contentType
            })) {
              hadChunks = true;
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ chunk })}\n\n`)
              );
              fullRevisedCopy += chunk;
            }
            if (!hadChunks || !fullRevisedCopy.trim()) {
              const fallback = fallbackRewrite(originalCopy, analysis.meta.vertical);
              fullRevisedCopy = fallback.revisedCopy;
              const clipped = clipLengthAroundOriginal(originalCopy, fullRevisedCopy, contentType);
              const revisedCopy = clipped.revisedCopy;
              const changeLog = clipped.clipped
                ? [...fallback.changeLog, "Trimmed output length to stay within +/-15%."]
                : fallback.changeLog;
              const computed = computeEdits(originalCopy, revisedCopy);
              controller.enqueue(
                encoder.encode(
                  `data: ${JSON.stringify({
                    done: true,
                    revisedCopy,
                    changeLog,
                    segments: computed.segments,
                    meta: { rewriteSource: "fallback" as const }
                  })}\n\n`
                )
              );
            } else {
              const clipped = clipLengthAroundOriginal(originalCopy, fullRevisedCopy, contentType);
              const revisedCopy = clipped.revisedCopy;
              const changeLog = clipped.clipped
                ? ["Streamed rewrite applied.", "Trimmed output length to stay within +/-15%."]
                : ["Streamed rewrite applied."];
              const computed = computeEdits(originalCopy, revisedCopy);
              controller.enqueue(
                encoder.encode(
                  `data: ${JSON.stringify({
                    done: true,
                    revisedCopy,
                    changeLog,
                    segments: computed.segments,
                    meta: { rewriteSource: "llm" as const }
                  })}\n\n`
                )
              );
            }
          } catch {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ error: "Stream failed." })}\n\n`)
            );
          } finally {
            controller.close();
          }
        }
      });
      return new Response(stream, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive"
        }
      });
    }

    const llmResult = await rewriteWithLLM({
        originalCopy,
        analysis,
        contentType
      });
    let result = llmResult ?? fallbackRewrite(originalCopy, analysis.meta.vertical);
    let rewriteSource: RewriteResponse["meta"]["rewriteSource"] = llmResult ? "llm" : "fallback";

    const clipped = clipLengthAroundOriginal(originalCopy, result.revisedCopy, contentType);
    if (clipped.clipped) {
      result = {
        revisedCopy: clipped.revisedCopy,
        changeLog: [...result.changeLog, "Trimmed output length to stay within +/-15%."]
      };
    }

    const computed = computeEdits(originalCopy, result.revisedCopy);

    const payload: RewriteResponse = {
      revisedCopy: result.revisedCopy,
      edits: computed.edits,
      segments: computed.segments,
      changeLog: result.changeLog,
      meta: {
        rewriteSource
      }
    };

    const validated = rewriteResponseSchema.safeParse(payload);
    if (!validated.success) {
      const fallback = fallbackRewrite(originalCopy, analysis.meta.vertical);
      const fallbackComputed = computeEdits(originalCopy, fallback.revisedCopy);
      const fallbackPayload: RewriteResponse = {
        revisedCopy: fallback.revisedCopy,
        edits: fallbackComputed.edits,
        segments: fallbackComputed.segments,
        changeLog: fallback.changeLog,
        meta: {
          rewriteSource: "fallback"
        }
      };
      return NextResponse.json(fallbackPayload);
    }

    return NextResponse.json(validated.data);
  } catch {
    return NextResponse.json(
      { error: "Unable to rewrite copy at this time." },
      { status: 500 }
    );
  }
}
