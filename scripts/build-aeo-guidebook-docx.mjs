/**
 * Builds AEO-Guidebook.docx from the AEO guidebook content.
 * Run: node scripts/build-aeo-guidebook-docx.mjs
 * Output: AEO-Guidebook.docx in project root.
 */

import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  BorderStyle,
} from "docx";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const outPath = path.join(rootDir, "AEO-Guidebook.docx");

function p(text) {
  return new Paragraph({ children: [new TextRun(text)], spacing: { after: 200 } });
}

function h2(text) {
  return new Paragraph({
    children: [new TextRun({ text, size: 28 })], // 14pt — section header
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 320, after: 200 },
  });
}

function h3(text) {
  return new Paragraph({
    children: [new TextRun({ text, size: 22 })], // 11pt — subheader size, smaller than section headers
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 280, after: 160 },
  });
}

function callout(paragraph, variant = "info") {
  return [
    new Paragraph({
      children: [new TextRun({ text: paragraph, italics: false })],
      shading: { fill: variant === "warn" ? "FFF3CD" : variant === "tip" ? "D4EDDA" : "D1ECF1" },
      border: { left: { style: BorderStyle.SINGLE, size: 4, color: "333333" } },
      spacing: { before: 160, after: 160 },
      indent: { left: 360 },
    }),
  ];
}

function bulletItem(text) {
  return new Paragraph({
    children: [new TextRun(text)],
    bullet: { level: 0 },
    spacing: { after: 100 },
  });
}

