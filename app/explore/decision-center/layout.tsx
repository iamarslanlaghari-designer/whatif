import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: 'Decision Center Tools',
  description: 'Use WhatIf decision support tools to examine assumptions, risks, opportunities, and possible paths.',
  openGraph: {
    title: 'Decision Center Tools',
    description: 'Use WhatIf decision support tools to examine assumptions, risks, opportunities, and possible paths.',
    siteName: "WhatIf",
    type: "website",
  },
};

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return children;
}
