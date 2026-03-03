import { lookup } from "dns/promises";
import { isIPv4, isIPv6 } from "net";

export class UrlImportError extends Error {
  constructor(
    public readonly code: string,
    message: string
  ) {
    super(message);
    this.name = "UrlImportError";
  }
}

const BLOCKED_IPV4_CIDRS = [
  "0.0.0.0/8",
  "10.0.0.0/8",
  "100.64.0.0/10",
  "127.0.0.0/8",
  "169.254.0.0/16",
  "172.16.0.0/12",
  "192.168.0.0/16",
  "198.18.0.0/15",
  "224.0.0.0/4",
  "240.0.0.0/4",
];

function ipv4InCidr(ip: string, cidr: string): boolean {
  const [range, bits] = cidr.split("/");
  const shift = 32 - Number(bits);
  const ipInt =
    ip
      .split(".")
      .reduce((acc, o) => (acc << 8) | Number(o), 0) >>> 0;
  const rangeInt =
    range
      .split(".")
      .reduce((acc, o) => (acc << 8) | Number(o), 0) >>> 0;
  return (ipInt >>> shift) === (rangeInt >>> shift);
}

function isBlockedIpv4(ip: string): boolean {
  return BLOCKED_IPV4_CIDRS.some((cidr) => ipv4InCidr(ip, cidr));
}

function isBlockedIpv6(ip: string): boolean {
  const lower = ip.toLowerCase().replace(/^\[|\]$/g, "");
  if (lower === "::1") return true;
  // fc00::/7 — covers fc00:: through fdff::
  if (/^f[cd]/i.test(lower)) return true;
  // fe80::/10 — link-local
  if (/^fe[89ab]/i.test(lower)) return true;
  return false;
}

async function checkIp(ip: string): Promise<void> {
  if (isIPv4(ip)) {
    if (isBlockedIpv4(ip)) {
      throw new UrlImportError("SSRF_BLOCKED", "URL is not accessible.");
    }
    return;
  }
  if (isIPv6(ip)) {
    if (isBlockedIpv6(ip)) {
      throw new UrlImportError("SSRF_BLOCKED", "URL is not accessible.");
    }
    return;
  }
  // Unrecognised format — block by default
  throw new UrlImportError("SSRF_BLOCKED", "URL is not accessible.");
}

/**
 * Validates a URL string for safe outbound fetching.
 * Resolves the hostname to an IP and blocks any private/internal address.
 * Throws UrlImportError on any violation.
 */
export async function validateUrl(rawUrl: string): Promise<URL> {
  let parsed: URL;
  try {
    parsed = new URL(rawUrl);
  } catch {
    throw new UrlImportError("SSRF_BLOCKED", "URL is not accessible.");
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new UrlImportError("SSRF_BLOCKED", "URL is not accessible.");
  }

  const hostname = parsed.hostname.toLowerCase();

  // Block bare IP literals in the URL itself
  if (isIPv4(hostname)) {
    await checkIp(hostname);
    return parsed;
  }
  if (isIPv6(hostname.replace(/^\[|\]$/g, ""))) {
    await checkIp(hostname.replace(/^\[|\]$/g, ""));
    return parsed;
  }

  // Block reserved/internal hostnames
  if (
    hostname === "localhost" ||
    hostname.endsWith(".local") ||
    hostname.endsWith(".internal") ||
    hostname.endsWith(".localhost")
  ) {
    throw new UrlImportError("SSRF_BLOCKED", "URL is not accessible.");
  }

  // DNS resolve and check the resulting IP
  let resolved: string;
  try {
    const result = await lookup(hostname);
    resolved = result.address;
  } catch {
    throw new UrlImportError("SSRF_BLOCKED", "URL is not accessible.");
  }

  await checkIp(resolved);
  return parsed;
}
