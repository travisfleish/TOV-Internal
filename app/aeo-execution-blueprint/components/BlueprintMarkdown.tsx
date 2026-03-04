import { marked, Renderer } from "marked";

interface BlueprintMarkdownProps {
  content: string;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

/** Strip HTML tags to get plain text for callout detection */
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "");
}

const CALLOUT_PATTERNS: Array<{
  prefix: RegExp;
  bg: string;
  border: string;
  labelColor: string;
  label: string;
}> = [
  {
    prefix: /^Blunt finding:/i,
    bg: "#fff7ed",
    border: "var(--color-orange)",
    labelColor: "var(--color-orange)",
    label: "Warning",
  },
  {
    prefix: /^⚠/,
    bg: "#fff7ed",
    border: "var(--color-orange)",
    labelColor: "var(--color-orange)",
    label: "Warning",
  },
  {
    prefix: /^Immediate fix:/i,
    bg: "#f0fdf4",
    border: "#16a34a",
    labelColor: "#15803d",
    label: "Tip",
  },
  {
    prefix: /^AEO consequence:/i,
    bg: "#eff6ff",
    border: "var(--color-blue)",
    labelColor: "var(--color-blue)",
    label: "Note",
  },
];

function buildRenderer(): Renderer {
  const renderer = new Renderer();

  renderer.heading = function (text: string, level: number) {
    const id = slugify(stripHtml(text));
    return `<h${level} id="${id}" style="scroll-margin-top:5rem">${text}</h${level}>\n`;
  };

  renderer.paragraph = function (text: string) {
    const plain = stripHtml(text).trim();
    const callout = CALLOUT_PATTERNS.find(({ prefix }) => prefix.test(plain));
    if (callout) {
      return (
        `<div role="note" style="background:${callout.bg};border-left:4px solid ${callout.border};` +
        `padding:1rem 1.25rem;border-radius:0 var(--radius-md) var(--radius-md) 0;` +
        `margin-bottom:var(--space-4)">` +
        `<strong style="display:block;margin-bottom:0.25rem;color:${callout.labelColor};` +
        `font-size:0.875rem;text-transform:uppercase;letter-spacing:0.06em">${callout.label}</strong>` +
        `<p style="margin:0">${text}</p></div>\n`
      );
    }
    return `<p>${text}</p>\n`;
  };

  renderer.table = function (header: string, body: string) {
    return (
      `<div style="overflow-x:auto;margin-bottom:var(--space-4);-webkit-overflow-scrolling:touch">` +
      `<table style="border-collapse:collapse;width:100%;font-size:0.9375rem;line-height:1.5">` +
      `<thead>${header}</thead>` +
      (body ? `<tbody>${body}</tbody>` : "") +
      `</table></div>\n`
    );
  };

  renderer.tablerow = function (content: string) {
    return `<tr style="border-bottom:1px solid var(--color-lightGrey)">${content}</tr>\n`;
  };

  renderer.tablecell = function (
    content: string,
    flags: { header?: boolean; align?: "center" | "left" | "right" | null }
  ) {
    if (flags.header) {
      return (
        `<th style="background:var(--color-navy);color:var(--color-white);` +
        `padding:0.625rem 0.875rem;text-align:left;font-weight:500;font-size:0.875rem;` +
        `letter-spacing:-0.01em;border-right:1px solid rgba(255,255,255,0.12);` +
        `white-space:nowrap">${content}</th>\n`
      );
    }
    return (
      `<td style="padding:0.625rem 0.875rem;border-bottom:1px solid var(--color-lightGrey);` +
      `border-right:1px solid var(--color-lightGrey);vertical-align:top;line-height:1.55">${content}</td>\n`
    );
  };

  renderer.code = function (code: string, _lang: string | undefined) {
    return (
      `<pre style="background:#f8f8f8;border:1px solid var(--color-lightGrey);` +
      `border-radius:var(--radius-md);padding:1rem 1.25rem;overflow-x:auto;` +
      `font-size:0.875rem;line-height:1.6;margin-bottom:var(--space-4)">` +
      `<code>${code}</code></pre>\n`
    );
  };

  renderer.codespan = function (code: string) {
    return (
      `<code style="background:#f0f0f0;border-radius:0.25rem;` +
      `padding:0.125rem 0.375rem;font-size:0.875em;font-family:var(--font-mono,monospace)">${code}</code>`
    );
  };

  renderer.blockquote = function (quote: string) {
    return (
      `<blockquote style="border-left:4px solid var(--color-lightGrey);` +
      `padding-left:1.25rem;margin-left:0;margin-bottom:var(--space-4);` +
      `opacity:0.8;font-style:italic">${quote}</blockquote>\n`
    );
  };

  renderer.list = function (body: string, ordered: boolean, start: number) {
    const tag = ordered ? "ol" : "ul";
    const startAttr = ordered && start !== 1 ? ` start="${start}"` : "";
    return (
      `<${tag}${startAttr} style="padding-left:1.625rem;margin-bottom:var(--space-4)">` +
      `${body}</${tag}>\n`
    );
  };

  renderer.listitem = function (text: string) {
    return `<li style="margin-bottom:0.5rem;line-height:1.6">${text}</li>\n`;
  };

  renderer.hr = function () {
    return `<hr style="border:none;border-top:1px solid var(--color-lightGrey);margin:var(--space-5) 0">\n`;
  };

  return renderer;
}

export function BlueprintMarkdown({ content }: BlueprintMarkdownProps) {
  const renderer = buildRenderer();
  const html = marked.parse(content, { renderer, mangle: false, headerIds: false }) as string;

  return (
    <div
      dangerouslySetInnerHTML={{ __html: html }}
      style={{
        maxWidth: "72ch",
        fontSize: "1rem",
        lineHeight: 1.7,
        color: "var(--color-navy)",
      }}
    />
  );
}
