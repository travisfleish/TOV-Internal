import type { ReactNode } from "react";

interface GuidebookSectionProps {
  id: string;
  title: string;
  children: ReactNode;
}

export function GuidebookSection({ id, title, children }: GuidebookSectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      style={{ scrollMarginTop: "5rem", paddingBottom: "var(--space-6)" }}
    >
      <h2
        id={`${id}-heading`}
        style={{ marginTop: "var(--space-6)" }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}
