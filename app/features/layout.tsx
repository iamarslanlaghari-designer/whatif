import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/features" },
  title: 'Features',
  description: 'Explore WhatIf features including interactive decision maps, branching choices, path comparison, and possible outcome exploration.',
  openGraph: {
    title: 'Features',
    description: 'Explore WhatIf features including interactive decision maps, branching choices, path comparison, and possible outcome exploration.',
    siteName: "WhatIf",
    type: "website",
  },
};

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return children;
}
