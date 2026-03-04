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
    "A practical guide to Answer Engine Optimization: how to write content that gets cited by AI-generated answers.",
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
            <nav aria-label="Site navigation" className="flex items-center gap-2">
              <Link
                href="/deep-research-report"
                className="button button-outline"
                style={{ fontSize: "0.9375rem", padding: "0.5rem 1.25rem" }}
              >
                Deep Research Report
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

          {/* Intro */}
          <div style={{ paddingTop: "2rem", paddingBottom: "1.5rem", maxWidth: "52rem" }}>
            <h1 className="mt-0 mb-4">AEO Guidebook</h1>
            <p
              style={{
                fontSize: "1.125rem",
                lineHeight: 1.6,
                opacity: 0.85,
                marginBottom: "var(--space-3)",
              }}
            >
              Answer Engine Optimization (AEO) is the practice of writing
              content that gets cited in AI-generated answers—not just ranked in
              traditional search. As AI assistants, generative search, and
              featured snippets synthesize responses from across the web, being
              included requires writing that machines can extract cleanly and
              attribute with confidence.
            </p>
            <p
              style={{
                fontSize: "1.125rem",
                lineHeight: 1.6,
                opacity: 0.85,
                marginBottom: 0,
              }}
            >
              For B2B brands, the stakes are high: a buyer asking an AI "which
              platforms lead in attribution?" only sees the names the model can
              support with evidence. The brands that get cited are the ones that
              wrote to be quoted. This guidebook shows you how.
            </p>
          </div>
        </div>
      </header>

      {/* ── Two-column layout ── */}
      <GuidebookLayout sections={SECTIONS}>
        {/* ── Section 1: The shift ── */}
        <GuidebookSection id="shift" title="The shift: SEO → AEO">
          <p>
            Traditional SEO optimizes for ranking—getting your page near the
            top of a results list so users click through. AEO optimizes for
            citation—writing content that answer engines extract, paraphrase,
            and attribute in a synthesized response. The goal isn&apos;t the
            click; it&apos;s the answer.
          </p>
          <p>
            Modern answer engines don&apos;t serve a list of links. They read
            across many sources and compose a response, citing the pages that
            provided the clearest, most directly extractable information. Your
            page may rank well in classic search but never appear in an
            AI-generated answer if the content isn&apos;t structured for
            extraction.
          </p>
          <p>
            <strong>Answer-forward search</strong> means the user may never
            visit your page at all. The engine reads it for them and quotes the
            best passages. If your key claim is buried in paragraph four, buried
            in a brand anecdote, or lives only inside a chart image, it
            won&apos;t be quoted.
          </p>

          <Callout variant="warn">
            <p style={{ margin: 0 }}>
              "If a model can&apos;t quote you cleanly, you don&apos;t exist in
              the answer."
            </p>
          </Callout>

          <CtaRow />
        </GuidebookSection>

        {/* ── Section 2: How it works ── */}
        <GuidebookSection id="how-it-works" title="How answer engines work">
          <p>
            Answer engines don&apos;t work like a search index lookup. They run
            a multi-stage pipeline that determines which content gets extracted
            and which gets passed over.
          </p>

          <ol style={{ paddingLeft: "1.625rem", marginBottom: "var(--space-4)" }}>
            <li style={{ marginBottom: "0.75rem" }}>
              <strong>Retrieval.</strong> The engine fetches candidate
              documents—pages it deems relevant to the query based on existing
              indices, crawl data, and freshness signals.
            </li>
            <li style={{ marginBottom: "0.75rem" }}>
              <strong>Relevance checks.</strong> Each document is scored for
              topical match, authority signals, and structural clarity. Thin
              pages, duplicate content, or poorly organized text score lower.
            </li>
            <li style={{ marginBottom: "0.75rem" }}>
              <strong>Passage extraction.</strong> The engine identifies short,
              self-contained passages that directly address the query—usually
              1–3 sentences that can stand alone without surrounding context.
            </li>
            <li style={{ marginBottom: "0.75rem" }}>
              <strong>Synthesis.</strong> Extracted passages are combined into a
              coherent answer. The model may paraphrase but prefers language it
              can quote with confidence.
            </li>
            <li>
              <strong>Citations.</strong> Sources are attributed. Pages whose
              extracted passages contributed meaningfully get cited; pages that
              were retrieved but didn&apos;t produce clean passages often
              don&apos;t.
            </li>
          </ol>

          <Checklist
            title="What this means for writers"
            items={[
              "Short, precise answers win over comprehensive ones — extractable precision beats coverage breadth",
              "The first paragraph of each section matters most — that's where passages are pulled from",
              "Never rely on images, charts, or tables to carry key facts — restate them in text",
              "Define terms and acronyms where they first appear — don't assume shared context",
              "Each paragraph should answer a specific question, not just introduce a topic",
              "Consistent language across your site builds entity confidence in the model",
            ]}
          />

          <CtaRow />
        </GuidebookSection>

        {/* ── Section 3: Anatomy ── */}
        <GuidebookSection
          id="anatomy"
          title="The anatomy of AEO-ready content"
        >
          <p>
            AEO-ready content is built around four structural mechanics. Each
            one increases the probability that your content gets extracted and
            cited.
          </p>

          {/* 3.1 Answer-first blocks */}
          <h3 style={{ marginTop: "var(--space-5)" }}>
            3.1 Answer-first blocks
          </h3>
          <p>
            Lead every section with the direct answer to the question it
            addresses. Don&apos;t warm up with context, brand narrative, or
            qualifications—get to the substance within the first ~120 words.
            Answer engines prioritize passages near the top of sections, so
            burying the lede costs you citations.
          </p>

          <DoDont
            dontText="At Acme, we've spent years developing our approach to attribution. Our team of experts has refined our methodology through countless client engagements, and today we're excited to share how our platform handles multi-touch attribution."
            doText="Acme's multi-touch attribution model distributes credit across all touchpoints in a conversion path using a time-decay weighting algorithm. The model weights recent interactions more heavily and supports lookback windows from 7 to 90 days."
            dontLabel="Long intro first"
            doLabel="Direct answer first"
          />

          {/* 3.2 Self-contained paragraphs */}
          <h3 style={{ marginTop: "var(--space-5)" }}>
            3.2 Self-contained paragraphs
          </h3>
          <p>
            Each paragraph should work as a standalone excerpt. Include the
            entity (what you&apos;re describing), the predicate (what&apos;s
            true about it), and any necessary conditions. Don&apos;t rely on
            context from surrounding paragraphs to make a sentence meaningful.
          </p>
          <p>
            Spell out acronyms on first use: "Answer Engine Optimization (AEO)."
            Use consistent entity names throughout—don&apos;t call it "the
            platform" in one paragraph and "our solution" in another. Ambiguity
            lowers model confidence.
          </p>

          {/* 3.3 Extractable units */}
          <h3 style={{ marginTop: "var(--space-5)" }}>
            3.3 Extractable units
          </h3>
          <p>
            Write in formats that extraction algorithms prefer: definitions,
            numbered steps, comparison tables, and FAQ blocks. These are modular
            by design—each item is self-contained and quotable independently of
            the surrounding text.
          </p>

          <ExampleBlock
            beforeLabel="Fluffy step list"
            afterLabel="Extractable step list"
            before={`Our onboarding process is designed around your success. We start with a discovery call where we get to know your goals, then move into the setup phase where our team helps configure the system. From there, we work with you to import your data and get everything connected. Finally, you're ready to run.`}
            after={`Onboarding takes three steps:\n1. Discovery call (30 min): Map your attribution goals, data sources, and team structure.\n2. Platform setup (1–3 days): Acme's team configures your workspace, integrations, and user permissions.\n3. Data import: Connect your ad platforms, CRM, and analytics tools. Most clients are live within 5 business days.`}
            note="The 'After' version is modular: each step is independently quotable, time-bounded, and entity-clear."
          />

          {/* 3.4 Fan-out coverage */}
          <h3 style={{ marginTop: "var(--space-5)" }}>
            3.4 Fan-out coverage
          </h3>
          <p>
            After answering the primary question, anticipate the follow-up
            questions a buyer would naturally ask. Each logical next question is
            an opportunity for an additional citation—and covering them prevents
            competitors from owning those answers.
          </p>
          <p>
            FAQ sections are especially effective for fan-out coverage because
            each Q&amp;A pair is structurally extractable. Here&apos;s an
            example from an attribution platform:
          </p>

          <div
            style={{
              border: "1px solid var(--color-lightGrey)",
              borderRadius: "var(--radius-md)",
              overflow: "hidden",
              marginBottom: "var(--space-4)",
            }}
          >
            {[
              {
                q: "What is multi-touch attribution?",
                a: "Multi-touch attribution assigns credit for a conversion to multiple touchpoints in a customer's journey rather than to a single interaction. It helps marketers understand which channels and campaigns contribute to outcomes across the full funnel.",
              },
              {
                q: "How does Acme's attribution model differ from last-click?",
                a: "Last-click attribution assigns 100% of conversion credit to the final touchpoint before conversion. Acme distributes credit across all touches using configurable weighting—time-decay by default—giving a more accurate picture of how each channel contributes.",
              },
              {
                q: "Does Acme support cross-device attribution?",
                a: "Yes. Acme links touchpoints across devices using deterministic identity matching (logged-in user data) and probabilistic modeling (device fingerprinting). Cross-device attribution is available on Standard and Enterprise plans.",
              },
              {
                q: "What lookback window does Acme use?",
                a: "The default lookback window is 30 days. Customers can configure windows from 7 to 90 days at the campaign level depending on their typical sales cycle.",
              },
              {
                q: "Can I use Acme alongside my existing analytics tools?",
                a: "Acme integrates with Google Analytics, Adobe Analytics, and most major CRMs and ad platforms. Attribution data can be exported via API or synced to your data warehouse on a configurable schedule.",
              },
            ].map(({ q, a }, i) => (
              <div
                key={i}
                style={{
                  padding: "1rem 1.25rem",
                  borderBottom:
                    i < 4 ? "1px solid var(--color-lightGrey)" : undefined,
                }}
              >
                <p
                  style={{ margin: "0 0 0.4rem", fontWeight: 500 }}
                >
                  Q: {q}
                </p>
                <p style={{ margin: 0, opacity: 0.85, lineHeight: 1.6 }}>
                  A: {a}
                </p>
              </div>
            ))}
          </div>

          <CtaRow />
        </GuidebookSection>

        {/* ── Section 4: Trust & defensibility ── */}
        <GuidebookSection id="trust" title="Trust & defensibility">
          <p>
            E-E-A-T stands for <strong>Experience, Expertise,
            Authoritativeness, and Trustworthiness</strong>. It originated in
            Google&apos;s Search Quality Rater Guidelines as a framework for
            human evaluators to assess content quality, and has since been
            adopted—explicitly or implicitly—by the ranking and synthesis logic
            of most major answer engines. Models weight content more heavily
            when it demonstrates credible, first-hand knowledge, consistent
            positioning, and claims that can be independently verified.
          </p>
          <p>
            For AEO, E-E-A-T is less about structured markup and more about
            writing behaviour: how you qualify claims, what evidence you anchor
            them to, and whether your content sounds like it was written by
            someone who actually knows the subject. Three of the four dimensions
            map directly onto copy structure and are covered below.
          </p>

          <Callout variant="info">
            <p style={{ margin: 0 }}>
              <strong>Why Experience isn&apos;t a sub-section here.</strong>{" "}
              In consumer and editorial publishing, the &ldquo;Experience&rdquo;
              dimension is demonstrated through first-hand narrative—a doctor
              writing from clinical practice, a mechanic from the garage floor.
              In B2B brand content, Experience signals work differently: they
              live in proof points rather than prose structure—customer case
              studies, proprietary benchmark data, named authors with verifiable
              credentials, and third-party validation. Those are content
              strategy and programme decisions, not copy-writing patterns. This
              guide focuses on structural writing mechanics that apply to every
              piece you publish; Experience-layer signals (case studies, data
              reports, author bios) deserve their own programme guidance and are
              outside this scope.
            </p>
          </Callout>

          <h3 style={{ marginTop: "var(--space-5)" }}>
            Qualify claims with scope and conditions{" "}
            <span style={{ fontWeight: 400, opacity: 0.55, fontSize: "0.9rem" }}>
              — Authoritativeness
            </span>
          </h3>
          <p>
            Don&apos;t write "the fastest platform." Write "the fastest platform
            for real-time in-play betting markets, processing up to 50,000
            events per second." The first version is an unsupported superlative.
            The second is a claim a model can extract, evaluate for plausibility,
            and cite with confidence.
          </p>

          <p>Good qualification patterns:</p>
          <ul>
            <li>
              <strong>Scope:</strong> "for mid-market B2B SaaS companies with
              100–1,000 seat deployments"
            </li>
            <li>
              <strong>Conditions:</strong> "under standard US regulatory
              requirements"
            </li>
            <li>
              <strong>Time-bounded:</strong> "as of Q1 2025"
            </li>
            <li>
              <strong>Evidence-cited:</strong> "per our 2024 State of
              Attribution report"
            </li>
          </ul>

          <DoDont
            dontText="Acme is the industry-leading attribution platform trusted by the world's top brands."
            doText="Acme is the attribution platform of record for 8 of the top 20 global sports betting operators by GGR volume, as of 2024."
            dontLabel="Unsupported superlative"
            doLabel="Scoped, evidence-anchored claim"
          />

          <h3 style={{ marginTop: "var(--space-5)" }}>
            Add evidence without turning it into a research paper{" "}
            <span style={{ fontWeight: 400, opacity: 0.55, fontSize: "0.9rem" }}>
              — Expertise
            </span>
          </h3>
          <p>
            A single well-placed data point is worth more than three paragraphs
            of analysis. Use evidence to anchor claims, not to make every
            paragraph feel academic. Link to source material when you cite
            external data—this builds trust with both readers and models.
          </p>
          <p>
            Aim for one specific, verifiable fact per major claim. Avoid
            stacking multiple statistics in a single paragraph; it dilutes the
            extractability of each one.
          </p>

          <h3 style={{ marginTop: "var(--space-5)" }}>
            State limitations without undermining positioning{" "}
            <span style={{ fontWeight: 400, opacity: 0.55, fontSize: "0.9rem" }}>
              — Trustworthiness
            </span>
          </h3>
          <p>
            Acknowledging scope boundaries increases credibility with answer
            engines. "Acme works best for teams with structured, high-volume
            event data; if you&apos;re early-stage with limited touchpoints,
            lighter tools may suffice" is more trustworthy—and more
            quotable—than an everything-is-possible pitch.
          </p>
          <p>
            Limitations signal intellectual honesty. Models are increasingly
            able to detect overclaiming, and content that reads as promotional
            without substance tends to be underweighted.
          </p>

          <Callout variant="warn">
            <p style={{ margin: 0 }}>
              Answer engines are trained to recognize and discount overclaiming.
              Superlatives without evidence don&apos;t just fail to get
              cited—they can reduce confidence in the surrounding claims on the
              same page.
            </p>
          </Callout>

          <Callout variant="info">
            <p style={{ margin: 0 }}>
              <strong>Consistency across sources matters.</strong> Answer engines
              cross-reference your site against third-party mentions, review
              platforms, and partner pages. If your homepage says "real-time
              data" but your docs say "refreshes every 15 minutes," models
              register the inconsistency. Audit your claims across all owned and
              earned content.
            </p>
          </Callout>

          <CtaRow />
        </GuidebookSection>

        {/* ── Section 5: Mistakes ── */}
        <GuidebookSection id="mistakes" title="Mistakes that kill citations">
          <p>
            Most AEO failures aren&apos;t about keywords or metadata. They&apos;re
            structural writing problems that make content impossible to extract
            cleanly. Here are the most common ones.
          </p>

          <ol style={{ paddingLeft: "1.625rem" }}>
            <li style={{ marginBottom: "1rem" }}>
              <strong>Burying the answer.</strong> The key claim appears in
              paragraph four after two paragraphs of setup and brand narrative.
              By the time you get to the point, the extraction pass has moved
              on. Lead every section with the answer.
            </li>
            <li style={{ marginBottom: "1rem" }}>
              <strong>Vague superlatives.</strong> "Industry-leading,"
              "best-in-class," "world-class," "cutting-edge." These are noise.
              Models can&apos;t evaluate them and don&apos;t cite them.
              Specificity beats superlatives every time.
            </li>
            <li style={{ marginBottom: "1rem" }}>
              <strong>Topic sprawl.</strong> A page that lightly covers ten
              adjacent topics may rank well via traditional SEO but is too
              diffuse for extraction. Each page should answer one primary
              question with depth, not skim ten questions with breadth.
            </li>
            <li style={{ marginBottom: "1rem" }}>
              <strong>Comparisons only in images.</strong> Competitive tables,
              diagrams, and infographic summaries that live exclusively in image
              files are invisible to answer engines. Any fact worth claiming
              should appear in text, even if it also appears in a visual.
            </li>
            <li style={{ marginBottom: "1rem" }}>
              <strong>Undefined acronyms.</strong> SEM, MTA, LTV, GGR, DSP—if
              your content assumes the reader knows your industry shorthand, the
              model may be uncertain enough to skip the citation. Define on
              first use, every time.
            </li>
            <li style={{ marginBottom: "1rem" }}>
              <strong>Contradictory claims across pages.</strong> Your product
              page says "real-time data." Your FAQ says "data refreshes every 15
              minutes." Your docs say "near-real-time." Models register these
              inconsistencies and lower confidence in your claims across the
              whole site.
            </li>
            <li>
              <strong>Freshness theater.</strong> "Last updated March 2025" in a
              footer doesn&apos;t help if the content itself hasn&apos;t
              changed. Models increasingly evaluate whether updates actually
              changed substantive content, not just the timestamp. Update the
              date only when the content changes.
            </li>
          </ol>

          <CtaRow />
        </GuidebookSection>

        {/* ── Section 6: Cheat sheet ── */}
        <GuidebookSection id="cheat-sheet" title="One-page cheat sheet">
          <p>
            Use this as a final checklist before publishing any piece of content
            you want cited by answer engines.
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
              AEO Readiness Checklist
            </div>
            <div style={{ padding: "1.25rem" }}>
              {[
                {
                  category: "Direct answer early",
                  check:
                    "The answer to the section's primary question appears within the first ~120 words.",
                },
                {
                  category: "Entity clarity",
                  check:
                    "Every key claim names the entity explicitly — no orphan pronouns or vague references to 'the solution.'",
                },
                {
                  category: "Extractable units",
                  check:
                    "At least one section uses a format optimized for extraction: numbered steps, definition, comparison table, or FAQ.",
                },
                {
                  category: "Fan-out questions",
                  check:
                    "You've covered the top 3–5 follow-up questions a buyer would naturally ask after reading this page.",
                },
                {
                  category: "Evidence + constraints",
                  check:
                    "Every major claim includes a scope qualifier, a data point, or a stated condition — no bare superlatives.",
                },
                {
                  category: "Text-first for key facts",
                  check:
                    "Key facts that appear in charts, tables, or images are also stated in plain text nearby.",
                },
                {
                  category: "Acronyms defined",
                  check:
                    "All industry acronyms are spelled out on first use within this page.",
                },
                {
                  category: "Consistent across site",
                  check:
                    "Claims here don't contradict what's written on related pages, docs, or third-party listings.",
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
            <p style={{ margin: 0 }}>
              Run your draft through the Analyzer before publishing. The AEO
              score flags the most common extraction blockers—undefined acronyms,
              buried answers, and superlatives without evidence.
            </p>
          </Callout>

          <CtaRow label="Run your copy through the Analyzer" />
        </GuidebookSection>
      </GuidebookLayout>
    </>
  );
}
