import { NextResponse } from "next/server";

import { analyzeWithLLM } from "@/lib/analyzers/llm";
import { runRuleBasedAnalysis } from "@/lib/analyzers/rules";
import { analysisSchema, analyzeRequestSchema, type Analysis, type Issue } from "@/lib/schema";

function dedupeIssues(issues: Issue[]): Issue[] {
  const seen = new Set<string>();
  const deduped: Issue[] = [];
  for (const issue of issues) {
    const key = `${issue.engine}:${issue.severity}:${issue.title}`;
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(issue);
  }
  return deduped;
}

function mergeAnalysis(ruleAnalysis: Analysis, llmAnalysis: Analysis | null): Analysis {
  if (!llmAnalysis) return ruleAnalysis;

  const merged: Analysis = {
    meta: ruleAnalysis.meta,
    scores: llmAnalysis.scores,
    issues: dedupeIssues([...ruleAnalysis.issues, ...llmAnalysis.issues]),
    quickFixes: [...new Set([...ruleAnalysis.quickFixes, ...llmAnalysis.quickFixes])],
    notes: {
      assumptionsToConfirm: [...new Set([...ruleAnalysis.notes.assumptionsToConfirm, ...llmAnalysis.notes.assumptionsToConfirm])],
      riskyClaims: [...new Set([...ruleAnalysis.notes.riskyClaims, ...llmAnalysis.notes.riskyClaims])]
    }
  };

  const validated = analysisSchema.safeParse(merged);
  return validated.success ? validated.data : ruleAnalysis;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = analyzeRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request payload", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const ruleAnalysis = runRuleBasedAnalysis(parsed.data);
    const llmAnalysis = await analyzeWithLLM(parsed.data);
    const merged = mergeAnalysis(ruleAnalysis, llmAnalysis);

    return NextResponse.json(merged);
  } catch {
    return NextResponse.json(
      { error: "Unable to analyze copy at this time." },
      { status: 500 }
    );
  }
}
