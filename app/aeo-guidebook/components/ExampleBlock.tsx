interface ExampleBlockProps {
  before: string;
  after: string;
  beforeLabel?: string;
  afterLabel?: string;
  note?: string;
}

export function ExampleBlock({
  before,
  after,
  beforeLabel = "Before",
  afterLabel = "After",
  note,
}: ExampleBlockProps) {
  return (
    <div className="mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <div
            style={{
              fontSize: "0.75rem",
              fontWeight: 500,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              marginBottom: "0.5rem",
              color: "#be123c",
            }}
          >
            {beforeLabel}
          </div>
          <div
            style={{
              background: "#fff1f2",
              border: "1px solid #fecdd3",
              padding: "1rem 1.25rem",
              borderRadius: "var(--radius-md)",
              fontSize: "0.9375rem",
              lineHeight: 1.6,
              whiteSpace: "pre-line",
            }}
          >
            {before}
          </div>
        </div>
        <div>
          <div
            style={{
              fontSize: "0.75rem",
              fontWeight: 500,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              marginBottom: "0.5rem",
              color: "#15803d",
            }}
          >
            {afterLabel}
          </div>
          <div
            style={{
              background: "#f0fdf4",
              border: "1px solid #bbf7d0",
              padding: "1rem 1.25rem",
              borderRadius: "var(--radius-md)",
              fontSize: "0.9375rem",
              lineHeight: 1.6,
              whiteSpace: "pre-line",
            }}
          >
            {after}
          </div>
        </div>
      </div>
      {note ? (
        <p
          style={{
            fontSize: "0.875rem",
            color: "rgba(13,18,38,0.55)",
            marginTop: "0.5rem",
            marginBottom: 0,
            fontStyle: "italic",
          }}
        >
          {note}
        </p>
      ) : null}
    </div>
  );
}
