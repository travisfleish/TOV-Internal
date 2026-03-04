import Link from "next/link";

interface CtaRowProps {
  label?: string;
}

export function CtaRow({
  label = "Run your copy through the Analyzer",
}: CtaRowProps) {
  return (
    <div
      style={{
        borderTop: "1px solid var(--color-lightGrey)",
        paddingTop: "1.5rem",
        marginTop: "2rem",
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        flexWrap: "wrap",
      }}
    >
      <Link href="/" className="button button-primary">
        {label} →
      </Link>
    </div>
  );
}
