interface DoDontProps {
  doText: string;
  dontText: string;
  doLabel?: string;
  dontLabel?: string;
}

export function DoDont({
  doText,
  dontText,
  doLabel = "Do",
  dontLabel = "Don't",
}: DoDontProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
      <div
        style={{
          background: "#f0fdf4",
          border: "1px solid #bbf7d0",
          padding: "1rem 1.25rem",
          borderRadius: "var(--radius-md)",
        }}
      >
        <strong
          style={{
            display: "block",
            color: "#15803d",
            marginBottom: "0.5rem",
            fontSize: "0.875rem",
          }}
        >
          ✓ {doLabel}
        </strong>
        <p style={{ margin: 0, fontSize: "0.9375rem", lineHeight: 1.55 }}>
          {doText}
        </p>
      </div>
      <div
        style={{
          background: "#fff1f2",
          border: "1px solid #fecdd3",
          padding: "1rem 1.25rem",
          borderRadius: "var(--radius-md)",
        }}
      >
        <strong
          style={{
            display: "block",
            color: "#be123c",
            marginBottom: "0.5rem",
            fontSize: "0.875rem",
          }}
        >
          ✗ {dontLabel}
        </strong>
        <p style={{ margin: 0, fontSize: "0.9375rem", lineHeight: 1.55 }}>
          {dontText}
        </p>
      </div>
    </div>
  );
}
