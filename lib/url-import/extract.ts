import { Readability } from "@mozilla/readability";
import { JSDOM } from "jsdom";
import { validateUrl, UrlImportError } from "./security";

const MAX_BYTES = 1_000_000; // 1 MB
const MAX_TEXT_CHARS = 50_000;
const FETCH_TIMEOUT_MS = 10_000;
const MAX_REDIRECTS = 5;
const MIN_WORDS = 50;

// Tags whose subtrees we always discard during serialisation
const SKIP_TAGS = new Set([
  "script", "style", "noscript", "svg", "img",
  "nav", "header", "footer", "aside",
  "form", "button", "input", "select", "textarea",
  "iframe", "canvas", "video", "audio",
]);

// ---------------------------------------------------------------------------
// DOM serialiser
// ---------------------------------------------------------------------------

function serializeNode(node: Node): string {
  if (node.nodeType === 3 /* TEXT_NODE */) {
    return node.textContent ?? "";
  }
  if (node.nodeType !== 1 /* ELEMENT_NODE */) return "";

  const el = node as Element;
  const tag = el.tagName.toLowerCase();
  if (SKIP_TAGS.has(tag)) return "";

  const childText = Array.from(el.childNodes).map(serializeNode).join("");
  const trimmed = childText.trim();
  if (!trimmed) return "";

  switch (tag) {
    case "h1": return `# ${trimmed}\n\n`;
    case "h2": return `## ${trimmed}\n\n`;
    case "h3": return `### ${trimmed}\n\n`;
    case "h4":
    case "h5":
    case "h6": return `#### ${trimmed}\n\n`;
    case "p": return `${trimmed}\n\n`;
    case "br": return "\n";
    case "li": return `- ${trimmed}\n`;
    case "ul":
    case "ol": return `${trimmed}\n\n`;
    case "blockquote": return `> ${trimmed}\n\n`;
    case "pre":
    case "code": return `${trimmed}\n\n`;
    default: return childText;
  }
}

function cleanText(raw: string): string {
  return raw.replace(/\n{3,}/g, "\n\n").trim();
}

/** Serialise an arbitrary HTML fragment string to plain text. */
function htmlFragmentToText(html: string): string {
  const dom = new JSDOM(`<div>${html}</div>`);
  return cleanText(serializeNode(dom.window.document.body));
}

// ---------------------------------------------------------------------------
// Extraction strategies
// ---------------------------------------------------------------------------

/**
 * Strategy 1 — Readability.
 * Best for traditional article/blog pages with clear HTML structure.
 */
function readabilityExtract(
  rawHtml: string,
  pageUrl: string
): { text: string; title?: string } | null {
  const dom = new JSDOM(rawHtml, { url: pageUrl });
  const article = new Readability(dom.window.document).parse();
  if (!article?.content) return null;

  const fragmentDom = new JSDOM(article.content, { url: pageUrl });
  const text = cleanText(
    serializeNode(
      fragmentDom.window.document.body ?? fragmentDom.window.document.documentElement
    )
  );
  return { text, title: article.title?.trim() || undefined };
}

/**
 * Strategy 2 — Aggressive DOM extraction.
 * Strips non-content elements and looks for semantic roots.
 * Works for pages where Readability can't identify an article structure.
 */
function aggressiveExtract(rawHtml: string, pageUrl: string): string {
  const dom = new JSDOM(rawHtml, { url: pageUrl });
  const doc = dom.window.document;

  for (const tag of [
    "script", "style", "noscript", "nav", "header", "footer",
    "aside", "form", "iframe", "svg", "canvas", "video", "audio",
  ]) {
    for (const el of Array.from(doc.getElementsByTagName(tag))) el.remove();
  }

  const root =
    doc.querySelector("main") ??
    doc.querySelector("article") ??
    doc.querySelector("[role='main']") ??
    doc.querySelector(
      ".content, #content, .main-content, #main-content, " +
      ".post-content, .entry-content, .article-body, .article-content, " +
      ".blog-content, .page-content, .rich-text"
    ) ??
    doc.body ??
    doc.documentElement;

  return cleanText(serializeNode(root));
}

/**
 * Strategy 3 — Next.js / framework JSON extraction.
 *
 * Many modern sites (Next.js, Nuxt, Gatsby, etc.) embed full page data as
 * JSON inside a <script id="__NEXT_DATA__"> or similar tag. The actual prose
 * content lives there, invisible to DOM-based parsers.
 *
 * Uses a key-aware walker that skips known non-article subtrees (nav, footer,
 * related articles, testimonials, SEO meta, etc.) to avoid pulling in junk.
 */

