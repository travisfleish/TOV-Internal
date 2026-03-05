export interface SectionConfig {
  id: string;
  title: string;
  tocLabel: string;
  level?: number; // heading depth: 2 (default) or 3 (indented in TOC)
}

export const SECTIONS: SectionConfig[] = [
  {
    id: "shift",
    title: "1. The shift: SEO → AEO",
    tocLabel: "1. SEO → AEO",
  },
  {
    id: "how-it-works",
    title: "2. How answer engines work",
    tocLabel: "2. How it works",
  },
  {
    id: "anatomy",
    title: "3. The anatomy of AEO-ready content",
    tocLabel: "3. AEO anatomy",
  },
  {
    id: "trust",
    title: "4. Trust & defensibility",
    tocLabel: "4. Trust & E-E-A-T",
  },
  {
    id: "mistakes",
    title: "5. Mistakes that kill citations",
    tocLabel: "5. Common mistakes",
  },
  {
    id: "cheat-sheet",
    title: "6. One-page cheat sheet",
    tocLabel: "6. Cheat sheet",
  },
];
