"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function DecisionCenterAccess() {
  const pathname = usePathname();
  const router = useRouter();
  const [hasGraph, setHasGraph] = useState(false);

  useEffect(() => {
    const check = () => {
      try {
        setHasGraph(
          Boolean(sessionStorage.getItem("whatif_graph"))
        );
      } catch {
        setHasGraph(false);
      }
    };

    check();

    window.addEventListener("pageshow", check);

    return () => {
      window.removeEventListener("pageshow", check);
    };
  }, [pathname]);

  if (
    !hasGraph ||
    !pathname.startsWith("/explore") ||
    pathname === "/explore" ||
    pathname === "/explore/decision-center"
  ) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={() => router.push("/explore/decision-center")}
      className="fixed bottom-5 right-5 z-[90] flex items-center gap-2 rounded-full border border-white/20 bg-[#171717] px-5 py-3.5 text-xs font-bold text-white shadow-[0_10px_35px_rgba(0,0,0,0.22)] transition hover:-translate-y-0.5 hover:bg-[#FF6B35] focus:outline-none focus:ring-4 focus:ring-[#FF6B35]/25"
      aria-label="Open WhatIf decision center"
    >
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/15">
        ✦
      </span>

      Decision center
    </button>
  );
}