// JSON object keys whose entire subtrees are skipped — they contain page
// chrome, related content, or metadata rather than the main article body.
const JSON_SKIP_KEYS = new Set([
  // Page chrome
  "navigation", "nav", "navbar", "header", "footer", "menu", "megamenu",
  "sidebar", "breadcrumb", "breadcrumbs", "pagination", "topNav", "bottomNav",
  // Related / recommended — NOT the current article
  "related", "relatedArticles", "related_articles", "relatedContent",
  "related_content", "recommended", "moreContent", "moreLikeThis",
  "featuredArticles", "trending", "popular", "latestPosts", "recentPosts",
  "otherArticles", "moreStories", "alsoRead",
  // Social proof / marketing
  "testimonials", "testimonial", "reviews", "quotes", "customerStories",
  "caseStudies", "case_studies", "partners", "logos", "awards", "clients", "brands",
  // CTAs / promos / ads
  "cta", "callToAction", "call_to_action", "banners", "promos",
  "promotions", "ads", "advertising", "campaigns",
  // Media / events (unless the page IS about these)
  "events", "webinars", "upcomingEvents", "videos", "gallery", "podcast",
  // Tracking / SEO meta
  "seo", "openGraph", "og", "twitterCard", "twitter", "schema",
  "analytics", "tracking", "gtm", "pixels", "scripts", "head",
  // Social sharing
  "social", "socialLinks", "shareLinks", "socialShare", "share",
  // Misc noise
  "comments", "resources", "downloads", "press", "pressReleases",
  "images", "media", "tags", "categories", "authors",
]);

