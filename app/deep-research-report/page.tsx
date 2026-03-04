import type { Metadata } from "next";
import fs from "fs";
import path from "path";
import Image from "next/image";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";

import type { ReactNode } from "react";
import type { SectionConfig } from "../aeo-guidebook/sections-config";
import { GuidebookLayout } from "../aeo-guidebook/components/GuidebookLayout";
import { slugify } from "@/lib/slugify";

function getHeadingText(children: ReactNode): string {
  if (typeof children === "string") return children;
  if (typeof children === "number") return String(children);
  if (Array.isArray(children)) return children.map(getHeadingText).join("");
  if (children && typeof children === "object" && "props" in children) {
    return getHeadingText((children as { props: { children?: ReactNode } }).props.children);
  }
  return "";
}

export const metadata: Metadata = {
  title: "Deep Research Report — Genius Voice + Visibility QA",
  description:
    "AEO execution blueprint: Genius Sports web footprint, answer-engine narrative risk, and implementation roadmap.",
};

/** Strip citation placeholders (e.g. " cite turn14view0 ") for cleaner reading. */
function stripCitationTokens(md: string): string {
  return md
    .replace(/^\d+(?=#)/m, "") // leading digit before H1 (e.g. "2#")
    .replace(/\s+ (?:cite|filecite) (?:\s+turn\S+)+/g, " ")
    .replace(/\s{2,}/g, " ");
}

/** Extract H2–H4 headings from markdown and build TOC entries. */
function extractHeadings(md: string): SectionConfig[] {
  const lines = md.split("\n");
  const sections: SectionConfig[] = [];
  const headingRe = /^(#{2,4})\s+(.+)$/;
  for (const line of lines) {
    const m = line.match(headingRe);
    if (!m) continue;
    const level = m[1].length;
    if (level < 2 || level > 4) continue;
    const title = m[2].trim();
    const id = slugify(title);
    if (!id) continue;
    sections.push({ id, title, tocLabel: title });
  }
  return sections;
}

export default function DeepResearchReportPage() {
  const mdPath = path.join(process.cwd(), "deep-research-report.md");
  const rawMd = fs.readFileSync(mdPath, "utf-8");
  const content = stripCitationTokens(rawMd);
  const sections = extractHeadings(content);

  const sharedHeadingStyle = {
    scrollMarginTop: "5rem" as const,
    fontFamily: "var(--font-heading)",
  };

  const components: Components = {
    h1: ({ children }) => (
      <h1
        className="mt-0 mb-4"
        style={{ fontFamily: "var(--font-heading)", fontSize: "1.75rem" }}
      >
        {children}
      </h1>
    ),
    h2: ({ children }) => {
      const id = slugify(getHeadingText(children));
      return (
        <h2
          id={id}
          style={{
            ...sharedHeadingStyle,
            marginTop: "var(--space-6)",
            marginBottom: "var(--space-3)",
            fontSize: "1.375rem",
          }}
        >
          {children}
        </h2>
      );
    },
    h3: ({ children }) => {
      const id = slugify(getHeadingText(children));
      return (
        <h3
          id={id}
          style={{
            ...sharedHeadingStyle,
            marginTop: "var(--space-5)",
            marginBottom: "var(--space-2)",
            fontSize: "1.125rem",
          }}
        >
          {children}
        </h3>
      );
    },
    h4: ({ children }) => {
      const id = slugify(getHeadingText(children));
      return (
        <h4
          id={id}
          style={{
            ...sharedHeadingStyle,
            marginTop: "var(--space-4)",
            marginBottom: "var(--space-2)",
            fontSize: "1rem",
          }}
        >
          {children}
        </h4>
      );
    },
    p: ({ children }) => (
      <p style={{ marginBottom: "var(--space-3)", lineHeight: 1.6 }}>{children}</p>
    ),
    ul: ({ children }) => (
      <ul style={{ paddingLeft: "1.5rem", marginBottom: "var(--space-4)" }}>{children}</ul>
    ),
    ol: ({ children }) => (
      <ol style={{ paddingLeft: "1.625rem", marginBottom: "var(--space-4)" }}>{children}</ol>
    ),
    li: ({ children }) => (
      <li style={{ marginBottom: "0.5rem", lineHeight: 1.6 }}>{children}</li>
    ),
    table: ({ children }) => (
      <div
        style={{
          overflowX: "auto",
          marginBottom: "var(--space-4)",
          border: "1px solid var(--color-lightGrey)",
          borderRadius: "var(--radius-md)",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>{children}</table>
      </div>
    ),
    thead: ({ children }) => (
      <thead style={{ background: "var(--color-lightGrey)" }}>{children}</thead>
    ),
    th: ({ children }) => (
      <th
        style={{
          padding: "0.75rem 1rem",
          textAlign: "left",
          fontWeight: 500,
          borderBottom: "1px solid var(--color-lightGrey)",
          fontSize: "0.9375rem",
        }}
      >
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td
        style={{
          padding: "0.75rem 1rem",
          borderBottom: "1px solid var(--color-lightGrey)",
          fontSize: "0.9375rem",
          lineHeight: 1.5,
        }}
      >
        {children}
      </td>
    ),
    tr: ({ children }) => (
      <tr style={{ borderBottom: "1px solid var(--color-lightGrey)" }}>{children}</tr>
    ),
    strong: ({ children }) => <strong style={{ fontWeight: 500 }}>{children}</strong>,
  };

  return (
    <>
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
            <nav aria-label="Site navigation" className="flex items-center gap-2">
              <Link
                href="/aeo-guidebook"
                className="button button-outline"
                style={{ fontSize: "0.9375rem", padding: "0.5rem 1.25rem" }}
              >
                AEO Guidebook
              </Link>
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
            <h1 className="mt-0 mb-4">Deep Research Report</h1>
            <p
              style={{
                fontSize: "1.125rem",
                lineHeight: 1.6,
                opacity: 0.85,
                marginBottom: 0,
              }}
            >
              AEO execution blueprint: Genius Sports web footprint, answer-engine
              narrative risk, entity clarity, and 90-day implementation roadmap.
            </p>
          </div>
        </div>
      </header>

      <GuidebookLayout sections={sections}>
        <article
          style={{ paddingBottom: "var(--space-6)" }}
          className="prose-deep-research"
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
            {content}
          </ReactMarkdown>
        </article>
      </GuidebookLayout>
    </>
  );
}
