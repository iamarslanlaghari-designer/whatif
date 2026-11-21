import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: 'Compare Paths',
  description: 'Compare alternative decision paths and review their possible trade-offs in WhatIf.',
  openGraph: {
    title: 'Compare Paths',
    description: 'Compare alternative decision paths and review their possible trade-offs in WhatIf.',
    siteName: "WhatIf",
    type: "website",
  },
};

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return children;
}
