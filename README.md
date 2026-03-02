# Genius Voice + Visibility QA

Production-quality proof-of-concept web app for analyzing marketing copy across:

- Tone of Voice compliance
- SEO optimization
- AEO optimization

Built with Next.js 14 (App Router), TypeScript, Tailwind utilities, brand-first CSS, Zod schemas, and server-side OpenAI integration with deterministic fallback rules.

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

## One-command local run

After first install, run:

```bash
npm run dev
```

## API endpoints

### `POST /api/analyze`

Validates input, runs deterministic rule checks, optionally augments with LLM analysis, and returns schema-valid JSON.

### `POST /api/rewrite`

Accepts original copy + analysis, returns:

```json
{
  "revisedCopy": "string",
  "changeLog": ["string"]
}
```

If LLM is unavailable, returns fallback rewrite that removes risky language and adds AEO placeholders.

## Notes

- `OPENAI_API_KEY` is used server-side only.
- UI is resilient to API failures and surfaces a brand-consistent error banner.
- Core styling uses `styles/genius-brand.css`; Tailwind is limited to layout utilities.
