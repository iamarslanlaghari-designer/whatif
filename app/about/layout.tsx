import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/about" },
  title: 'About',
  description: 'Learn about WhatIf, an AI-assisted decision exploration platform for exploring choices, branching paths, and possible outcomes.',
  openGraph: {
    title: 'About',
    description: 'Learn about WhatIf, an AI-assisted decision exploration platform for exploring choices, branching paths, and possible outcomes.',
    siteName: "WhatIf",
    type: "website",
  },
};

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return children;
}
