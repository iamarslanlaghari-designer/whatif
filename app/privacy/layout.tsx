import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/privacy" },
  title: 'Privacy Policy',
  description: 'Read the WhatIf Privacy Policy and learn how information may be handled when using the platform.',
  openGraph: {
    title: 'Privacy Policy',
    description: 'Read the WhatIf Privacy Policy and learn how information may be handled when using the platform.',
    siteName: "WhatIf",
    type: "website",
  },
};

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return children;
}
