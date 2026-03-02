import type { Analysis, AnalyzeRequest, Issue } from "@/lib/schema";

const GENERAL_BANNED = [
  "game-changing",
  "revolutionary",
  "unmatched",
  "next-gen",
  "cutting-edge",
  "unlock",
  "empower",
  "seamless"
];

const BET_BANNED = [
  "guaranteed",
  "risk-free",
  "sure win",
  "easy money",
  "print profit",
  "beat the book"
];

const STRONG_ADJECTIVES = [
  "best",
  "leading",
  "premier",
  "world-class",
  "exceptional",
  "elite",
  "unrivaled",
  "innovative",
  "powerful",
  "advanced"
];

const PRODUCT_HINTS = ["platform", "solution", "suite", "product", "engine", "service", "tool", "api"];
const MECHANISM_CUES = ["by", "through", "using", "so that", "via"];
const PROOF_CUES = ["validated", "audited", "measured", "official"];
const CTA_VERBS = ["book", "request", "watch", "download", "contact", "talk"];
const RISKY_CLAIMS = ["guarantee", "always", "never", "proven", "risk-free", "certain", "100%"];

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

function normalize(input: string): string {
  return input.toLowerCase();
}

function findOffsets(text: string, phrase: string): Array<{ start: number; end: number }> {
  const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`\\b${escaped}\\b`, "gi");
  const matches: Array<{ start: number; end: number }> = [];
  let match: RegExpExecArray | null;
  while ((match = regex.exec(text)) !== null) {
    matches.push({ start: match.index, end: match.index + match[0].length });
  }
  return matches;
}

function hasHeading(copy: string): boolean {
  const lines = copy.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  return lines.some((line) => {
    if (/^#{1,6}\s+/.test(line) || /^H2:\s*/i.test(line) || /^H3:\s*/i.test(line)) {
      return true;
    }
    return /^[A-Z0-9\s:&-]{4,60}$/.test(line) && line.split(/\s+/).length <= 10;
  });
}

function snippetAt(copy: string, start: number, end: number): string {
  const left = Math.max(0, start - 30);
  const right = Math.min(copy.length, end + 30);
  return copy.slice(left, right).trim();
}

function makeIssue(
  engine: "voice" | "seo" | "aeo",
  severity: "blocker" | "high" | "medium" | "low",
  title: string,
  explanation: string,
  suggestion: string,
  offsets?: { start: number; end: number }
): Issue {
  return { engine, severity, title, explanation, suggestion, offsets };
}

