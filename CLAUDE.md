# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server at http://localhost:3000
npm run build        # Production build
npm run typecheck    # Type check without emitting (tsc --noEmit)
npm run harness:replace  # Integration test for compute-edits API (requires dev server running)
```

There is no automated test suite. `harness:replace` is the closest thing — it posts to `/api/dev/compute-edits` and asserts on the response shape.

## Environment

Copy `.env.example` to `.env.local` and set `OPENAI_API_KEY`. The app works without a key (deterministic fallback mode), but LLM features are disabled.

## Architecture

**Next.js 14 App Router** single-page app. The only page is `app/page.tsx` (client component). All OpenAI calls are server-side only.

### Request flow

1. UI posts to `/api/analyze` → deterministic rules always run + optional LLM → merged, Zod-validated response
2. UI posts to `/api/rewrite` → LLM rewrite attempted → falls back to deterministic if unavailable → Zod-validated response

### Key files

| File | Role |
|---|---|
| `lib/schema.ts` | All Zod schemas and TypeScript types. The canonical data contract — if you change a shape, update here first. |
| `lib/analyzers/rules.ts` | Deterministic analysis engine: banned phrases, adjective density, MVS checks, SEO/AEO checks, scoring model. Also exports `removeBannedPhrases` for fallback rewrite. |
| `lib/analyzers/llm.ts` | OpenAI integration (`import "server-only"`). Builds prompts with Brand Voice DNA + rubric, validates LLM JSON via Zod. Returns `null` on any failure. |
| `app/api/analyze/route.ts` | Merges rule + LLM outputs (LLM scores preferred; issues unioned with dedup; final Zod revalidation). |
| `app/api/rewrite/route.ts` | Orchestrates LLM rewrite → fallback rewrite → length guard (`clipLengthAroundOriginal` ±15%). |
| `app/api/dev/compute-edits/route.ts` | Dev-only endpoint: computes `edits[]` + `segments[]` from two text strings (used by harness). |
| `lib/redline/computeEdits.ts` | Core diff logic producing `Edit[]` and `RedlineSegment[]` with span offsets. |
| `styles/genius-brand.css` | Primary design system — all brand tokens, component classes (`.card`, `.button-primary`, etc.), typography. Use these classes instead of ad hoc Tailwind. |

### Hybrid analysis merge rules

- `meta`: deterministic source always wins
- `scores`: LLM-preferred when valid
- `issues`: union by `engine+severity+title` dedup
- `quickFixes` / `notes`: set union
- If final Zod validation fails, falls back to pure rule result

### Rewrite response shape

```typescript
{
  revisedCopy: string,
  edits: Edit[],        // op: "add" | "del" | "replace", beforeText, afterText, beforeSpan, afterSpan
  segments: RedlineSegment[],  // type: "same" | "add" | "del", text, editId?, beforeSpan?, afterSpan?
  changeLog: string[],
  meta: { rewriteSource: "llm" | "fallback" }
}
```

Segments link to edits via `editId`. The UI uses this for redline hover tooltip attribution.

### Styling conventions

- `styles/genius-brand.css` is the source of truth for brand tokens (`--color-*`, font families, spacing).
- Tailwind is limited to layout utilities (grid, spacing, responsive breakpoints).
- Do not introduce new component-level style patterns without using existing brand CSS classes.

### Fallback-first principle

Both analysis and rewrite are designed to produce valid, schema-conformant output even without an OpenAI key. LLM failures are silent (return `null`); the deterministic path always produces a complete response.
