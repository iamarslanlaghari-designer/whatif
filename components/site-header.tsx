"use client";

import { useState } from "react";
import Link from "next/link";
import WhatIfLogo from "@/components/whatif-logo";

const navItems = [
  ["About", "/about"],
  ["Capabilities", "/features"],
  ["How It Works", "/how-it-works"],
  ["Explore", "/explore"],
  ["FAQ", "/faq"],
] as const;

export default function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="whatif-site-header fixed inset-x-0 top-0 z-[100] px-3 pt-3 sm:px-5 sm:pt-4">
      <nav className="whatif-site-nav mx-auto flex w-full max-w-[1100px] items-center justify-between gap-2 rounded-[22px] border border-black/[0.065] bg-white/90 p-2 shadow-[0_8px_35px_rgba(0,0,0,0.075)] backdrop-blur-2xl sm:gap-3 sm:px-3">
        <Link href="/" className="flex shrink-0 items-center pl-1 sm:pl-2" aria-label="WhatIf home">
          <span className="whatif-header-logo-light inline-flex items-center">
            <WhatIfLogo theme="light" variant="wordmark" priority className="!h-[42px] !w-[155px] object-contain" />
          </span>
          <span className="whatif-header-logo-dark inline-flex items-center">
            <WhatIfLogo theme="dark" variant="wordmark" priority className="!h-[42px] !w-[155px] object-contain" />
          </span>
        </Link>

        <div className="hidden min-w-0 flex-1 items-center justify-center gap-1 px-1 py-1 lg:flex">
          {navItems.map(([label, href]) => (
            <Link key={href} href={href} className="whatif-header-link whitespace-nowrap rounded-full px-3 py-2.5 text-[12px] font-medium transition hover:bg-black/[0.045] xl:px-4 xl:text-[13px]">
              {label}
            </Link>
          ))}
        </div>

        <Link href="/explore" className="hidden shrink-0 items-center gap-2 rounded-[16px] bg-[#FF6B35] px-5 py-3.5 text-[13px] font-semibold text-white shadow-[0_5px_15px_rgba(255,107,53,0.24)] transition hover:-translate-y-0.5 hover:bg-[#ed5d2b] lg:flex">
          Get Started <span aria-hidden="true">→</span>
        </Link>

        <button type="button" onClick={() => setMobileOpen((open) => !open)} className="whatif-header-menu-button rounded-xl p-3 lg:hidden" aria-label={mobileOpen ? "Close navigation" : "Open navigation"} aria-expanded={mobileOpen} aria-controls="whatif-mobile-navigation">
          {mobileOpen ? "×" : "☰"}
        </button>
      </nav>

      {mobileOpen && (
        <div id="whatif-mobile-navigation" className="whatif-mobile-menu mx-auto mt-2 max-w-[1100px] rounded-2xl border border-black/5 bg-white p-4 shadow-xl lg:hidden">
          {navItems.map(([label, href]) => (
            <Link key={href} href={href} onClick={() => setMobileOpen(false)} className="whatif-mobile-link block border-b border-black/5 py-3 text-sm font-medium last:border-0">
              {label}
            </Link>
          ))}
          <Link href="/contact" onClick={() => setMobileOpen(false)} className="whatif-mobile-link block border-b border-black/5 py-3 text-sm font-medium">Contact</Link>
          <Link href="/explore" onClick={() => setMobileOpen(false)} className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-[#FF6B35] px-4 py-3 text-sm font-semibold text-white">
            Get Started →
          </Link>
        </div>
      )}
    </header>
  );
}