function nextDataExtract(rawHtml: string): { text: string; title?: string } | null {
  const patterns = [
    /<script[^>]+id=["']__NEXT_DATA__["'][^>]*>([\s\S]*?)<\/script>/i,
    /<script[^>]+type=["']application\/json["'][^>]*>([\s\S]*?)<\/script>/i,
  ];

  let jsonStr: string | undefined;
  for (const pattern of patterns) {
    const match = rawHtml.match(pattern);
    if (match?.[1]) { jsonStr = match[1]; break; }
  }
  if (!jsonStr) return null;

  let json: unknown;
  try { json = JSON.parse(jsonStr); } catch { return null; }

  const parts: string[] = [];
  let extractedTitle: string | undefined;

  function walk(value: unknown, depth: number, key?: string): void {
    if (depth > 30) return;

    if (typeof value === "string") {
      const trimmed = value.trim();

      // Capture article title from well-known CMS title keys
      if (
        !extractedTitle &&
        key &&
        ["title", "headline", "pageTitle", "articleTitle"].includes(key) &&
        trimmed.length > 10 && trimmed.length < 200
      ) {
        extractedTitle = trimmed;
      }

      // Discard obvious non-prose
      if (trimmed.length < 40) return;
      if (!trimmed.includes(" ")) return;
      if (trimmed.startsWith("http") || trimmed.startsWith("//") || trimmed.startsWith("/")) return;
      if (/^[a-z0-9_-]+$/i.test(trimmed)) return;
      if (/^[A-Z_]{3,}$/.test(trimmed)) return;
      if (trimmed.split(/\s+/).length < 5) return;

      // Rich-text HTML stored in JSON (common in Contentful, Sanity, Storyblok, etc.)
      if (/<[a-z][^>]*>/i.test(trimmed)) {
        const parsed = htmlFragmentToText(trimmed);
        if (wordCount(parsed) >= 5) parts.push(parsed);
        return;
      }

      // Plain prose
      if (/[a-zA-Z]/.test(trimmed)) {
        parts.push(trimmed);
      }

    } else if (Array.isArray(value)) {
      for (const item of value) walk(item, depth + 1);

    } else if (value !== null && typeof value === "object") {
      for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
        // Skip entire non-article subtrees
        if (JSON_SKIP_KEYS.has(k)) continue;
        walk(v, depth + 1, k);
      }
    }
  }

  walk(json, 0);
  if (parts.length === 0) return null;

  // Deduplicate — CMSes often repeat teaser text inside the article object
  const seen = new Set<string>();
  const unique = parts.filter((p) => {
    if (seen.has(p)) return false;
    seen.add(p);
    return true;
  });

  return { text: unique.join("\n\n"), title: extractedTitle };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function wordCount(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

// ---------------------------------------------------------------------------
// Fetch
// ---------------------------------------------------------------------------

async function safeFetch(
  startUrl: URL,
  timeoutMs: number
): Promise<{ body: string; finalUrl: URL }> {
  let currentUrl = startUrl;
  let redirectCount = 0;

  while (true) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    let response: Response;
    try {
      response = await fetch(currentUrl.href, {
        redirect: "manual",
        signal: controller.signal,
        headers: {
          "User-Agent": "ToneOfVoiceBot/1.0 (content import; contact: internal)",
          Accept: "text/html,application/xhtml+xml",
          "Accept-Encoding": "identity",
        },
      });
    } catch (err) {
      clearTimeout(timer);
      const isAbort =
        err instanceof Error && (err.name === "AbortError" || err.message.includes("aborted"));
      throw new UrlImportError(isAbort ? "TIMEOUT" : "SSRF_BLOCKED", "URL is not accessible.");
    } finally {
      clearTimeout(timer);
    }

    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get("location");
      if (!location) throw new UrlImportError("SSRF_BLOCKED", "URL is not accessible.");
      if (redirectCount >= MAX_REDIRECTS) throw new UrlImportError("SSRF_BLOCKED", "URL is not accessible.");
      redirectCount++;
      currentUrl = await validateUrl(new URL(location, currentUrl.href).href);
      continue;
    }

    if (!response.ok) throw new UrlImportError("NO_CONTENT", "The page returned an error.");

    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.includes("text/html")) {
      throw new UrlImportError("NOT_HTML", "Only HTML pages are supported.");
    }

    const reader = response.body?.getReader();
    if (!reader) throw new UrlImportError("NO_CONTENT", "Could not read page body.");

    const chunks: Uint8Array[] = [];
    let totalBytes = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      totalBytes += value.byteLength;
      if (totalBytes > MAX_BYTES) {
        await reader.cancel();
        throw new UrlImportError("TOO_LARGE", "The page is too large to import.");
      }
      chunks.push(value);
    }

    const combined = new Uint8Array(totalBytes);
    let offset = 0;
    for (const chunk of chunks) { combined.set(chunk, offset); offset += chunk.byteLength; }
    return { body: new TextDecoder().decode(combined), finalUrl: currentUrl };
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Fetches a validated URL and extracts the primary article text.
 *
 * Three-pass strategy (best result wins):
 *   1. Readability  — great for traditional HTML article pages
 *   2. Aggressive DOM walk  — works when Readability can't identify an article
 *   3. __NEXT_DATA__ / JSON  — handles Next.js / headless-CMS SPAs where all
 *      content lives in an embedded JSON blob, invisible to DOM parsers
 */
export async function fetchAndExtract(
  url: URL
): Promise<{ text: string; title?: string; wordCount: number }> {
  const { body, finalUrl } = await safeFetch(url, FETCH_TIMEOUT_MS);

  // Run all three strategies, pick the one with the most words
  const candidates: { text: string; title?: string }[] = [];

  const r1 = readabilityExtract(body, finalUrl.href);
  if (r1) candidates.push(r1);

  const r2 = aggressiveExtract(body, finalUrl.href);
  if (wordCount(r2) >= MIN_WORDS) candidates.push({ text: r2 });

  const r3 = nextDataExtract(body);
  if (r3) candidates.push(r3);

  // Pick the candidate with the most words
  let best: { text: string; title?: string } | null = null;
  for (const c of candidates) {
    if (!best || wordCount(c.text) > wordCount(best.text)) best = c;
  }

  if (!best || wordCount(best.text) < MIN_WORDS) {
    throw new UrlImportError(
      "NO_CONTENT",
      "Could not extract readable content. The page may require JavaScript to render, or may be behind a login. Try pasting the text manually."
    );
  }

  let { text, title } = best;

  if (text.length > MAX_TEXT_CHARS) {
    text = text.slice(0, MAX_TEXT_CHARS);
    const lastSpace = text.lastIndexOf(" ");
    if (lastSpace > MAX_TEXT_CHARS - 500) text = text.slice(0, lastSpace);
    text = text.trim() + "\n\n[Content truncated — paste the remainder manually.]";
  }

  return { text, title, wordCount: wordCount(text) };
}
