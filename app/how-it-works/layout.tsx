import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/how-it-works" },
  title: 'How It Works',
  description: 'See how WhatIf turns a decision question into an interactive map of possible paths, choices, and outcomes.',
  openGraph: {
    title: 'How It Works',
    description: 'See how WhatIf turns a decision question into an interactive map of possible paths, choices, and outcomes.',
    siteName: "WhatIf",
    type: "website",
  },
};

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return children;
}
