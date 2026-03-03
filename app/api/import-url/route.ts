import "server-only";
import { NextResponse } from "next/server";
import { importUrlRequestSchema } from "@/lib/schema";
import { validateUrl, UrlImportError } from "@/lib/url-import/security";
import { fetchAndExtract } from "@/lib/url-import/extract";

// ---------------------------------------------------------------------------
// Lightweight per-IP rate limiter (best-effort; not shared across instances)
// ---------------------------------------------------------------------------
interface RateLimitEntry {
  count: number;
  resetAt: number;
}
const rateLimits = new Map<string, RateLimitEntry>();
const RATE_LIMIT_MAX = 10;
const RATE_LIMIT_WINDOW_MS = 60_000;

function getClientIp(request: Request): string {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimits.get(ip);
  if (!entry || entry.resetAt < now) {
    rateLimits.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT_MAX) return false;
  entry.count++;
  return true;
}

// ---------------------------------------------------------------------------
// Error code → [user-facing message, HTTP status]
// ---------------------------------------------------------------------------
const ERROR_MAP: Record<string, [string, number]> = {
  SSRF_BLOCKED: ["URL is not accessible.", 400],
  NOT_HTML: [
    "Only HTML pages are supported. Try copying the text manually.",
    415,
  ],
  NO_CONTENT: [
    "Could not extract readable content. The page may require login or JavaScript. Try pasting the text manually.",
    422,
  ],
  TIMEOUT: ["The page took too long to respond.", 504],
  TOO_LARGE: ["The page is too large to import.", 413],
};

// ---------------------------------------------------------------------------
// POST /api/import-url
// ---------------------------------------------------------------------------
export async function POST(request: Request) {
  const ip = getClientIp(request);
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Too many import requests. Please wait a moment." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = importUrlRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid URL." }, { status: 400 });
  }

  const t0 = Date.now();
  let safeUrl: URL | undefined;

  try {
    safeUrl = await validateUrl(parsed.data.url);
    const result = await fetchAndExtract(safeUrl);

    const durationMs = Date.now() - t0;
    const truncated = result.text.includes("[Content truncated");
    console.log(
      JSON.stringify({
        event: "url_import",
        status: "success",
        domain: safeUrl.hostname,
        durationMs,
        wordCount: result.wordCount,
        truncated,
      })
    );

    return NextResponse.json({
      url: safeUrl.href,
      title: result.title,
      text: result.text,
      wordCount: result.wordCount,
    });
  } catch (err) {
    const durationMs = Date.now() - t0;
    const code =
      err instanceof UrlImportError ? err.code : "UNKNOWN";

    console.log(
      JSON.stringify({
        event: "url_import",
        status: code,
        domain: safeUrl?.hostname ?? "unknown",
        durationMs,
      })
    );

    const [message, status] = ERROR_MAP[code] ?? [
      "Unable to import from that URL.",
      500,
    ];
    return NextResponse.json({ error: message }, { status });
  }
}
