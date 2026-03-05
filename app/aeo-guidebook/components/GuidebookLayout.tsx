import type { ReactNode } from "react";
import type { SectionConfig } from "../sections-config";
import { GuidebookTOC } from "./GuidebookTOC";

interface GuidebookLayoutProps {
  sections: SectionConfig[];
  children: ReactNode;
}

export function GuidebookLayout({ sections, children }: GuidebookLayoutProps) {
  return (
    <div className="container" style={{ paddingBottom: "5rem" }}>
      {/* Skip-to-content link — visible only on keyboard focus */}
      <a
        href="#guidebook-content"
        className="button button-primary sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50"
      >
        Skip to content
      </a>

      {/* On mobile, TOC renders above content via GuidebookTOC's internal mobile block */}
      <div
        className="grid grid-cols-1 lg:grid-cols-[220px_1fr]"
        style={{ gap: "2rem", alignItems: "start", paddingTop: "2rem" }}
      >
        {/* TOC column — renders sticky block on desktop, collapsible on mobile */}
        <GuidebookTOC sections={sections} />

        {/* Main content — constrained so tables/prose don't bleed off */}
        <main
          id="guidebook-content"
          tabIndex={-1}
          style={{ outline: "none", maxWidth: "52rem" }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
