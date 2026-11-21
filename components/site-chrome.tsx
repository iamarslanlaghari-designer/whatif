"use client";

import { usePathname } from "next/navigation";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const isExploreArea = pathname === "/explore" || pathname.startsWith("/explore/");

  return (
    <>
      {!isHomePage && !isExploreArea && <SiteHeader />}
      <div className="flex-1">{children}</div>
      {!isHomePage && !isExploreArea && <SiteFooter />}
    </>
  );
}
