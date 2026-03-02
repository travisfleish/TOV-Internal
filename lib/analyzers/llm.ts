import "server-only";

import OpenAI from "openai";

import { analysisSchema, type Analysis, type AnalyzeRequest } from "@/lib/schema";

const MODEL = "gpt-4o-mini";

const BRAND_VOICE_DNA = `
CORE BRAND THESIS
Genius Sports is the operational layer that transforms every on-field moment into reliable, real-time intelligence and measurable commercial value for leagues, broadcasters, brands and sportsbooks.

PRIMARY IDENTITY
- Infrastructure, not a point solution.
- Operator and Analyst archetype (systems-level, data-driven, measured confidence).
- Sport-native fluency without gimmicks.
- Optimistic about the future of sport, but grounded in proof.

NON-NEGOTIABLES
1) Evidence-led authority.
   - Pair claims with named products, partners, metrics, or mechanisms.
   - Prefer: GeniusIQ, FANHub, BetVision, LiveStats, official data feeds.
   - Avoid unprovable superlatives.

2) Precise and specific.
   - Active voice.
   - Concrete nouns (feeds, overlays, betslip, computer vision, identity graph, low-latency APIs).
   - If “real-time” is used, state how (e.g., official low-latency feeds + automated trading engine).

3) Sport-native, not gimmicky.
   - Use sport terminology functionally (offside automation, live stats, replay augmentation).
   - No forced metaphors, no slang, no idioms.

4) Commercially grounded.
   - Tie capabilities directly to outcomes:
     revenue growth, in-play turnover, engagement lift, time-on-site,
     operational efficiency, decision accuracy, inventory monetisation.
   - State scope or conditions where appropriate.

5) Responsibly confident.
   - No guarantees. No “always,” “never,” “risk-free,” “can’t miss.”
   - Especially cautious in betting contexts.
   - Use bounded language: “helps increase,” “designed to improve,” “supports.”

6) Globally clear.
   - Short-to-medium sentences.
   - Simple grammar.
   - Easy to translate across markets.

MANDATORY PROOF STRUCTURE (DEFAULT PATTERN)
When making a substantive claim, follow this structure:
[Partner / Customer / Market] +
[Named Product] +
[Specific Mechanism / Technology] +
[Commercial or Performance Outcome]

Example pattern:
“Using GeniusIQ’s computer vision and real-time tracking data, [Partner] enhanced broadcast overlays and increased viewer engagement during live games.”

PRODUCT-FIRST RULE
Name the product before the capability.
- Strong: “GeniusIQ processes real-time tracking data to power contextual broadcast graphics.”
- Weak: “Our AI platform processes data to power graphics.”

REAL-TIME RULE
If you say “real-time,” clarify mechanism or cadence:
- low-latency official data feeds
- automated odds engine
- computer vision models
- live streaming integration
- in-game event triggers

AUDIENCE DIALS

Leagues & Teams:
- Analytical, performance-oriented.
- Emphasise decision quality, officiating accuracy, player performance insights.
- Technical clarity > marketing flourish.

Broadcasters & Media:
- Focus on augmented viewing, automated highlights, monetisable overlays.
- Tie innovation to audience growth and inventory value.

Brands & Advertisers:
- Emphasise FANHub, identity resolution, audience segmentation.
- Tie to measurable campaign outcomes and activation efficiency.

Sportsbooks & Operators:
- Commercially direct but compliance-aware.
- Focus on in-play engagement, trading accuracy, uptime, product integration.
- No implication of betting guarantees.

Investors / Corporate:
- Formal, metric-forward, structured.
- Use defined terms where appropriate.
- Avoid hype language entirely.

TONE CHARACTERISTICS
- Confident but measured.
- System-level perspective.
- Data-native and technology-literate.
- Outcome-oriented.
- Forward-looking, but not speculative.

PREFERRED VERBS
power, enable, connect, transform, contextualise, automate,
activate, optimise, streamline, ingest, distribute, enhance,
support, scale, unlock (sparingly)

AVOID
revolutionary, unbeatable, guaranteed, always, never,
game-changer (unless supported by proof),
risk-free, slang, idioms, hype-heavy phrasing

HEADLINE GUIDELINES
- Short, declarative.
- Can use controlled fragments for campaign tone.
- No exclamation marks.
- No exaggerated claims.

CLAIM CALIBRATION
Every material claim must answer at least one:
- How does it work?
- For whom?
- Toward what measurable outcome?
- Under what scope or condition?

If those are not clear, the copy is not aligned with Genius Sports’ brand voice.
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
{
  "revisedCopy": "string",
  "changeLog": ["string"]
}

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
    const changeLog = Array.isArray(parsed.changeLog)
      ? parsed.changeLog.filter((v): v is string => typeof v === "string" && v.trim().length > 0)
      : [];
    return { revisedCopy: parsed.revisedCopy, changeLog };
  } catch {
    return null;
  }
}

export async function* rewriteWithLLMStream(params: {
  originalCopy: string;
  analysis: Analysis;
  contentType: AnalyzeRequest["meta"]["contentType"];
}): AsyncGenerator<{ chunk: string; fullRevisedCopy: string }> {
  const client = getClient();
  if (!client) return;

  const lengthRule =
    params.contentType === "Social"
      ? "Length can change as needed for social clarity."
      : "Keep revised length within +/-15% of original.";

  const prompt = `
Rewrite this marketing copy according to constraints.
Output ONLY the revised copy. No JSON, no explanation, no labels—just the revised text.

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
    const stream = await client.chat.completions.create({
      model: MODEL,
      temperature: 0.2,
      stream: true,
      messages: [
        {
          role: "system",
          content: "You are a compliance-conscious copy editor. Output only the revised copy, nothing else."
        },
        { role: "user", content: prompt }
      ]
    });

    let fullRevisedCopy = "";
    for await (const part of stream) {
      const text = part.choices[0]?.delta?.content ?? "";
      if (text) {
        fullRevisedCopy += text;
        yield { chunk: text, fullRevisedCopy };
      }
    }
  } catch {
    // Generator will simply stop; caller can treat as failure if fullRevisedCopy is empty
  }
}
