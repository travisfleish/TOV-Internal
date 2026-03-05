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
    // Bold-only paragraph (subhead): add margin so there's a clear gap before the next block
    const isBoldOnly = /^<strong[^>]*>[\s\S]*<\/strong>$/i.test(text.trim());
    if (isBoldOnly) {
      return `<p style="margin-bottom:var(--space-3)">${text}</p>\n`;
    }
    return `<p>${text}</p>\n`;
  };

  /** Extract inner HTML from a single <th>...</th> for use as a label */
  function getThLabel(thHtml: string): string {
    const inner = thHtml.replace(/<th[^>]*>([\s\S]*?)<\/th>/i, "$1");
    return stripHtml(inner).trim();
  }

  renderer.table = function (header: string, body: string) {
    const headerThs = header.match(/<th[^>]*>[\s\S]*?<\/th>/gi) ?? [];
    const colCount = headerThs.length;
    const headerLabels = headerThs.map((th) => getThLabel(th).toLowerCase());
    const isScorecard =
      colCount >= 6 &&
      headerLabels.some((l) => l.includes("extractability")) &&
      headerLabels.some((l) => l.includes("clarity"));
    const MAIN_COLS = isScorecard ? colCount - 1 : 3;
    const useDetailRows = colCount >= 4;

    let theadHtml = header;
    let tbodyHtml = body ?? "";
    let colgroup = "";
    const tableLayout = "table-layout:fixed;";

    if (useDetailRows) {
      // Keep first MAIN_COLS in the header; move remaining columns to full-width detail rows below each data row.
      // Scorecard: all score columns stay in main row; only "What's working / what's missing" goes below.
      theadHtml = headerThs.slice(0, MAIN_COLS).join("");
      const detailLabels = headerThs.slice(MAIN_COLS).map(getThLabel);
      const mainWidths =
        MAIN_COLS === 3
          ? ["25%", "35%", "40%"]
          : MAIN_COLS === 7
            ? ["10%", "16%", "15%", "15%", "15%", "15%", "14%"]
            : Array(MAIN_COLS).fill(`${Math.round(100 / MAIN_COLS)}%`);
      colgroup = `<colgroup>${mainWidths.map((w) => `<col style="width:${w}">`).join("")}</colgroup>`;

      const rowChunks = body?.split(/<\/tr>\s*/i).filter((s) => s.trim()) ?? [];
      const newRows: string[] = [];
      const cellRe = /<td[^>]*>([\s\S]*?)<\/td>/gi;

      const mainCellStyle =
        "padding:0.625rem 0.875rem;border-right:1px solid var(--color-lightGrey);vertical-align:top;line-height:1.55;overflow-wrap:break-word;word-break:break-word";
      const detailBlockStyle =
        "padding:0.5rem 0.875rem 0.875rem;line-height:1.55;overflow-wrap:break-word;word-break:break-word;background:var(--color-offWhite, #f9f9f9);border-top:1px solid var(--color-lightGrey)";

      for (const chunk of rowChunks) {
        const cells: string[] = [];
        let m: RegExpExecArray | null;
        cellRe.lastIndex = 0;
        while ((m = cellRe.exec(chunk)) !== null) cells.push(m[1]);
        if (cells.length < colCount) continue;

        const mainCells = cells.slice(0, MAIN_COLS);
        const detailCells = cells.slice(MAIN_COLS);

        const innerColgroup = mainWidths.map((w) => `<col style="width:${w}">`).join("");
        const mainRowHtml =
          `<table class="blueprint-section-main" style="width:100%;border-collapse:collapse;table-layout:fixed;font-size:0.9375rem"><colgroup>${innerColgroup}</colgroup><tbody><tr>` +
          mainCells.map((c) => `<td style="${mainCellStyle}">${c}</td>`).join("") +
          `</tr></tbody></table>`;

        const detailBlocksHtml = detailCells
          .map(
            (content, i) =>
              `<div class="blueprint-detail-block" style="${detailBlockStyle}">` +
              (detailLabels[i]
                ? `<strong style="display:block;font-size:0.8125rem;color:var(--color-navy);opacity:0.85;margin-bottom:0.25rem">${detailLabels[i]}</strong>`
                : "") +
              content +
              `</div>`
          )
          .join("");

        newRows.push(
          `<tr class="blueprint-section-row"><td colspan="${MAIN_COLS}" style="padding:0;vertical-align:top">` +
            `<div class="blueprint-section">${mainRowHtml}${detailBlocksHtml}</div>` +
            `</td></tr>`
        );
      }
      tbodyHtml = newRows.join("\n");
    } else {
      colgroup =
        colCount === 3
          ? `<colgroup><col style="width:22%"><col style="width:35%"><col style="width:43%"></colgroup>`
          : "";
    }

    return (
      `<div style="overflow-x:auto;margin-bottom:var(--space-4);-webkit-overflow-scrolling:touch">` +
      `<table style="border-collapse:collapse;width:100%;${tableLayout}font-size:0.9375rem;line-height:1.5">` +
      colgroup +
      `<thead>${theadHtml}</thead>` +
      (tbodyHtml ? `<tbody>${tbodyHtml}</tbody>` : "") +
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
        `padding:0.625rem 0.875rem;text-align:left;font-weight:700;font-size:0.875rem;` +
        `letter-spacing:-0.01em;border-right:1px solid rgba(255,255,255,0.12);` +
        `white-space:nowrap">${content}</th>\n`
      );
    }
    // Show only path for URL-like cells (e.g. www.geniussports.com/bet/ → /bet)
    let cellContent = content.replace(/https?:\/\//g, "");
    const urlWithPath = /([a-z0-9][a-z0-9.-]*\.[a-z]{2,})(\/[^<\s]*)?/gi;
    cellContent = cellContent.replace(urlWithPath, (_: string, _host: string, path: string | undefined) =>
      path ? path.replace(/\/$/, "") || "/" : "/"
    );
    return (
      `<td style="padding:0.625rem 0.875rem;border-bottom:1px solid var(--color-lightGrey);` +
      `border-right:1px solid var(--color-lightGrey);vertical-align:top;line-height:1.55;` +
      `overflow-wrap:break-word;word-break:break-word">${cellContent}</td>\n`
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
      className="blueprint-markdown"
      dangerouslySetInnerHTML={{ __html: html }}
      style={{
        fontSize: "1rem",
        lineHeight: 1.7,
        color: "var(--color-navy)",
      }}
    />
  );
}
