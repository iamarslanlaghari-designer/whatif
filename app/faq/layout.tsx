import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/faq" },
  title: 'Frequently Asked Questions',
  description: 'Find answers about using WhatIf, AI-generated decision maps, possible outcomes, privacy, and platform features.',
  openGraph: {
    title: 'Frequently Asked Questions',
    description: 'Find answers about using WhatIf, AI-generated decision maps, possible outcomes, privacy, and platform features.',
    siteName: "WhatIf",
    type: "website",
  },
};

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return children;
}
