/**
 * Turn heading text into a stable id for anchor links and TOC.
 * Lowercase, spaces to hyphens, strip non-alphanumeric except hyphens.
 */
export function slugify(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
