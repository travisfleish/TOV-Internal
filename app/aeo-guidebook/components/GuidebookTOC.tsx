"use client";

import { useEffect, useState } from "react";
import type { SectionConfig } from "../sections-config";

interface GuidebookTOCProps {
  sections: SectionConfig[];
}

export function GuidebookTOC({ sections }: GuidebookTOCProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Find the topmost intersecting entry
        const intersecting = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (intersecting.length > 0) {
          setActiveId(intersecting[0].target.id);
        }
      },
      {
        rootMargin: "0px 0px -55% 0px",
        threshold: 0,
      }
    );

    for (const { id } of sections) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [sections]);

  const navList = (
    <nav aria-label="Page sections">
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {sections.map(({ id, tocLabel, level }) => {
          const isActive = activeId === id;
          const isSubItem = level === 3;
          return (
            <li key={id}>
              <a
                href={`#${id}`}
                style={{
                  display: "block",
                  padding: "0.3rem 0.75rem",
                  paddingLeft: isSubItem ? "1.5rem" : "0.75rem",
                  borderRadius: "var(--radius-md)",
                  textDecoration: "none",
                  color: isActive ? "var(--color-blue)" : "var(--color-navy)",
                  fontWeight: isActive ? 500 : 400,
                  opacity: isSubItem && !isActive ? 0.75 : 1,
                  background: isActive ? "rgba(0,0,220,0.06)" : "transparent",
                  borderLeft: isActive
                    ? "2px solid var(--color-blue)"
                    : "2px solid transparent",
                  transition: "all 0.15s ease",
                  fontSize: isSubItem ? "0.875rem" : "0.9375rem",
                  lineHeight: 1.4,
                  marginBottom: "0.125rem",
                }}
                aria-current={isActive ? "location" : undefined}
              >
                {tocLabel}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );

  return (
    <>
      {/* Desktop: sticky sidebar (hidden on mobile) */}
      <div className="hidden lg:block" style={{ position: "sticky", top: "2rem" }}>
        <p
          style={{
            fontSize: "0.75rem",
            fontWeight: 500,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            marginBottom: "0.75rem",
            marginTop: 0,
            opacity: 0.45,
          }}
        >
          On this page
        </p>
        {navList}
      </div>

      {/* Mobile: collapsible details/summary (hidden on lg+) */}
      <div className="block lg:hidden mb-6">
        <details>
          <summary
            style={{
              cursor: "pointer",
              fontWeight: 500,
              padding: "0.75rem 1rem",
              background: "var(--color-lightGrey)",
              borderRadius: "var(--radius-md)",
              listStyle: "none",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              userSelect: "none",
            }}
          >
            <span>On this page</span>
            <span aria-hidden="true" style={{ fontSize: "0.75rem" }}>▼</span>
          </summary>
          <div
            style={{
              padding: "1rem",
              border: "1px solid var(--color-lightGrey)",
              borderTop: "none",
              borderRadius: "0 0 var(--radius-md) var(--radius-md)",
            }}
          >
            {navList}
          </div>
        </details>
      </div>
    </>
  );
}