export function runRuleBasedAnalysis(input: AnalyzeRequest): Analysis {
  const { copy, meta, primaryKeyword, cta } = input;
  const normalized = normalize(copy);
  const issues: Issue[] = [];
  const quickFixes: string[] = [];
  const riskyClaims = new Set<string>();
  const assumptions = new Set<string>();

  const banned = [...GENERAL_BANNED, ...(meta.vertical === "Bet" ? BET_BANNED : [])];
  for (const phrase of banned) {
    const offsets = findOffsets(copy, phrase);
    for (const offset of offsets) {
      const blocker = BET_BANNED.includes(phrase) && meta.vertical === "Bet";
      issues.push(
        makeIssue(
          "voice",
          blocker ? "blocker" : "high",
          `Banned phrase: "${phrase}"`,
          `The phrase "${phrase}" weakens evidence-led tone${blocker ? " and may create compliance risk for bet copy" : ""}.`,
          "Replace with a concrete capability, mechanism, or verified proof statement.",
          offset
        )
      );
      quickFixes.push(`Replace "${phrase}" with specific, verifiable language.`);
    }
  }

  for (const claim of RISKY_CLAIMS) {
    if (new RegExp(`\\b${claim.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i").test(copy)) {
      riskyClaims.add(claim);
    }
  }

  const paragraphs = copy.split(/\n{2,}/).filter((p) => p.trim().length > 0);
  paragraphs.forEach((paragraph, idx) => {
    const paraLower = normalize(paragraph);
    const hits = STRONG_ADJECTIVES.reduce((count, adjective) => {
      const matchCount = paraLower.match(new RegExp(`\\b${adjective.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "g"))?.length ?? 0;
      return count + matchCount;
    }, 0);
    if (hits > 3) {
      issues.push(
        makeIssue(
          "voice",
          "medium",
          `Adjective density high in paragraph ${idx + 1}`,
          "Heavy adjective usage can dilute clarity and credibility.",
          "Reduce modifiers and add specifics (numbers, named features, or explicit outcomes)."
        )
      );
      quickFixes.push(`Trim superlatives in paragraph ${idx + 1}.`);
    }
  });

  const hasProductNoun =
    /\b[A-Z][a-zA-Z0-9]{2,}\b/.test(copy) ||
    PRODUCT_HINTS.some((hint) => new RegExp(`\\b${hint}\\b`, "i").test(copy));
  const hasMechanism = MECHANISM_CUES.some((cue) => new RegExp(`\\b${cue}\\b`, "i").test(copy));
  const hasProof = /\b\d+(\.\d+)?%?\b/.test(copy) || PROOF_CUES.some((cue) => new RegExp(`\\b${cue}\\b`, "i").test(copy));
  const hasClearCta = CTA_VERBS.some((verb) => new RegExp(`\\b${verb}\\b`, "i").test(`${cta} ${copy}`));

  if (!hasProductNoun || !hasMechanism || !hasProof || !hasClearCta) {
    const missing: string[] = [];
    if (!hasProductNoun) missing.push("named product noun");
    if (!hasMechanism) missing.push("mechanism cue");
    if (!hasProof) missing.push("proof element");
    if (!hasClearCta) missing.push("clear CTA verb");
    issues.push(
      makeIssue(
        "voice",
        "high",
        "Minimum Viable Specificity (MVS) incomplete",
        `Missing: ${missing.join(", ")}.`,
        "Add at least one named capability, mechanism phrase, proof anchor, and explicit CTA."
      )
    );
    quickFixes.push(`Add missing MVS elements: ${missing.join(", ")}.`);
  }

  const first120Words = copy.split(/\s+/).slice(0, 120).join(" ");
  if (primaryKeyword && !new RegExp(primaryKeyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i").test(first120Words)) {
    issues.push(
      makeIssue(
        "seo",
        "high",
        "Primary keyword missing in first 120 words",
        "Search intent alignment is weaker when the primary topic appears late.",
        "Bring the primary keyword naturally into the opening section."
      )
    );
    quickFixes.push("Place the primary keyword in the intro paragraph.");
  }

  const headingNeeded = ["Blog", "SEO Pillar", "Landing Page"].includes(meta.contentType);
  if (headingNeeded && !hasHeading(copy)) {
    issues.push(
      makeIssue(
        "seo",
        "medium",
        "No heading structure detected",
        "Long-form content should include clear section headings for readability and crawlability.",
        "Add H2/H3 headings with intent-specific phrases."
      )
    );
    quickFixes.push("Add at least two meaningful section headings.");
  }

  const first200Words = copy.split(/\s+/).slice(0, 200).join(" ");
  if (
    primaryKeyword &&
    !new RegExp(`${primaryKeyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s+is\\s+`, "i").test(first200Words)
  ) {
    issues.push(
      makeIssue(
        "aeo",
        "medium",
        "No direct definition sentence early",
        "AEO benefits from an immediate definitional statement tied to the primary keyword.",
        `Add an opening sentence like "${primaryKeyword} is ...".`
      )
    );
    quickFixes.push("Add a definition sentence in the first section.");
  }

  const questionMarks = (copy.match(/\?/g) ?? []).length;
  if (!/\bFAQ\b/i.test(copy) && questionMarks < 2) {
    issues.push(
      makeIssue(
        "aeo",
        "medium",
        "FAQ coverage is weak",
        "Answer engines prefer concise Q&A blocks for retrieval.",
        "Add an FAQ section with at least two user questions and direct answers."
      )
    );
    quickFixes.push("Add a concise FAQ section with at least two Q&As.");
  }

  if (!/\b(revenue|cost|risk|engagement|decision quality)\b/i.test(copy)) {
    assumptions.add("Commercial outcomes are implied but not explicitly quantified.");
  }
  if (!/\b(US|UK|Intl)\b/i.test(copy)) {
    assumptions.add("Regional phrasing may require localization review.");
  }

  const issuePenalty = issues.reduce((score, issue) => {
    const delta =
      issue.severity === "blocker" ? 12 : issue.severity === "high" ? 8 : issue.severity === "medium" ? 5 : 2;
    return score + delta;
  }, 0);

  const voiceBase = 92;
  const seoBase = 88;
  const aeoBase = 86;

  const voicePenalty = issues.filter((i) => i.engine === "voice").length * 7 + issuePenalty * 0.25;
  const seoPenalty = issues.filter((i) => i.engine === "seo").length * 8 + issuePenalty * 0.2;
  const aeoPenalty = issues.filter((i) => i.engine === "aeo").length * 8 + issuePenalty * 0.2;

  const voiceTotal = clamp(Math.round(voiceBase - voicePenalty), 0, 100);
  const seoTotal = clamp(Math.round(seoBase - seoPenalty), 0, 100);
  const aeoTotal = clamp(Math.round(aeoBase - aeoPenalty), 0, 100);

  const analysis: Analysis = {
    meta,
    scores: {
      voice: {
        total: voiceTotal,
        subs: {
          evidenceLedAuthority: clamp(Math.round((voiceTotal / 100) * 25), 0, 25),
          precisionClarity: clamp(Math.round((voiceTotal / 100) * 20), 0, 20),
          commercialGrounding: clamp(Math.round((voiceTotal / 100) * 15), 0, 15),
          sportNative: clamp(Math.round((voiceTotal / 100) * 10), 0, 10),
          responsibilityCompliance: clamp(Math.round((voiceTotal / 100) * 20), 0, 20),
          globalClarity: clamp(Math.round((voiceTotal / 100) * 10), 0, 10)
        }
      },
      seo: {
        total: seoTotal,
        subs: {
          intentAlignment: clamp(Math.round((seoTotal / 100) * 25), 0, 25),
          structureHeadings: clamp(Math.round((seoTotal / 100) * 20), 0, 20),
          keywordUse: clamp(Math.round((seoTotal / 100) * 20), 0, 20),
          coverageCompleteness: clamp(Math.round((seoTotal / 100) * 20), 0, 20),
          internalLinking: clamp(Math.round((seoTotal / 100) * 15), 0, 15)
        }
      },
      aeo: {
        total: aeoTotal,
        subs: {
          directAnswerClarity: clamp(Math.round((aeoTotal / 100) * 30), 0, 30),
          snippetReadyBlocks: clamp(Math.round((aeoTotal / 100) * 25), 0, 25),
          faqQuality: clamp(Math.round((aeoTotal / 100) * 25), 0, 25),
          entityClarity: clamp(Math.round((aeoTotal / 100) * 20), 0, 20)
        }
      },
      overall: Math.round((voiceTotal + seoTotal + aeoTotal) / 3)
    },
    issues,
    quickFixes: [...new Set(quickFixes)],
    notes: {
      assumptionsToConfirm: [...assumptions],
      riskyClaims: [...riskyClaims]
    }
  };

  return analysis;
}

export function removeBannedPhrases(copy: string, vertical: AnalyzeRequest["meta"]["vertical"]) {
  const banned = [...GENERAL_BANNED, ...(vertical === "Bet" ? BET_BANNED : [])];
  let revised = copy;
  for (const phrase of banned) {
    const regex = new RegExp(`\\b${phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "gi");
    revised = revised.replace(regex, "");
  }
  // Collapse only spaces/tabs (preserve line and paragraph breaks)
  return revised.replace(/[ \t]{2,}/g, " ").replace(/[ \t]+\n/g, "\n").replace(/\n[ \t]+/g, "\n").trim();
}

export function issueSnippet(copy: string, issue: Issue): string | null {
  if (!issue.offsets) return null;
  return snippetAt(copy, issue.offsets.start, issue.offsets.end);
}
