interface ChecklistProps {
  items: string[];
  title?: string;
}

export function Checklist({ items, title }: ChecklistProps) {
  return (
    <div
      style={{
        background: "var(--color-lightGrey)",
        borderRadius: "var(--radius-md)",
        padding: "1.25rem 1.5rem",
        marginBottom: "var(--space-4)",
      }}
    >
      {title ? (
        <strong
          style={{ display: "block", marginBottom: "0.75rem" }}
        >
          {title}
        </strong>
      ) : null}
      <ul
        style={{ margin: 0, paddingLeft: "1.25rem" }}
        role="list"
      >
        {items.map((item, i) => (
          <li key={i} style={{ marginBottom: "0.4rem", lineHeight: 1.55 }}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
