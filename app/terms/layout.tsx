import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/terms" },
  title: 'Terms & Conditions',
  description: 'Review the terms and conditions for using WhatIf and its AI-assisted decision exploration features.',
  openGraph: {
    title: 'Terms & Conditions',
    description: 'Review the terms and conditions for using WhatIf and its AI-assisted decision exploration features.',
    siteName: "WhatIf",
    type: "website",
  },
};

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return children;
}
