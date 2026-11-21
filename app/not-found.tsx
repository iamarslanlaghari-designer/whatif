
"use client";

import Link from "next/link";
import { usePersistentTheme } from "@/lib/use-persistent-theme";

export default function NotFound() {
  const [darkMode, setDarkMode] = usePersistentTheme();

  const pageBg = darkMode ? "bg-[#111111]" : "bg-[#FAFAF9]";
  const headingColor = darkMode ? "text-white" : "text-[#171717]";
  const mutedColor = darkMode ? "text-[#A1A1AA]" : "text-[#85817E]";

  return (
    <main
      className={`relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-24 transition-colors duration-300 ${pageBg}`}
    >
      {/* Background Decoration */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FF6B35]/[0.06] blur-[100px]" />

      <div className="relative z-10 mx-auto w-full max-w-[750px] text-center">
        {/* 404 Label */}
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#FF6B35]/20 bg-[#FF6B35]/[0.07] px-4 py-2">
          <span className="h-2 w-2 rounded-full bg-[#FF6B35]" />
          <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#FF6B35]">
            Page Not Found
          </span>
        </div>

        {/* 404 Number */}
        <div className="relative mx-auto mb-8">
          <h1
            className="select-none text-[125px] font-semibold leading-none tracking-[-0.10em] text-[#FF6B35] sm:text-[190px] lg:text-[230px]"
            aria-label="404"
          >
            404
          </h1>

          <div className="absolute left-1/2 top-1/2 flex h-[75px] w-[75px] -translate-x-1/2 -translate-y-1/2 animate-bounce items-center justify-center rounded-[24px] border border-[#FF6B35]/20 bg-[#FF6B35]/10 shadow-xl backdrop-blur-md sm:h-[90px] sm:w-[90px]">
            <svg
              width="42"
              height="42"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#FF6B35"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
              <path d="M8 11h6M11 8v6" />
            </svg>
          </div>
        </div>

        {/* Message */}
        <h2
          className={`text-[32px] font-normal tracking-[-0.065em] sm:text-[46px] ${headingColor}`}
        >
          Looks like you&apos;re lost.
        </h2>

        <p
          className={`mx-auto mt-5 max-w-[460px] text-[13px] leading-8 sm:text-[14px] ${mutedColor}`}
        >
          The page you&apos;re looking for doesn&apos;t exist, may have been moved, or
          the link might be incorrect. Let&apos;s help you find your way back.
        </p>

        {/* Actions */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="rounded-full bg-[#FF6B35] px-8 py-4 text-[13px] font-medium text-white transition hover:-translate-y-0.5 hover:bg-[#e95c2c]"
          >
            Back to Home →
          </Link>

          <Link
            href="/explore"
            className={`rounded-full border px-8 py-4 text-[13px] font-medium transition ${
              darkMode
                ? "border-white/15 text-white hover:bg-white/5"
                : "border-black/10 text-[#171717] hover:bg-black/[0.03]"
            }`}
          >
            Explore WhatIf
          </Link>
        </div>

        {/* Helpful Links */}
        <div className="mt-16">
          <p className={`mb-5 text-[11px] uppercase tracking-[0.15em] ${mutedColor}`}>
            Or visit one of these pages
          </p>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
            {[
              { label: "About", href: "/about" },
              { label: "Features", href: "/features" },
              { label: "How It Works", href: "/how-it-works" },
              { label: "FAQ", href: "/faq" },
              { label: "Contact", href: "/contact" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-[12px] transition hover:text-[#FF6B35] ${mutedColor}`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <p className={`mt-14 text-[11px] ${mutedColor}`}>
          WhatIf — Explore What Could Be.
        </p>
      </div>

      {/* Dark Mode Toggle */}
      <button
        type="button"
        onClick={() => setDarkMode((current) => !current)}
        aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        title={darkMode ? "Light mode" : "Dark mode"}
        className={`fixed bottom-5 right-5 z-[120] flex h-12 w-12 items-center justify-center rounded-full border shadow-lg transition hover:scale-105 ${
          darkMode
            ? "border-white/10 bg-[#292929] text-white"
            : "border-black/[0.06] bg-white text-[#171717]"
        }`}
      >
        {darkMode ? (
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" />
          </svg>
        ) : (
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20.9 13A9 9 0 0 1 11 3.1 9 9 0 1 0 20.9 13Z" />
          </svg>
        )}
      </button>
    </main>
  );
}
