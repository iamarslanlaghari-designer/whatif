import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/contact" },
  title: 'Contact',
  description: 'Contact the WhatIf team with questions, feedback, or suggestions about the decision exploration platform.',
  openGraph: {
    title: 'Contact',
    description: 'Contact the WhatIf team with questions, feedback, or suggestions about the decision exploration platform.',
    siteName: "WhatIf",
    type: "website",
  },
};

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return children;
}
