import { NextResponse } from "next/server";

import { rewriteWithLLM } from "@/lib/analyzers/llm";
import { removeBannedPhrases } from "@/lib/analyzers/rules";
import { rewriteRequestSchema, rewriteResponseSchema } from "@/lib/schema";

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

function fallbackRewrite(originalCopy: string, vertical: string) {
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

    const { originalCopy, analysis } = parsed.data;
    const contentType = analysis.meta.contentType;

    let result =
      (await rewriteWithLLM({
        originalCopy,
        analysis,
        contentType
      })) ?? fallbackRewrite(originalCopy, analysis.meta.vertical);

    const clipped = clipLengthAroundOriginal(originalCopy, result.revisedCopy, contentType);
    if (clipped.clipped) {
      result = {
        revisedCopy: clipped.revisedCopy,
        changeLog: [...result.changeLog, "Trimmed output length to stay within +/-15%."]
      };
    }

    const validated = rewriteResponseSchema.safeParse(result);
    if (!validated.success) {
      const fallback = fallbackRewrite(originalCopy, analysis.meta.vertical);
      return NextResponse.json(fallback);
    }

    return NextResponse.json(validated.data);
  } catch {
    return NextResponse.json(
      { error: "Unable to rewrite copy at this time." },
      { status: 500 }
    );
  }
}
