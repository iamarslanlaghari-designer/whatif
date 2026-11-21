
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";
import "./whatif-chatbot.css";

import SiteChrome from "@/components/site-chrome";
import WhatIfChatbot from "@/components/whatif-chatbot";
import DecisionCenterAccess from "@/components/decision-center-access";

function getMetadataBase(): URL | undefined {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!configuredUrl) return undefined;

  try {
    const url = new URL(configuredUrl);
    return url.protocol === "https:" || url.protocol === "http:"
      ? url
      : undefined;
  } catch {
    return undefined;
  }
}

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  applicationName: "WhatIf",
  metadataBase: getMetadataBase(),
  alternates: { canonical: "/" },
  keywords: [
    "decision making tool",
    "AI decision map",
    "decision paths",
    "explore possible outcomes",
    "decision exploration",
  ],
  title: {
    default: "WhatIf — Explore What Could Be",
    template: "%s | WhatIf",
  },
  description:
    "Explore decisions, compare possible paths, and understand potential outcomes with WhatIf.",
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
  openGraph: {
    title: "WhatIf — Explore What Could Be",
    description:
      "Explore different decisions and discover what could happen next.",
    siteName: "WhatIf",
    type: "website",
    url: "/",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "WhatIf — Explore What Could Be",
    description:
      "Explore decisions, compare possible paths, and understand potential outcomes with WhatIf.",
  },
};

export const viewport: Viewport = {
  themeColor: [
    {
      media: "(prefers-color-scheme: light)",
      color: "#FFFFFF",
    },
    {
      media: "(prefers-color-scheme: dark)",
      color: "#111111",
    },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-screen flex-col">
        <SiteChrome>{children}</SiteChrome>

        <DecisionCenterAccess />
        <WhatIfChatbot />
      </body>
    </html>
  );
}
