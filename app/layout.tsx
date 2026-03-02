import type { Metadata } from "next";
import "@/styles/globals.css";
import "@/styles/genius-brand.css";

export const metadata: Metadata = {
  title: "Genius Voice + Visibility QA",
  description: "Proof-of-concept for marketing copy QA across voice, SEO, and AEO."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
