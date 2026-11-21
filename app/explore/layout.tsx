import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: 'Explore a Decision',
  description: 'Describe a decision and generate an interactive map of alternative choices and possible outcomes with WhatIf.',
  openGraph: {
    title: 'Explore a Decision',
    description: 'Describe a decision and generate an interactive map of alternative choices and possible outcomes with WhatIf.',
    siteName: "WhatIf",
    type: "website",
  },
};

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return children;
}
