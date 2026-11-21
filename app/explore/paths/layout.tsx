import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: 'Decision Paths',
  description: 'Create and explore alternative paths through your WhatIf decision workflow.',
  openGraph: {
    title: 'Decision Paths',
    description: 'Create and explore alternative paths through your WhatIf decision workflow.',
    siteName: "WhatIf",
    type: "website",
  },
};

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return children;
}
