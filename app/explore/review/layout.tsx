import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: 'Review Your Decision',
  description: 'Review your decision scenario and its possible paths before continuing with WhatIf.',
  openGraph: {
    title: 'Review Your Decision',
    description: 'Review your decision scenario and its possible paths before continuing with WhatIf.',
    siteName: "WhatIf",
    type: "website",
  },
};

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return children;
}
