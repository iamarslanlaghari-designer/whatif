import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: 'Decision Center',
  description: 'Organize decisions and options as part of your WhatIf decision exploration workflow.',
  openGraph: {
    title: 'Decision Center',
    description: 'Organize decisions and options as part of your WhatIf decision exploration workflow.',
    siteName: "WhatIf",
    type: "website",
  },
};

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return children;
}
