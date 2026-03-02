import "server-only";

import OpenAI from "openai";

import { analysisSchema, type Analysis, type AnalyzeRequest } from "@/lib/schema";

const MODEL = "gpt-4o-mini";

const BRAND_VOICE_DNA = `
Non-negotiables:
- Evidence-led authority: proof + specific nouns; avoid unprovable superlatives.
- Precise and specific: active voice; define acronyms once; reduce ambiguity.
- Sport-native, not gimmicky: natural sport fluency; no forced metaphors.
- Commercially grounded: tie capabilities to outcomes (revenue, cost, risk, engagement, decision quality).
- Responsibly confident: no guarantee language; bounded claims; extra caution for Bet.
- Globally clear: avoid idioms/slang; easy to translate.
`.trim();

const RUBRIC = `
Voice (0-100) subs:
- Evidence-led authority (25)
- Precision & clarity (20)
- Commercial grounding (15)
- Sport-native (10)
- Responsibility/compliance (20)
- Global clarity (10)

SEO (0-100) subs:
- Intent alignment (25)
- Structure/headings (20)
- Keyword use (20)
- Coverage & completeness (20)
- Internal linking suggestions (15) with placeholders such as /perform, /bet, /engage, /resources without claiming they exist.

AEO (0-100) subs:
- Direct answer clarity (30)
- Snippet-ready blocks (25)
- FAQ quality (25)
- Entity clarity (20)
`.trim();

function getClient(): OpenAI | null {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;
  return new OpenAI({ apiKey });
}

export async function analyzeWithLLM(input: AnalyzeRequest): Promise<Analysis | null> {
  const client = getClient();
  if (!client) return null;

  const prompt = `
You are analyzing marketing copy for "Genius Voice + Visibility QA".
Return JSON only (no markdown, no prose).
Output must match this contract exactly:
{
  "meta": { "vertical": "Performance|Bet|Media", "regionStyle": "US|UK|Intl", "contentType": "Social|Blog|SEO Pillar|Email|Landing Page|PR|Webinar|Report|One-pager", "riskTier": "Low|Medium|High" },
  "scores": {
    "voice": { "total": 0, "subs": { "evidenceLedAuthority": 0, "precisionClarity": 0, "commercialGrounding": 0, "sportNative": 0, "responsibilityCompliance": 0, "globalClarity": 0 } },
    "seo": { "total": 0, "subs": { "intentAlignment": 0, "structureHeadings": 0, "keywordUse": 0, "coverageCompleteness": 0, "internalLinking": 0 } },
    "aeo": { "total": 0, "subs": { "directAnswerClarity": 0, "snippetReadyBlocks": 0, "faqQuality": 0, "entityClarity": 0 } },
    "overall": 0
  },
  "issues": [{ "engine": "voice|seo|aeo", "severity": "blocker|high|medium|low", "title": "string", "explanation": "string", "suggestion": "string", "offsets": { "start": 0, "end": 0 } }],
  "quickFixes": ["string"],
  "notes": { "assumptionsToConfirm": ["string"], "riskyClaims": ["string"] }
}

Use this voice DNA:
${BRAND_VOICE_DNA}

Use this rubric:
${RUBRIC}

Input:
${JSON.stringify(input)}
`.trim();

  try {
    const response = await client.chat.completions.create({
      model: MODEL,
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You are a strict JSON generator for marketing QA. Never output markdown. Keep scores in allowed bounds and avoid invented facts."
        },
        { role: "user", content: prompt }
      ]
    });

    const raw = response.choices[0]?.message?.content;
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    const validated = analysisSchema.safeParse(parsed);
    return validated.success ? validated.data : null;
  } catch {
    return null;
  }
}

export async function rewriteWithLLM(params: {
  originalCopy: string;
  analysis: Analysis;
  contentType: AnalyzeRequest["meta"]["contentType"];
}): Promise<{ revisedCopy: string; changeLog: string[] } | null> {
  const client = getClient();
  if (!client) return null;

  const lengthRule =
    params.contentType === "Social"
      ? "Length can change as needed for social clarity."
      : "Keep revised length within +/-15% of original.";

  const prompt = `
Rewrite this marketing copy according to constraints.
Return strict JSON only with:
{ "revisedCopy": "string", "changeLog": ["string"] }

Rules:
- Preserve meaning; do not invent facts, metrics, partnerships, certifications, or claims.
- Remove banned/gimmicky language and any guaranteed outcome language.
- Add specificity only by reorganizing existing details.
- Add AEO blocks if missing: definition + FAQ placeholders such as [DEFINE TERM], [PROOF NEEDED].
- ${lengthRule}

Analysis context:
${JSON.stringify(params.analysis)}

Original copy:
${params.originalCopy}
`.trim();

  try {
    const response = await client.chat.completions.create({
      model: MODEL,
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: "You are a compliance-conscious copy editor. Output valid JSON only."
        },
        { role: "user", content: prompt }
      ]
    });

    const raw = response.choices[0]?.message?.content;
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { revisedCopy?: unknown; changeLog?: unknown };
    if (typeof parsed.revisedCopy !== "string") return null;
    const changeLog = Array.isArray(parsed.changeLog) ? parsed.changeLog.filter((v): v is string => typeof v === "string") : [];
    return { revisedCopy: parsed.revisedCopy, changeLog };
  } catch {
    return null;
  }
}
