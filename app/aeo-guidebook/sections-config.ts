export interface SectionConfig {
  id: string;
  title: string;
  tocLabel: string;
  level?: number; // heading depth: 2 (default) or 3 (indented in TOC)
}

export const SECTIONS: SectionConfig[] = [
  {
    id: "the-shift",
    title: "1. The Shift: Rankings → Inclusion",
    tocLabel: "1. The Shift",
  },
  {
    id: "how-it-works",
    title: "2. How Answer Engines Actually Work",
    tocLabel: "2. How It Works",
  },
  {
    id: "three-gates",
    title: "3. The Three Gates of Inclusion",
    tocLabel: "3. The Three Gates",
  },
  {
    id: "writing-for-extraction",
    title: "4. Writing for Extraction",
    tocLabel: "4. Writing for Extraction",
  },
  {
    id: "trust-defensibility",
    title: "5. Trust & Defensibility",
    tocLabel: "5. Trust & Defensibility",
  },
  {
    id: "competitive-inclusion",
    title: "6. Competitive Inclusion Strategy",
    tocLabel: "6. Competitive Inclusion",
  },
  {
    id: "topic-prompt-architecture",
    title: "7. Topic & Prompt Architecture",
    tocLabel: "7. Topic Architecture",
  },
  {
    id: "optimize-vs-create",
    title: "8. Optimize vs Create New",
    tocLabel: "8. Optimize vs Create",
  },
  {
    id: "operating-loop",
    title: "9. The AEO Operating Loop",
    tocLabel: "9. Operating Loop",
  },
  {
    id: "publishing-standard",
    title: "10. Genius Sports AEO Publishing Standard",
    tocLabel: "10. Publishing Standard",
  },
];
