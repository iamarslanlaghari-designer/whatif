import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: 'Possible Outcomes',
  description: 'Explore possible outcomes and branching consequences from your WhatIf decision map.',
  openGraph: {
    title: 'Possible Outcomes',
    description: 'Explore possible outcomes and branching consequences from your WhatIf decision map.',
    siteName: "WhatIf",
    type: "website",
  },
};

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return children;
}
