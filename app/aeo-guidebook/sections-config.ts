export interface SectionConfig {
  id: string;
  title: string;
  tocLabel: string;
}

export const SECTIONS: SectionConfig[] = [
  {
    id: "shift",
    title: "The shift: SEO → AEO",
    tocLabel: "SEO → AEO",
  },
  {
    id: "how-it-works",
    title: "How answer engines work",
    tocLabel: "How it works",
  },
  {
    id: "anatomy",
    title: "The anatomy of AEO-ready content",
    tocLabel: "AEO anatomy",
  },
  {
    id: "trust",
    title: "Trust & defensibility",
    tocLabel: "Trust & E-E-A-T",
  },
  {
    id: "mistakes",
    title: "Mistakes that kill citations",
    tocLabel: "Common mistakes",
  },
  {
    id: "cheat-sheet",
    title: "One-page cheat sheet",
    tocLabel: "Cheat sheet",
  },
];
