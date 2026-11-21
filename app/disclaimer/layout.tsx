import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/disclaimer" },
  title: 'Disclaimer',
  description: 'Understand WhatIf’s limitations. AI-generated paths describe possibilities, not predictions or professional advice.',
  openGraph: {
    title: 'Disclaimer',
    description: 'Understand WhatIf’s limitations. AI-generated paths describe possibilities, not predictions or professional advice.',
    siteName: "WhatIf",
    type: "website",
  },
};

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return children;
}
