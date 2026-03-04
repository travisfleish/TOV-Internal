import type { ReactNode } from "react";

export type CalloutVariant = "info" | "warn" | "tip";

interface CalloutProps {
  variant?: CalloutVariant;
  children: ReactNode;
}

const variantConfig: Record<
  CalloutVariant,
  { label: string; bg: string; border: string; labelColor: string }
> = {
  info: {
    label: "Note",
    bg: "#eff6ff",
    border: "var(--color-blue)",
    labelColor: "var(--color-blue)",
  },
  warn: {
    label: "Warning",
    bg: "#fff7ed",
    border: "var(--color-orange)",
    labelColor: "var(--color-orange)",
  },
  tip: {
    label: "Tip",
    bg: "#f0fdf4",
    border: "#16a34a",
    labelColor: "#15803d",
  },
};

export function Callout({ variant = "info", children }: CalloutProps) {
  const { label, bg, border, labelColor } = variantConfig[variant];
  return (
    <div
      role="note"
      style={{
        background: bg,
        borderLeft: `4px solid ${border}`,
        padding: "1rem 1.25rem",
        borderRadius: "0 var(--radius-md) var(--radius-md) 0",
        marginBottom: "var(--space-4)",
      }}
    >
      <strong
        style={{
          display: "block",
          marginBottom: "0.25rem",
          color: labelColor,
          fontSize: "0.875rem",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
        }}
      >
        {label}
      </strong>
      <div style={{ margin: 0 }}>{children}</div>
    </div>
  );
}
