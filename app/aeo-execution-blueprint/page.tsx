import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { readFileSync } from "fs";
import { join } from "path";

import { GuidebookLayout } from "@/app/aeo-guidebook/components/GuidebookLayout";
import { CtaRow } from "@/app/aeo-guidebook/components/CtaRow";
import { BlueprintMarkdown } from "./components/BlueprintMarkdown";
import type { SectionConfig } from "@/app/aeo-guidebook/sections-config";

export const metadata: Metadata = {
  title: "AEO Execution Blueprint — Genius Sports",
  description:
    "A deep-dive blueprint applying AEO principles to Genius Sports' public web footprint: auditing real-world properties, product narratives, and competitive gaps.",
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

/**
 * Strip internal citation artifacts produced by the research tool.
 *
 * The research tool embeds citation tokens using Unicode Private Use Area (PUA)
 * codepoints as delimiters:
 *   U+E200 = token start
 *   U+E202 = intra-token segment separator
 *   U+E201 = token end
 *
 * A token looks like: \uE200 cite \uE202 turn14view0 \uE202 turn32view1 \uE201
 * Stripping everything from U+E200 to U+E201 (inclusive) removes the entire token.
 *
 * Also handles the plain-text fallback form: :contentReference[oaicite:N]{index=N}
 */
function stripCitations(md: string): string {
  return md
    // Primary: PUA-delimited tokens (covers citeturn*, filecite*, and any future variants)
    .replace(/\uE200[^\uE201]*\uE201/g, "")
    // Fallback: plain-text :contentReference[oaicite:N]{index=N}
    .replace(/\s*:contentReference\[oaicite:\d+\]\{index=\d+\}/g, "")
    // Clean up any residual isolated PUA characters (U+E200, U+E201, U+E202)
    .replace(/[\uE200-\uE202]/g, "");
}

/** Match quoted strings: straight " or curly " " (U+201C, U+201D) */
const QUOTED_STRING = /["\u201C]([^"\u201D]*?)["\u201D]/g;

/**
 * Convert "Query fan-out set" blocks into structured markdown with section headers.
 *
 * Input format:
 *   **Query fan-out set**
 *   Primary: "query"
 *   Secondary buyer questions: "q1"; "q2"; ...
 *   Implementation: "q1"; "q2"; ...
 *   Risk/limitations: "q1"; "q2"; ...
 *   Comparisons: "q1"; "q2"; ...
 *
 * Output format:
 *   #### Query fan-out set
 *
 *   Primary
 *   <primary query>
 *
 *   **Secondary Buyer Questions**
 *   - "q1"
 *   - "q2"
 *
 *   **Implementation**
 *   - "q1"
 *
 *   **Risk Limitations**
 *   - "q1"
 *
 *   **Comparisons**
 *   - "q1"
 */
function formatQueryFanOutSets(md: string): string {
  const linePattern =
    /^(Primary|Secondary buyer questions|Implementation|Risk\/limitations|Comparisons):\s*(.+)$/;
  const lines = md.split("\n");
  const out: string[] = [];
  let lastWasFanOutHeading = false;

  for (const line of lines) {
    // Convert bold "Query fan-out set" marker to a real heading
    if (/^\*\*Query fan-out set\*\*\s*$/.test(line.trim())) {
      out.push("#### Query fan-out set");
      out.push("");
      lastWasFanOutHeading = true;
      continue;
    }

    const m = line.match(linePattern);
    if (!m) {
      if (lastWasFanOutHeading) lastWasFanOutHeading = false;
      out.push(line);
      continue;
    }
    const [, label, rest] = m;
    const trimmed = rest.trim();

    if (label === "Primary") {
      out.push("**Primary**");
      out.push(trimmed);
      out.push("");
      continue;
    }

    const items: string[] = [];
    let match: RegExpExecArray | null;
    QUOTED_STRING.lastIndex = 0;
    while ((match = QUOTED_STRING.exec(trimmed)) !== null) {
      items.push(match[1]);
    }
    if (items.length === 0) {
      out.push(line);
      continue;
    }
    const sectionTitles: Record<string, string> = {
      "Secondary buyer questions": "**Secondary Buyer Questions**",
      Implementation: "**Implementation**",
      "Risk/limitations": "**Risk Limitations**",
      Comparisons: "**Comparisons**",
    };
    out.push(sectionTitles[label] ?? `**${label}**`);
    for (const item of items) {
      out.push(`- "${item}"`);
    }
    out.push("");
  }

  return out.join("\n");
}

/** Extract H2 and H3 headings for TOC, skipping the H1 */
function extractTOCSections(md: string): SectionConfig[] {
  const sections: SectionConfig[] = [];
  for (const line of md.split("\n")) {
    const m = line.match(/^(#{2,3})\s+(.+)$/);
    if (m) {
      const level = m[1].length as 2 | 3;
      // Strip any inline markdown bold/italic/code from the heading text
      const raw = m[2].trim().replace(/\*\*(.+?)\*\*/g, "$1").replace(/`(.+?)`/g, "$1");
      sections.push({
        id: slugify(raw),
        title: raw,
        tocLabel: raw,
        level,
      });
    }
  }
  return sections;
}

export default function AeoExecutionBlueprintPage() {
  const raw = readFileSync(
    join(process.cwd(), "content", "deep-research-report.md"),
    "utf-8"
  );

  // Remove the H1 line (we render our own page title in the header)
  const withoutH1 = raw.replace(/^2?#[^#][^\n]*\n?/, "");
  const content = stripCitations(withoutH1);
  const formatted = formatQueryFanOutSets(content);
  const sections = extractTOCSections(formatted);

  return (
    <>
      {/* Page header */}
      <header
        className="pt-0 pb-4"
        style={{ borderBottom: "1px solid var(--color-lightGrey)" }}
      >
        <div className="container fade-in">
          <div className="flex items-center justify-between py-4">
            <Link href="/" aria-label="Back to Genius Voice + Visibility QA">
              <Image
                src="/brand/genius-logo-full.png"
                alt="Genius Sports"
                width={180}
                height={36}
                className="h-auto w-[130px] sm:w-[160px]"
                priority
              />
            </Link>
            <nav aria-label="Site navigation">
              <Link
                href="/"
                className="button button-outline"
                style={{ fontSize: "0.9375rem", padding: "0.5rem 1.25rem" }}
              >
                ← Back to Analyzer
              </Link>
            </nav>
          </div>

          <div style={{ paddingTop: "2rem", paddingBottom: "1.5rem", maxWidth: "52rem" }}>
            <h1 className="mt-0 mb-4">Genius Sports AEO Execution Blueprint</h1>
            <p
              style={{
                fontSize: "1.125rem",
                lineHeight: 1.6,
                opacity: 0.85,
                marginBottom: "var(--space-3)",
              }}
            >
              This blueprint tailors the AEO Playbook to Genius Sports&apos; public
              footprint—auditing the real-world web properties, product narratives, and
              competitive gaps that determine whether answer engines cite Genius or its
              competitors.
            </p>
            <p
              style={{
                fontSize: "1.125rem",
                lineHeight: 1.6,
                opacity: 0.85,
                marginBottom: 0,
              }}
            >
              Use it alongside the Analyzer to prioritize fixes that will move the needle
              on AI citation share across betting, media, advertising, and data integrity
              product categories.
            </p>
          </div>
        </div>
      </header>

      {/* Two-column layout */}
      <GuidebookLayout sections={sections}>
        <BlueprintMarkdown content={formatted} />
        <CtaRow label="Run your copy through the Analyzer" />
      </GuidebookLayout>
    </>
  );
}
