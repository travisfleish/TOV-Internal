import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { SECTIONS } from "./sections-config";
import { GuidebookLayout } from "./components/GuidebookLayout";
import { GuidebookSection } from "./components/GuidebookSection";
import { Callout } from "./components/Callout";
import { DoDont } from "./components/DoDont";
import { ExampleBlock } from "./components/ExampleBlock";
import { Checklist } from "./components/Checklist";
import { CtaRow } from "./components/CtaRow";

export const metadata: Metadata = {
  title: "AEO Guidebook — Genius Voice + Visibility QA",
  description:
    "Engineering inclusion in AI answers: how Genius Sports content earns retrieval, extraction, and citation by answer engines.",
};

export default function AeoGuidebookPage() {
  return (
    <>
      {/* ── Page header ── */}
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

          {/* Intro */}
          <div style={{ paddingTop: "2rem", paddingBottom: "1.5rem", maxWidth: "52rem" }}>
            <h1 className="mt-0 mb-2">AEO Guidebook</h1>
            <p
              style={{
                fontSize: "1rem",
                fontWeight: 500,
                letterSpacing: "-0.01em",
                opacity: 0.55,
                marginBottom: "var(--space-3)",
                marginTop: 0,
                textTransform: "uppercase",
              }}
            >
              Engineering Inclusion in AI Answers
            </p>
            <p
              style={{
                fontSize: "1.125rem",
                lineHeight: 1.6,
                opacity: 0.85,
                marginBottom: "var(--space-3)",
              }}
            >
              Answer Engine Optimization (AEO) is the practice of creating
              content that AI systems retrieve, extract, and cite when generating
              answers. Traditional SEO optimized for ranking in a list of links.
              AEO optimizes for inclusion inside a synthesized response.
            </p>
            <p
              style={{
                fontSize: "1.125rem",
                lineHeight: 1.6,
                opacity: 0.85,
                marginBottom: "var(--space-3)",
              }}
            >
              In answer-driven environments, users often never click. The model
              reads your content, extracts what it needs, and attributes the
              clearest, most defensible sources. If the model cannot quote you
              cleanly, you do not exist in the answer.
            </p>
            <p
              style={{
                fontSize: "1.125rem",
                lineHeight: 1.6,
                opacity: 0.85,
                marginBottom: 0,
              }}
            >
              This guide defines how Genius Sports content earns inclusion.
            </p>
          </div>
        </div>
      </header>

      {/* ── Two-column layout ── */}
      <GuidebookLayout sections={SECTIONS}>

        {/* ── Section 1: The Shift ── */}
        <GuidebookSection id="the-shift" title="1. The Shift: Rankings → Inclusion">
          <p>
            The SEO model is a familiar funnel: Publish → Rank → Earn the
            click → Convert. The AEO model is different in kind: Publish →
            Get retrieved → Get extracted → Get included → Influence the
            decision.
          </p>
          <p>
            AEO success is binary. You are either inside the answer or you are
            invisible. Incremental ranking improvements do not matter if you are
            not selected as a source. A page that ranks third but is never
            extracted contributes nothing to an AI-generated answer. A page
            that ranks tenth but contains a clean, quotable passage can define
            the model&apos;s response.
          </p>

          <Callout variant="warn">
            <p style={{ margin: 0 }}>
              AEO success is binary. You are either inside the answer or you
              are invisible. Incremental ranking improvements do not matter if
              you are not selected as a source.
            </p>
          </Callout>

          <CtaRow />
        </GuidebookSection>

        {/* ── Section 2: How Answer Engines Actually Work ── */}
        <GuidebookSection id="how-it-works" title="2. How Answer Engines Actually Work">
          <p>
            Modern answer engines operate in a multi-stage pipeline. Each stage
            is a gate — and your content must clear all of them to earn
            citation.
          </p>

          <h3 style={{ marginTop: "var(--space-5)" }}>A. Query Fan-Out</h3>
          <p>
            The model rewrites a human prompt into multiple clean search
            queries. A single question may fan out into five or ten distinct
            retrieval requests, each targeting a different facet of the
            original intent.
          </p>

          <h3 style={{ marginTop: "var(--space-5)" }}>B. Retrieval</h3>
          <p>
            The engine fetches candidate documents from its index based on the
            fan-out queries. Pages must be accessible, indexed, and not
            blocked by crawl restrictions to enter the candidate pool.
          </p>

          <h3 style={{ marginTop: "var(--space-5)" }}>C. Selection</h3>
          <p>
            From the candidate pool, the engine chooses which pages to actually
            open and read — based on URL, title, snippet, authority signals,
            and freshness. This is the &ldquo;cover&rdquo; stage: pages must
            look like the answer before they are opened.
          </p>

          <h3 style={{ marginTop: "var(--space-5)" }}>D. Passage Extraction</h3>
          <p>
            Once opened, the engine pulls short, self-contained passages that
            directly answer the query. These are typically 1–3 sentences that
            can stand alone without surrounding context. If your content
            requires setup before it makes sense, it will not be extracted.
          </p>

          <h3 style={{ marginTop: "var(--space-5)" }}>E. Synthesis</h3>
          <p>
            Extracted passages from multiple sources are combined into a
            structured response. The model may paraphrase, but it prefers
            language it can quote with confidence.
          </p>

          <h3 style={{ marginTop: "var(--space-5)" }}>F. Citation</h3>
          <p>
            Pages that contributed extractable content are cited. Pages that
            were retrieved but did not yield clean passages are not.
          </p>

          <Callout variant="warn">
            <strong style={{ display: "block", marginBottom: "0.25rem" }}>
              Core Rule
            </strong>
            <p style={{ margin: 0 }}>
              The model can only answer from what it fetched into context. Not
              what exists on your site. Not what it scanned. Only what it
              actually retrieved and could extract cleanly.
            </p>
          </Callout>

          <CtaRow />
        </GuidebookSection>

        {/* ── Section 3: The Three Gates of Inclusion ── */}
        <GuidebookSection id="three-gates" title="3. The Three Gates of Inclusion">
          <p>
            Every AEO failure reduces to one of three gates. A page that clears
            all three earns citation. A page that fails any one of them is
            invisible, regardless of how strong the rest of the content is.
          </p>

          <Callout variant="info">
            <strong style={{ display: "block", marginBottom: "0.25rem" }}>
              The Three Gates
            </strong>
            <p style={{ margin: 0 }}>
              Gate 1: <strong>Fetchable</strong> — Can the engine access and
              ingest the page?<br />
              Gate 2: <strong>Chosen</strong> — Does your page look like the
              answer before it is opened?<br />
              Gate 3: <strong>Extractable</strong> — Once opened, can the model
              lift a clean, quotable passage?
            </p>
          </Callout>

          <h3 style={{ marginTop: "var(--space-5)" }}>Gate 1: Fetchable</h3>
          <p>Can the engine access and ingest the page?</p>
          <Checklist
            items={[
              "Indexed by major search engines",
              "Not blocked by robots.txt",
              "Not gated behind authentication",
              "Not dependent on heavy JavaScript rendering",
              "Not locked behind paywalls",
            ]}
          />
          <p>If content cannot be crawled, it cannot be cited.</p>

          <h3 style={{ marginTop: "var(--space-5)" }}>Gate 2: Chosen</h3>
          <p>
            Does your page look like the answer before it is opened? Answer
            engines choose based on URL, title, snippet, and freshness signals.
            This is your &ldquo;cover.&rdquo; Pages that signal utility and
            direct relevance get opened. Pages that signal brand storytelling
            or vague positioning get skipped.
          </p>
          <p>Selection is intent-matching, not branding.</p>

          <DoDont
            dontText="We're Transforming the Future of Sports Data"
            doText="How Real-Time Sports Data Feeds In-Play Betting Models"
            dontLabel="Weak signal"
            doLabel="Strong signal"
          />

          <h3 style={{ marginTop: "var(--space-5)" }}>Gate 3: Extractable</h3>
          <p>
            Once opened, can the model lift a clean, quotable passage?
            Extraction fails when:
          </p>
          <ul>
            <li>The answer appears after long introductions</li>
            <li>Key claims live only in images or charts</li>
            <li>Content relies on surrounding context to be meaningful</li>
            <li>Paragraphs are vague or promotional</li>
            <li>The page tries to serve multiple conflicting purposes</li>
          </ul>
          <p>Winning content is answer-first, self-contained, dense, structured, and explicit.</p>

          <Callout variant="warn">
            <p style={{ margin: 0 }}>
              If it cannot be quoted cleanly in 1–3 sentences, it will not be
              cited.
            </p>
          </Callout>

          <CtaRow />
        </GuidebookSection>

        {/* ── Section 4: Writing for Extraction ── */}
        <GuidebookSection id="writing-for-extraction" title="4. Writing for Extraction">
          <p>
            Extraction is mechanical. Structure determines success. The
            following four mechanics raise extraction probability across every
            piece of content you publish.
          </p>

          <h3 style={{ marginTop: "var(--space-5)" }}>A. Lead With the Answer</h3>
          <p>
            Every section should open with a direct, explicit answer within the
            first ~120 words. Do not warm up with brand narrative. The first
            paragraph carries the highest extraction probability — answer
            engines prioritize passages near the top of sections.
          </p>

          <DoDont
            dontText="At Genius Sports, we've spent years building advanced tracking systems that have evolved through partnerships with the world's leading leagues and federations."
            doText="Genius Sports' optical tracking system captures 3D player positioning at 25 frames per second, enabling sub-second in-play analytics for sportsbooks and broadcasters."
            dontLabel="Brand narrative first"
            doLabel="Direct answer first"
          />

          <h3 style={{ marginTop: "var(--space-5)" }}>B. Write Self-Contained Paragraphs</h3>
          <p>
            Each paragraph must function independently. A model may extract a
            single paragraph without any surrounding context, so every
            paragraph needs to include: the entity (what you&apos;re
            describing), the claim (what&apos;s true about it), and any
            relevant conditions or scope.
          </p>
          <p>
            Avoid orphan pronouns and vague references. Define acronyms on
            first use: &ldquo;Gross Gaming Revenue (GGR).&rdquo; Use the
            entity&apos;s full name consistently — don&apos;t call it
            &ldquo;the platform&rdquo; in one paragraph and &ldquo;our
            solution&rdquo; in another. Consistency builds entity confidence.
          </p>

          <h3 style={{ marginTop: "var(--space-5)" }}>C. Use Extractable Formats</h3>
          <p>
            Extraction algorithms prefer structured formats. Write in forms
            that are modular by design — each item is self-contained and
            quotable independently.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div
              style={{
                background: "#f0fdf4",
                border: "1px solid #bbf7d0",
                padding: "1rem 1.25rem",
                borderRadius: "var(--radius-md)",
              }}
            >
              <strong
                style={{
                  display: "block",
                  color: "#15803d",
                  marginBottom: "0.5rem",
                  fontSize: "0.875rem",
                }}
              >
                ✓ Prefer
              </strong>
              <ul style={{ margin: 0, paddingLeft: "1.25rem", fontSize: "0.9375rem", lineHeight: 1.55 }}>
                <li>Definitions</li>
                <li>Numbered steps</li>
                <li>Comparison tables (in text)</li>
                <li>FAQ blocks</li>
                <li>Clear pros/cons</li>
                <li>Constraint-based breakdowns</li>
              </ul>
            </div>
            <div
              style={{
                background: "#fff1f2",
                border: "1px solid #fecdd3",
                padding: "1rem 1.25rem",
                borderRadius: "var(--radius-md)",
              }}
            >
              <strong
                style={{
                  display: "block",
                  color: "#be123c",
                  marginBottom: "0.5rem",
                  fontSize: "0.875rem",
                }}
              >
                ✗ Avoid
              </strong>
              <ul style={{ margin: 0, paddingLeft: "1.25rem", fontSize: "0.9375rem", lineHeight: 1.55 }}>
                <li>Narrative sprawl</li>
                <li>Dense walls of text</li>
                <li>Visual-only comparison tables</li>
              </ul>
            </div>
          </div>
          <p>
            If a chart contains a critical fact, restate it in text nearby.
          </p>

          <h3 style={{ marginTop: "var(--space-5)" }}>D. Build Fan-Out Coverage</h3>
          <p>
            After answering the main question, anticipate the next 3–5 logical
            follow-ups a reader would naturally ask. Each follow-up is an
            additional citation opportunity. A page that answers only its
            headline question misses every downstream query.
          </p>
          <p>
            FAQ blocks are highly extractable because each Q&amp;A pair is
            modular and self-contained. They also map directly onto the
            query fan-out stage: each question in an FAQ mirrors one of the
            sub-queries the engine generates from a broader prompt.
          </p>

          <CtaRow />
        </GuidebookSection>

        {/* ── Section 5: Trust & Defensibility ── */}
        <GuidebookSection id="trust-defensibility" title="5. Trust & Defensibility">
          <p>
            Answer engines weight content more heavily when it demonstrates
            expertise and credible constraints. Trustworthiness is not a soft
            signal — it directly affects extraction probability.
          </p>

          <h3 style={{ marginTop: "var(--space-5)" }}>A. Qualify Claims</h3>
          <p>
            Avoid unsupported superlatives. A claim a model cannot evaluate
            for plausibility is a claim it will not cite.
          </p>

          <DoDont
            dontText="Industry-leading real-time data."
            doText="Real-time data delivered with sub-second latency for in-play betting markets, under standard sportsbook load conditions."
            dontLabel="Weak — unsupported"
            doLabel="Strong — scoped and specific"
          />

          <p>Add qualification by including:</p>
          <ul>
            <li>
              <strong>Scope:</strong> &ldquo;for Tier 1 sportsbooks&rdquo;
            </li>
            <li>
              <strong>Time bounds:</strong> &ldquo;as of Q1 2025&rdquo;
            </li>
            <li>
              <strong>Conditions:</strong> &ldquo;under UKGC compliance
              requirements&rdquo;
            </li>
            <li>
              <strong>Evidence:</strong> &ldquo;based on 2024 client
              performance benchmarks&rdquo;
            </li>
          </ul>
          <p>Specificity increases citability.</p>

          <h3 style={{ marginTop: "var(--space-5)" }}>B. Anchor Claims in Verifiable Signals</h3>
          <p>
            A single precise data point strengthens extraction more than
            multiple vague claims. Use concrete metrics, named partnerships,
            defined thresholds, and cited research. Avoid stacking unrelated
            statistics in one paragraph — it dilutes the extractability of
            each one.
          </p>

          <h3 style={{ marginTop: "var(--space-5)" }}>C. State Limitations</h3>
          <p>
            Trustworthiness increases when boundaries are acknowledged.
            Acknowledging scope boundaries signals intellectual honesty, and
            models are increasingly able to detect overclaiming.
          </p>

          <Callout variant="info">
            <p style={{ margin: 0 }}>
              <strong>Example of a trust-building limitation:</strong>{" "}
              &ldquo;This solution performs best in high-volume, structured
              event data environments.&rdquo; Content that reads as
              unqualified marketing copy is discounted.
            </p>
          </Callout>

          <h3 style={{ marginTop: "var(--space-5)" }}>D. Maintain Cross-Site Consistency</h3>
          <p>
            If one page claims &ldquo;real-time&rdquo; and another says
            &ldquo;15-minute refresh,&rdquo; models detect the inconsistency.
            Inconsistencies compound globally — a contradiction on one page
            can reduce confidence in claims across the entire site.
          </p>
          <p>Audit claims across:</p>
          <ul>
            <li>Product pages</li>
            <li>FAQs</li>
            <li>Docs</li>
            <li>Case studies</li>
            <li>Press releases</li>
          </ul>

          <Callout variant="warn">
            <p style={{ margin: 0 }}>
              Answer engines cross-reference your site against third-party
              mentions, review platforms, and partner pages. Contradictions
              between owned and earned content reduce model confidence in all
              your claims.
            </p>
          </Callout>

          <CtaRow />
        </GuidebookSection>

        {/* ── Section 6: Competitive Inclusion Strategy ── */}
        <GuidebookSection id="competitive-inclusion" title="6. Competitive Inclusion Strategy">
          <p>
            Extraction alone does not guarantee inclusion. Inclusion is
            competitive. Being well-structured is necessary but not sufficient
            — you also need to understand the ecosystem you are competing in.
          </p>

          <h3 style={{ marginTop: "var(--space-5)" }}>A. Visibility vs Rank</h3>
          <p>
            <strong>Visibility</strong> is how often your brand appears in AI
            answers. <strong>Rank</strong> is your position relative to
            competitors in those answers. Visibility can rise for everyone
            simultaneously — a growing topic means more answers mentioning
            more brands. Rank determines whether you are winning.
          </p>
          <p>Always measure inclusion relative to competitors, not in isolation.</p>

          <h3 style={{ marginTop: "var(--space-5)" }}>B. The Citation Supply Chain</h3>
          <p>
            Answer engines repeatedly cite the same types of sources per
            topic. Some topics favor institutional sites (regulatory bodies,
            Wikipedia), publisher listicles, industry research, company blogs,
            or community platforms. The mix varies by topic and platform.
          </p>
          <p>
            Understanding the supply chain determines strategy. If publishers
            dominate a topic, earned media may be required. If company blogs
            dominate, owned content can compete directly. AEO is not only
            writing — it is supply chain positioning.
          </p>

          <h3 style={{ marginTop: "var(--space-5)" }}>C. Platform Divergence</h3>
          <p>
            Different AI platforms rely on different citation ecosystems. One
            platform may heavily cite YouTube transcripts and community
            discussions. Another may prioritize institutional domains and
            corporate research pages. Performance variance across platforms is
            diagnostic, not random — it tells you which content types and
            distribution channels matter for each platform.
          </p>

          <CtaRow />
        </GuidebookSection>

        {/* ── Section 7: Topic & Prompt Architecture ── */}
        <GuidebookSection id="topic-prompt-architecture" title="7. Topic & Prompt Architecture">
          <p>
            Winning broadly requires structure. Not every piece of content
            serves the same citation purpose. Mapping your content to topic
            types prevents gaps and avoids duplication.
          </p>

          <h3 style={{ marginTop: "var(--space-5)" }}>A. Coverage Topics</h3>
          <p>
            Broad category presence. Example: &ldquo;Sports data
            providers.&rdquo; Goal: ensure visibility in the category
            conversation. These topics are high-volume and competitive — owned
            content must be exceptionally well-structured to compete.
          </p>

          <h3 style={{ marginTop: "var(--space-5)" }}>B. Depth Topics</h3>
          <p>
            Highly specific, compound prompts. Example: &ldquo;Real-time sports
            data provider for regulated European sportsbooks.&rdquo;
            Specificity forces selectivity and creates opportunity. Fewer
            sources compete for these queries, and the extraction bar is lower
            because less content exists. Depth builds authority.
          </p>

          <h3 style={{ marginTop: "var(--space-5)" }}>C. Commercial Framing</h3>
          <p>
            To earn recommendation inclusion, target prompts that require
            evaluation. These are the queries where buyers are actively
            choosing:
          </p>
          <ul>
            <li>Best X</li>
            <li>Top providers of X</li>
            <li>Alternatives to [competitor]</li>
            <li>X vs Y</li>
            <li>Platforms for [specific constraint]</li>
          </ul>

          <Callout variant="info">
            <p style={{ margin: 0 }}>
              Avoid seeding measurement prompts with your brand name. Prompts
              like &ldquo;What does Genius Sports offer?&rdquo; measure brand
              recall, not competitive inclusion. Use category and commercial
              prompts to accurately measure how you appear in real buyer
              queries.
            </p>
          </Callout>

          <CtaRow />
        </GuidebookSection>

        {/* ── Section 8: Optimize vs Create New ── */}
        <GuidebookSection id="optimize-vs-create" title="8. Optimize vs Create New">
          <p>
            Not every inclusion gap requires new content. Before creating
            net-new pages, diagnose why existing content is failing.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div
              style={{
                background: "#eff6ff",
                border: "1px solid var(--color-blue)",
                padding: "1rem 1.25rem",
                borderRadius: "var(--radius-md)",
              }}
            >
              <strong
                style={{
                  display: "block",
                  color: "var(--color-blue)",
                  marginBottom: "0.75rem",
                  fontSize: "0.875rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                Optimize Existing Pages When
              </strong>
              <ul style={{ margin: 0, paddingLeft: "1.25rem", fontSize: "0.9375rem", lineHeight: 1.65 }}>
                <li>The topic matches the winning prompt</li>
                <li>
                  The issue is structure, clarity, or extractability — not
                  topic fit
                </li>
                <li>The page suffers from mixed identity</li>
              </ul>
            </div>
            <div
              style={{
                background: "#fff7ed",
                border: "1px solid var(--color-orange)",
                padding: "1rem 1.25rem",
                borderRadius: "var(--radius-md)",
              }}
            >
              <strong
                style={{
                  display: "block",
                  color: "var(--color-orange)",
                  marginBottom: "0.75rem",
                  fontSize: "0.875rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                Create Net New When
              </strong>
              <ul style={{ margin: 0, paddingLeft: "1.25rem", fontSize: "0.9375rem", lineHeight: 1.65 }}>
                <li>Your page is too broad for the winning query</li>
                <li>Competitors own a more specific angle</li>
                <li>The supply chain rewards a different format</li>
              </ul>
            </div>
          </div>

          <p>Specificity wins over breadth.</p>

          <CtaRow />
        </GuidebookSection>

        {/* ── Section 9: The AEO Operating Loop ── */}
        <GuidebookSection id="operating-loop" title="9. The AEO Operating Loop">
          <p>
            AEO is continuous. A single audit or content sprint is not a
            programme. The supply chain shifts, competitors improve, and
            platforms update their citation logic. The operating loop keeps
            you moving.
          </p>

          {[
            {
              step: "Setup",
              description:
                "Define priority topics and competitors. Establish your baseline inclusion rate across target queries.",
            },
            {
              step: "Analyze",
              description:
                "Identify inclusion gaps and supply chain shifts. Which topics are you missing from? Which competitors are winning them?",
            },
            {
              step: "Generate",
              description:
                "Ship targeted improvements — optimize existing pages or create net new content for the specific gap identified.",
            },
            {
              step: "Engineer",
              description:
                "Systematize monitoring and iteration. Build repeatable processes for tracking inclusion and triggering content reviews.",
            },
          ].map(({ step, description }, i, arr) => (
            <div
              key={step}
              style={{
                display: "flex",
                gap: "1rem",
                padding: "1rem 0",
                borderBottom:
                  i < arr.length - 1
                    ? "1px solid var(--color-lightGrey)"
                    : undefined,
                alignItems: "flex-start",
              }}
            >
              <div
                style={{
                  flexShrink: 0,
                  width: "2rem",
                  height: "2rem",
                  borderRadius: "50%",
                  background: "var(--color-navy)",
                  color: "var(--color-white)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                }}
              >
                {i + 1}
              </div>
              <div>
                <strong style={{ display: "block", marginBottom: "0.25rem" }}>
                  {step}
                </strong>
                <p style={{ margin: 0, opacity: 0.8, lineHeight: 1.6 }}>
                  {description}
                </p>
              </div>
            </div>
          ))}

          <p style={{ marginTop: "var(--space-4)" }}>
            One topic. One improvement. Every cycle.
          </p>

          <CtaRow />
        </GuidebookSection>

        {/* ── Section 10: Publishing Standard ── */}
        <GuidebookSection id="publishing-standard" title="10. Genius Sports AEO Publishing Standard">
          <p>
            Before publishing any content intended for AI inclusion, confirm
            each item below. This is the minimum standard for content to be
            considered AEO-ready.
          </p>

          <div
            style={{
              border: "2px solid var(--color-navy)",
              borderRadius: "var(--radius-md)",
              overflow: "hidden",
              marginBottom: "var(--space-5)",
            }}
          >
            <div
              style={{
                background: "var(--color-navy)",
                color: "var(--color-white)",
                padding: "0.875rem 1.25rem",
                fontWeight: 500,
                letterSpacing: "-0.01em",
              }}
            >
              Genius Sports AEO Publishing Standard
            </div>
            <div style={{ padding: "1.25rem" }}>
              {[
                {
                  category: "Direct answer early",
                  check:
                    "The direct answer appears within the first ~120 words.",
                },
                {
                  category: "Entity clarity",
                  check:
                    "All key entities are explicitly named — no orphan pronouns or vague references.",
                },
                {
                  category: "Extractable format",
                  check:
                    "At least one extractable format is used (definition, numbered steps, FAQ, comparison table).",
                },
                {
                  category: "Text-first for key facts",
                  check:
                    "Key facts appear in text — not only in visuals, charts, or images.",
                },
                {
                  category: "Evidence + scope",
                  check:
                    "Major claims include scope or evidence. No bare superlatives.",
                },
                {
                  category: "No unsupported superlatives",
                  check:
                    "Superlatives are replaced with specifics (metrics, conditions, named scope).",
                },
                {
                  category: "Acronyms defined",
                  check: "All acronyms are defined on first use.",
                },
                {
                  category: "Consistent across site",
                  check:
                    "Claims do not contradict other owned content (product pages, docs, FAQs, case studies).",
                },
                {
                  category: "Fan-out coverage",
                  check:
                    "The piece answers the primary question and logical follow-up questions.",
                },
                {
                  category: "Single identity",
                  check:
                    "The page has a single, clear identity and purpose — not multiple competing intents.",
                },
              ].map(({ category, check }, i, arr) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: "1rem",
                    alignItems: "flex-start",
                    padding: "0.75rem 0",
                    borderBottom:
                      i < arr.length - 1
                        ? "1px solid var(--color-lightGrey)"
                        : undefined,
                  }}
                >
                  <span
                    aria-hidden="true"
                    style={{
                      flexShrink: 0,
                      width: "1.25rem",
                      height: "1.25rem",
                      border: "2px solid var(--color-navy)",
                      borderRadius: "0.25rem",
                      display: "inline-block",
                      marginTop: "0.125rem",
                    }}
                  />
                  <div>
                    <strong style={{ display: "block", marginBottom: "0.2rem" }}>
                      {category}
                    </strong>
                    <span style={{ opacity: 0.75, fontSize: "0.9375rem" }}>
                      {check}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Callout variant="tip">
            <strong style={{ display: "block", marginBottom: "0.25rem" }}>
              Final Principle
            </strong>
            <p style={{ margin: 0 }}>
              We are no longer competing for attention in a list of links. We
              are competing to be the sentence the model uses. Structure
              determines extraction. Specificity determines credibility.
              Positioning determines inclusion. That is AEO at Genius Sports.
            </p>
          </Callout>

          <CtaRow label="Run your copy through the Analyzer" />
        </GuidebookSection>

      </GuidebookLayout>
    </>
  );
}
