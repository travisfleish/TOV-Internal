export interface SectionConfig {
  id: string;
  title: string;
  tocLabel: string;
}

export const SECTIONS: SectionConfig[] = [
  {
    id: "method",
    title: "Method & scope",
    tocLabel: "Method & scope",
  },
  {
    id: "company-landscape",
    title: "Company & product landscape",
    tocLabel: "Company landscape",
  },
  {
    id: "answer-engine-footprint",
    title: "Answer-engine footprint & narrative risk",
    tocLabel: "AE footprint",
  },
  {
    id: "entity-clarity",
    title: "Entity clarity & extractability audit",
    tocLabel: "Entity audit",
  },
  {
    id: "competitive-landscape",
    title: "Competitive landscape",
    tocLabel: "Competitors",
  },
  {
    id: "strategy-blueprints",
    title: "AEO strategy & product blueprints",
    tocLabel: "Strategy & blueprints",
  },
  {
    id: "roadmap",
    title: "90-day roadmap & measurement",
    tocLabel: "90-day roadmap",
  },
];
