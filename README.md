# Genius Voice + Visibility QA

Production-quality Next.js app for marketing copy QA across:

- Brand voice compliance
- SEO optimization
- AEO optimization

Built with Next.js 14 (App Router), TypeScript, Zod validation, and server-side OpenAI integration with deterministic fallback behavior.

## Newest Functionality

- Added dual workspace UX: **Analysis** and **Copy editor** modes.
- Added **Redline** view for rewrites with inline add/delete highlighting.
- Added structured rewrite metadata via `edits[]` (`add`/`del`/`replace`, `beforeText`, `afterText`).
- Added upload support for analysis and editor input files.
- Added issue-level "Jump to phrase" behavior when an issue includes source offsets.

## How to run

1. Install dependencies:

```bash
npm install
```

2. Create local env file:

```bash
cp .env.example .env.local
```

3. Add your OpenAI key in `.env.local`:

```bash
OPENAI_API_KEY=your_key_here
```

4. Start app:

```bash
npm run dev
```

Open `http://localhost:3000`.

## API endpoints

### `POST /api/analyze`

Validates input, always runs deterministic rules, optionally augments with LLM analysis, merges outputs, and returns schema-valid JSON.

### `POST /api/rewrite`

Accepts original copy plus prior analysis and returns:

```json
{
  "revisedCopy": "string",
  "changeLog": ["string"],
  "edits": [
    {
      "id": "string",
      "op": "add | del | replace",
      "beforeText": "string",
      "afterText": "string"
    }
  ],
  "segments": [{ "type": "same | add | del", "text": "string" }]
}
```

If LLM rewrite is unavailable, the endpoint falls back to deterministic rewrite behavior (risk phrase removal + AEO placeholders) and still returns a contract-compatible payload.

## Notes

- `OPENAI_API_KEY` is server-side only.
- UI is resilient to API failures and surfaces a brand-consistent error banner.
- Core styling uses `styles/genius-brand.css`; Tailwind is limited to layout utilities.