const doc = new Document({
  title: "AEO Guidebook",
  description: "A practical guide to Answer Engine Optimization: how to write content that gets cited by AI-generated answers.",
  creator: "Genius Voice + Visibility QA",
  sections: [
    {
      properties: {},
      children: [
        h2("AEO Guidebook"),
        p(
          "Answer Engine Optimization (AEO) is the practice of writing content that gets cited in AI-generated answers—not just ranked in traditional search. As AI assistants, generative search, and featured snippets synthesize responses from across the web, being included requires writing that machines can extract cleanly and attribute with confidence."
        ),
        p(
          "For B2B brands, the stakes are high: a buyer asking an AI \"which platforms lead in attribution?\" only sees the names the model can support with evidence. The brands that get cited are the ones that wrote to be quoted. This guidebook shows you how."
        ),

        // Section 1
        h2("1. The shift: SEO → AEO"),
        p(
          "Traditional SEO optimizes for ranking—getting your page near the top of a results list so users click through. AEO optimizes for citation—writing content that answer engines extract, paraphrase, and attribute in a synthesized response. The goal isn't the click; it's the answer."
        ),
        p(
          "Modern answer engines don't serve a list of links. They read across many sources and compose a response, citing the pages that provided the clearest, most directly extractable information. Your page may rank well in classic search but never appear in an AI-generated answer if the content isn't structured for extraction."
        ),
        p(
          "Answer-forward search means the user may never visit your page at all. The engine reads it for them and quotes the best passages. If your key claim is buried in paragraph four, buried in a brand anecdote, or lives only inside a chart image, it won't be quoted."
        ),
        ...callout(
          "\"If a model can't quote you cleanly, you don't exist in the answer.\"",
          "warn"
        ),

        // Section 2
        h2("2. How answer engines work"),
        p(
          "Answer engines don't work like a search index lookup. They run a multi-stage pipeline that determines which content gets extracted and which gets passed over."
        ),
        h3("Retrieval"),
        p(
          "The engine fetches candidate documents—pages it deems relevant to the query based on existing indices, crawl data, and freshness signals."
        ),
        h3("Relevance checks"),
        p(
          "Each document is scored for topical match, authority signals, and structural clarity. Thin pages, duplicate content, or poorly organized text score lower."
        ),
        h3("Passage extraction"),
        p(
          "The engine identifies short, self-contained passages that directly address the query—usually 1–3 sentences that can stand alone without surrounding context."
        ),
        h3("Synthesis"),
        p(
          "Extracted passages are combined into a coherent answer. The model may paraphrase but prefers language it can quote with confidence."
        ),
        h3("Citations"),
        p(
          "Sources are attributed. Pages whose extracted passages contributed meaningfully get cited; pages that were retrieved but didn't produce clean passages often don't."
        ),
        h3("What this means for writers"),
        bulletItem(
          "Short, precise answers win over comprehensive ones — extractable precision beats coverage breadth"
        ),
        bulletItem(
          "The first paragraph of each section matters most — that's where passages are pulled from"
        ),
        bulletItem(
          "Never rely on images, charts, or tables to carry key facts — restate them in text"
        ),
        bulletItem(
          "Define terms and acronyms where they first appear — don't assume shared context"
        ),
        bulletItem(
          "Each paragraph should answer a specific question, not just introduce a topic"
        ),
        bulletItem(
          "Consistent language across your site builds entity confidence in the model"
        ),

        // Section 3
        h2("3. The anatomy of AEO-ready content"),
        p(
          "AEO-ready content is built around four structural mechanics. Each one increases the probability that your content gets extracted and cited."
        ),
        h3("Answer-first blocks"),
        p(
          "Lead every section with the direct answer to the question it addresses. Don't warm up with context, brand narrative, or qualifications—get to the substance within the first ~120 words. Answer engines prioritize passages near the top of sections, so burying the lede costs you citations."
        ),
        p("Don't: At Acme, we've spent years developing our approach to attribution. Our team of experts has refined our methodology through countless client engagements, and today we're excited to share how our platform handles multi-touch attribution."),
        p("Do: Acme's multi-touch attribution model distributes credit across all touchpoints in a conversion path using a time-decay weighting algorithm. The model weights recent interactions more heavily and supports lookback windows from 7 to 90 days."),
        h3("Self-contained paragraphs"),
        p(
          "Each paragraph should work as a standalone excerpt. Include the entity (what you're describing), the predicate (what's true about it), and any necessary conditions. Don't rely on context from surrounding paragraphs to make a sentence meaningful."
        ),
        p(
          "Spell out acronyms on first use: \"Answer Engine Optimization (AEO).\" Use consistent entity names throughout—don't call it \"the platform\" in one paragraph and \"our solution\" in another. Ambiguity lowers model confidence."
        ),
        h3("Extractable units"),
        p(
          "Write in formats that extraction algorithms prefer: definitions, numbered steps, comparison tables, and FAQ blocks. These are modular by design—each item is self-contained and quotable independently of the surrounding text."
        ),
        p("Fluffy step list: Our onboarding process is designed around your success. We start with a discovery call where we get to know your goals, then move into the setup phase where our team helps configure the system. From there, we work with you to import your data and get everything connected. Finally, you're ready to run."),
        p("Extractable step list: Onboarding takes three steps: (1) Discovery call (30 min): Map your attribution goals, data sources, and team structure. (2) Platform setup (1–3 days): Acme's team configures your workspace, integrations, and user permissions. (3) Data import: Connect your ad platforms, CRM, and analytics tools. Most clients are live within 5 business days. The extractable version is modular: each step is independently quotable, time-bounded, and entity-clear."),
        h3("Fan-out coverage"),
        p(
          "After answering the primary question, anticipate the follow-up questions a buyer would naturally ask. Each logical next question is an opportunity for an additional citation—and covering them prevents competitors from owning those answers."
        ),
        p(
          "FAQ sections are especially effective for fan-out coverage because each Q&A pair is structurally extractable. Example from an attribution platform:"
        ),
        new Paragraph({ text: "Q: What is multi-touch attribution?", spacing: { before: 120, after: 60 } }),
        p("A: Multi-touch attribution assigns credit for a conversion to multiple touchpoints in a customer's journey rather than to a single interaction. It helps marketers understand which channels and campaigns contribute to outcomes across the full funnel."),
        new Paragraph({ text: "Q: How does Acme's attribution model differ from last-click?", spacing: { before: 120, after: 60 } }),
        p("A: Last-click attribution assigns 100% of conversion credit to the final touchpoint before conversion. Acme distributes credit across all touches using configurable weighting—time-decay by default—giving a more accurate picture of how each channel contributes."),
        new Paragraph({ text: "Q: Does Acme support cross-device attribution?", spacing: { before: 120, after: 60 } }),
        p("A: Yes. Acme links touchpoints across devices using deterministic identity matching (logged-in user data) and probabilistic modeling (device fingerprinting). Cross-device attribution is available on Standard and Enterprise plans."),
        new Paragraph({ text: "Q: What lookback window does Acme use?", spacing: { before: 120, after: 60 } }),
        p("A: The default lookback window is 30 days. Customers can configure windows from 7 to 90 days at the campaign level depending on their typical sales cycle."),
        new Paragraph({ text: "Q: Can I use Acme alongside my existing analytics tools?", spacing: { before: 120, after: 60 } }),
        p("A: Acme integrates with Google Analytics, Adobe Analytics, and most major CRMs and ad platforms. Attribution data can be exported via API or synced to your data warehouse on a configurable schedule."),

        // Section 4
        h2("4. Trust & defensibility"),
        p(
          "E-E-A-T stands for Experience, Expertise, Authoritativeness, and Trustworthiness. It originated in Google's Search Quality Rater Guidelines as a framework for human evaluators to assess content quality, and has since been adopted—explicitly or implicitly—by the ranking and synthesis logic of most major answer engines. Models weight content more heavily when it demonstrates credible, first-hand knowledge, consistent positioning, and claims that can be independently verified."
        ),
        p(
          "For AEO, E-E-A-T is less about structured markup and more about writing behaviour: how you qualify claims, what evidence you anchor them to, and whether your content sounds like it was written by someone who actually knows the subject. Three of the four dimensions map directly onto copy structure and are covered below."
        ),
        ...callout(
          "Why Experience isn't a sub-section here. In consumer and editorial publishing, the \"Experience\" dimension is demonstrated through first-hand narrative—a doctor writing from clinical practice, a mechanic from the garage floor. In B2B brand content, Experience signals work differently: they live in proof points rather than prose structure—customer case studies, proprietary benchmark data, named authors with verifiable credentials, and third-party validation. Those are content strategy and programme decisions, not copy-writing patterns. This guide focuses on structural writing mechanics that apply to every piece you publish; Experience-layer signals (case studies, data reports, author bios) deserve their own programme guidance and are outside this scope.",
          "info"
        ),
        h3("Qualify claims with scope and conditions — Authoritativeness"),
        p(
          "Don't write \"the fastest platform.\" Write \"the fastest platform for real-time in-play betting markets, processing up to 50,000 events per second.\" The first version is an unsupported superlative. The second is a claim a model can extract, evaluate for plausibility, and cite with confidence."
        ),
        p("Good qualification patterns:"),
        bulletItem("Scope: \"for mid-market B2B SaaS companies with 100–1,000 seat deployments\""),
        bulletItem("Conditions: \"under standard US regulatory requirements\""),
        bulletItem("Time-bounded: \"as of Q1 2025\""),
        bulletItem("Evidence-cited: \"per our 2024 State of Attribution report\""),
        p("Don't: Acme is the industry-leading attribution platform trusted by the world's top brands."),
        p("Do: Acme is the attribution platform of record for 8 of the top 20 global sports betting operators by GGR volume, as of 2024."),
        h3("Add evidence without turning it into a research paper — Expertise"),
        p(
          "A single well-placed data point is worth more than three paragraphs of analysis. Use evidence to anchor claims, not to make every paragraph feel academic. Link to source material when you cite external data—this builds trust with both readers and models."
        ),
        p(
          "Aim for one specific, verifiable fact per major claim. Avoid stacking multiple statistics in a single paragraph; it dilutes the extractability of each one."
        ),
        h3("State limitations without undermining positioning — Trustworthiness"),
        p(
          "Acknowledging scope boundaries increases credibility with answer engines. \"Acme works best for teams with structured, high-volume event data; if you're early-stage with limited touchpoints, lighter tools may suffice\" is more trustworthy—and more quotable—than an everything-is-possible pitch."
        ),
        p(
          "Limitations signal intellectual honesty. Models are increasingly able to detect overclaiming, and content that reads as promotional without substance tends to be underweighted."
        ),
        ...callout(
          "Answer engines are trained to recognize and discount overclaiming. Superlatives without evidence don't just fail to get cited—they can reduce confidence in the surrounding claims on the same page.",
          "warn"
        ),
        ...callout(
          "Consistency across sources matters. Answer engines cross-reference your site against third-party mentions, review platforms, and partner pages. If your homepage says \"real-time data\" but your docs say \"refreshes every 15 minutes,\" models register the inconsistency. Audit your claims across all owned and earned content.",
          "info"
        ),

        // Section 5
        h2("5. Mistakes that kill citations"),
        p(
          "Most AEO failures aren't about keywords or metadata. They're structural writing problems that make content impossible to extract cleanly. Here are the most common ones."
        ),
        h3("Burying the answer"),
        p(
          "The key claim appears in paragraph four after two paragraphs of setup and brand narrative. By the time you get to the point, the extraction pass has moved on. Lead every section with the answer."
        ),
        h3("Vague superlatives"),
        p(
          "\"Industry-leading,\" \"best-in-class,\" \"world-class,\" \"cutting-edge.\" These are noise. Models can't evaluate them and don't cite them. Specificity beats superlatives every time."
        ),
        h3("Topic sprawl"),
        p(
          "A page that lightly covers ten adjacent topics may rank well via traditional SEO but is too diffuse for extraction. Each page should answer one primary question with depth, not skim ten questions with breadth."
        ),
        h3("Comparisons only in images"),
        p(
          "Competitive tables, diagrams, and infographic summaries that live exclusively in image files are invisible to answer engines. Any fact worth claiming should appear in text, even if it also appears in a visual."
        ),
        h3("Undefined acronyms"),
        p(
          "SEM, MTA, LTV, GGR, DSP—if your content assumes the reader knows your industry shorthand, the model may be uncertain enough to skip the citation. Define on first use, every time."
        ),
        h3("Contradictory claims across pages"),
        p(
          "Your product page says \"real-time data.\" Your FAQ says \"data refreshes every 15 minutes.\" Your docs say \"near-real-time.\" Models register these inconsistencies and lower confidence in your claims across the whole site."
        ),
        h3("Freshness theater"),
        p(
          "\"Last updated March 2025\" in a footer doesn't help if the content itself hasn't changed. Models increasingly evaluate whether updates actually changed substantive content, not just the timestamp. Update the date only when the content changes."
        ),

        // Section 6
        h2("6. One-page cheat sheet"),
        p(
          "Use this as a final checklist before publishing any piece of content you want cited by answer engines."
        ),
        new Paragraph({
          text: "AEO Readiness Checklist",
          shading: { fill: "1E3A5F" },
          spacing: { before: 240, after: 120 },
        }),
        bulletItem("Direct answer early: The answer to the section's primary question appears within the first ~120 words."),
        bulletItem("Entity clarity: Every key claim names the entity explicitly — no orphan pronouns or vague references to 'the solution.'"),
        bulletItem("Extractable units: At least one section uses a format optimized for extraction: numbered steps, definition, comparison table, or FAQ."),
        bulletItem("Fan-out questions: You've covered the top 3–5 follow-up questions a buyer would naturally ask after reading this page."),
        bulletItem("Evidence + constraints: Every major claim includes a scope qualifier, a data point, or a stated condition — no bare superlatives."),
        bulletItem("Text-first for key facts: Key facts that appear in charts, tables, or images are also stated in plain text nearby."),
        bulletItem("Acronyms defined: All industry acronyms are spelled out on first use within this page."),
        bulletItem("Consistent across site: Claims here don't contradict what's written on related pages, docs, or third-party listings."),
        ...callout(
          "Run your draft through the Analyzer before publishing. The AEO score flags the most common extraction blockers—undefined acronyms, buried answers, and superlatives without evidence.",
          "tip"
        ),
      ],
    },
  ],
});

const buffer = await Packer.toBuffer(doc);
fs.writeFileSync(outPath, buffer);
console.log("Wrote:", outPath);
