
"use client";

import Link from "next/link";
import { usePersistentTheme } from "@/lib/use-persistent-theme";
import { useEffect, useState } from "react";

const steps = [
  {
    number: "01",
    title: "Start with a question",
    description:
      "Describe a decision, challenge, or situation you are trying to figure out. It could be about your career, business, education, relationships, or everyday life.",
    detail: "Your question becomes the starting point of your exploration.",
  },
  {
    number: "02",
    title: "AI builds your decision flow",
    description:
      "WhatIf turns your question into an interactive branching flow with connected decisions, choices, and possible outcomes.",
    detail: "Each node represents a decision, possibility, or result.",
  },
  {
    number: "03",
    title: "Explore different paths",
    description:
      "Follow Yes or No choices and other meaningful branches. See how choosing a different direction can lead to a different path.",
    detail: "You are free to explore more than one route.",
  },
  {
    number: "04",
    title: "Understand the possibilities",
    description:
      "Review potential benefits, risks, challenges, and consequences along the paths you explore.",
    detail: "Look beyond the immediate choice and consider what may follow.",
  },
  {
    number: "05",
    title: "Compare and reflect",
    description:
      "Look at alternative paths side by side. Consider their possible outcomes and the assumptions behind them.",
    detail: "Make the comparison that helps you think more clearly.",
  },
  {
    number: "06",
    title: "Make your own decision",
    description:
      "Use the exploration as a thinking aid. You remain in control of your final choice and what you decide to do next.",
    detail: "WhatIf supports your thinking. It does not decide for you.",
  },
];

const benefits = [
  {
    title: "Interactive decision maps",
    description:
      "Explore connected nodes instead of reading one long block of analysis.",
    icon: "01",
  },
  {
    title: "Multiple possible paths",
    description:
      "Discover how different choices can lead to different situations.",
    icon: "02",
  },
  {
    title: "Risks and opportunities",
    description:
      "Consider potential benefits, challenges, and consequences before acting.",
    icon: "03",
  },
  {
    title: "Your decision stays yours",
    description:
      "Explore information and possibilities while keeping control of your choices.",
    icon: "04",
  },
];

export default function HowItWorksPage() {
  const [darkMode, setDarkMode] = usePersistentTheme();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const updateScroll = () => {
      const height =
        document.documentElement.scrollHeight - window.innerHeight;

      const progress =
        height > 0 ? (window.scrollY / height) * 100 : 0;

      setScrollProgress(Math.min(100, Math.max(0, progress)));
      setShowBackToTop(window.scrollY > 400);
    };

    updateScroll();

    window.addEventListener("scroll", updateScroll, { passive: true });
    window.addEventListener("resize", updateScroll);

    return () => {
      window.removeEventListener("scroll", updateScroll);
      window.removeEventListener("resize", updateScroll);
    };
  }, []);

  const page = darkMode
    ? "bg-[#111111] text-white"
    : "bg-white text-[#171717]";

  const muted = darkMode ? "text-white/55" : "text-[#85817E]";
  const border = darkMode ? "border-white/10" : "border-[#EAE9E6]";
  const soft = darkMode ? "bg-[#191919]" : "bg-[#F6F6F4]";
  const card = darkMode
    ? "border-white/10 bg-[#202020]"
    : "border-[#EAE9E6] bg-white";

  return (
    <main className={`min-h-screen overflow-hidden transition-colors duration-300 ${page}`}>
      {/* Scroll Progress */}
      <div className="fixed left-0 top-0 z-[200] h-[3px] w-full">
        <div
          className="h-full bg-[#FF6B35] transition-[width] duration-100"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Dark Mode Toggle */}
      <button
        type="button"
        onClick={() => setDarkMode((value) => !value)}
        aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        aria-pressed={darkMode}
        title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        className={`fixed bottom-24 right-5 z-[120] flex h-12 w-12 items-center justify-center rounded-full border shadow-lg backdrop-blur-xl transition hover:-translate-y-1 ${
          darkMode
            ? "border-white/15 bg-[#252525] text-white"
            : "border-black/10 bg-white text-[#171717]"
        }`}
      >
        {darkMode ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-5 w-5">
            <circle cx="12" cy="12" r="4" />
            <path strokeLinecap="round" d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-5 w-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5 8.5 8.5 0 1 0 20.5 14.2Z" />
          </svg>
        )}
      </button>

      {/* Back to Top */}
      {showBackToTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
          title="Back to top"
          className="fixed bottom-5 right-5 z-[120] flex h-12 w-12 items-center justify-center rounded-full bg-[#FF6B35] text-white shadow-lg transition hover:-translate-y-1 hover:bg-[#F05B28]"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="m5 12 7-7 7 7M12 19V5" />
          </svg>
        </button>
      )}

      {/* Hero */}
      <section className="px-5 pb-20 pt-28 sm:px-8 sm:pb-28 sm:pt-36">
        <div className="mx-auto max-w-[1100px]">
          <div className="mb-8 flex items-center gap-3">
            <span className="h-[2px] w-8 bg-[#FF6B35]" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#FF6B35]">
              How It Works
            </span>
          </div>

          <h1 className="max-w-[900px] text-[clamp(3.5rem,8vw,7rem)] font-normal leading-[0.98] tracking-[-0.075em]">
            Explore every
            <br />
            possible{" "}
            <span className="text-[#FF6B35]">direction.</span>
          </h1>

          <div className={`mt-10 flex flex-col justify-between gap-8 border-t pt-8 sm:flex-row sm:items-end ${border}`}>
            <p className={`max-w-[520px] text-[15px] leading-8 ${muted}`}>
              Turn a question into an interactive decision map. Explore
              choices, follow different paths, and understand what could
              happen next.
            </p>

            <Link
              href="/explore"
              className="inline-flex w-fit items-center gap-3 rounded-full bg-[#FF6B35] px-6 py-3.5 text-[13px] font-medium text-white transition hover:bg-[#F05B28]"
            >
              Try WhatIf <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Overview */}
      <section className={`${soft} px-5 py-20 sm:px-8 sm:py-24`}>
        <div className="mx-auto grid max-w-[1100px] gap-12 md:grid-cols-2 md:items-center">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#FF6B35]">
              A Different Way to Think
            </span>
            <h2 className="mt-5 text-[clamp(2.5rem,5vw,4.5rem)] font-normal leading-[1.04] tracking-[-0.07em]">
              Not just answers. Explore the paths.
            </h2>
            <p className={`mt-6 text-[14px] leading-8 ${muted}`}>
              Most decisions involve more than one possible direction.
              WhatIf helps you see those directions through a visual,
              connected decision experience.
            </p>
          </div>

          {/* Conceptual branching flow illustration */}
          <div className={`rounded-[26px] border p-6 sm:p-9 ${card}`}>
            <div className="mb-7 flex items-center justify-between">
              <span className="text-[12px] font-medium">Decision flow preview</span>
              <span className="rounded-full bg-[#FF6B35]/10 px-3 py-1 text-[10px] font-semibold text-[#FF6B35]">
                Example
              </span>
            </div>

            <div className="flex flex-col items-center">
              <div className="rounded-xl border border-[#FF6B35]/40 bg-[#FF6B35]/10 px-5 py-3 text-center">
                <span className="text-[11px] font-medium">Your decision</span>
                <p className="mt-1 text-[13px]">Start a new project?</p>
              </div>

              <div className={`h-8 w-px ${darkMode ? "bg-white/25" : "bg-black/20"}`} />

              <div className="grid w-full grid-cols-2 gap-4">
                <div className="flex flex-col items-center">
                  <span className="rounded-full bg-[#FF6B35] px-3 py-1 text-[10px] font-semibold text-white">
                    YES
                  </span>
                  <div className={`h-6 w-px ${darkMode ? "bg-white/25" : "bg-black/20"}`} />
                  <div className="w-full rounded-xl border p-3 text-center">
                    <p className="text-[12px] font-medium">Plan the project</p>
                    <p className={`mt-1 text-[10px] ${muted}`}>Explore the next steps</p>
                  </div>
                  <div className={`h-6 w-px ${darkMode ? "bg-white/25" : "bg-black/20"}`} />
                  <div className="w-full rounded-xl border border-[#FF6B35]/30 p-3 text-center">
                    <p className="text-[11px] font-medium text-[#FF6B35]">Possible outcome</p>
                    <p className={`mt-1 text-[10px] ${muted}`}>New opportunities</p>
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <span className="rounded-full border px-3 py-1 text-[10px] font-semibold">
                    NO
                  </span>
                  <div className={`h-6 w-px ${darkMode ? "bg-white/25" : "bg-black/20"}`} />
                  <div className="w-full rounded-xl border p-3 text-center">
                    <p className="text-[12px] font-medium">Wait and prepare</p>
                    <p className={`mt-1 text-[10px] ${muted}`}>Consider alternatives</p>
                  </div>
                  <div className={`h-6 w-px ${darkMode ? "bg-white/25" : "bg-black/20"}`} />
                  <div className="w-full rounded-xl border p-3 text-center">
                    <p className="text-[11px] font-medium">Possible outcome</p>
                    <p className={`mt-1 text-[10px] ${muted}`}>More preparation time</p>
                  </div>
                </div>
              </div>
            </div>

            <p className={`mt-7 text-center text-[10px] leading-5 ${muted}`}>
              Simplified illustration. Actual decision flows depend on your question.
            </p>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-[1100px]">
          <div className="mb-14 max-w-[700px]">
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#FF6B35]">
              The Process
            </span>
            <h2 className="mt-5 text-[clamp(2.5rem,5vw,4.5rem)] font-normal leading-[1.05] tracking-[-0.07em]">
              Six steps to explore what could be.
            </h2>
          </div>

          <div className={`border-t ${border}`}>
            {steps.map((step) => (
              <div
                key={step.number}
                className={`grid gap-4 border-b py-8 sm:grid-cols-[90px_1fr_1fr] sm:items-start sm:gap-8 ${border}`}
              >
                <span className="text-[13px] font-medium text-[#FF6B35]">
                  {step.number}
                </span>

                <div>
                  <h3 className="text-[22px] font-normal tracking-[-0.04em]">
                    {step.title}
                  </h3>
                  <p className={`mt-3 text-[12px] leading-6 ${muted}`}>
                    {step.detail}
                  </p>
                </div>

                <p className={`text-[13px] leading-7 ${muted}`}>
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className={`${soft} px-5 py-20 sm:px-8 sm:py-28`}>
        <div className="mx-auto max-w-[1100px]">
          <div className="mb-14 max-w-[650px]">
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#FF6B35]">
              What You Can Do
            </span>
            <h2 className="mt-5 text-[clamp(2.5rem,5vw,4.5rem)] font-normal leading-[1.05] tracking-[-0.07em]">
              A clearer way to explore decisions.
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {benefits.map((benefit) => (
              <div
                key={benefit.icon}
                className={`rounded-[22px] border p-7 transition hover:-translate-y-1 sm:p-9 ${card}`}
              >
                <span className="text-[12px] font-medium text-[#FF6B35]">
                  {benefit.icon}
                </span>
                <h3 className="mt-8 text-[22px] font-normal tracking-[-0.04em]">
                  {benefit.title}
                </h3>
                <p className={`mt-4 text-[13px] leading-7 ${muted}`}>
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="px-5 py-20 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-[850px] text-center">
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#FF6B35]">
            Keep in Mind
          </span>
          <h2 className="mt-6 text-[clamp(2.5rem,6vw,4.5rem)] font-normal leading-[1.05] tracking-[-0.07em]">
            Possibilities, not predictions.
          </h2>
          <p className={`mx-auto mt-7 max-w-[650px] text-[14px] leading-8 ${muted}`}>
            The paths and outcomes explored in WhatIf are possibilities
            generated to support your thinking. They are not guarantees.
            Real-world results depend on circumstances, information, and
            decisions that may change over time.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 pb-24 pt-10 sm:px-8 sm:pb-32">
        <div className={`mx-auto max-w-[1100px] border-t pt-12 ${border}`}>
          <div className="flex flex-col justify-between gap-10 sm:flex-row sm:items-end">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#FF6B35]">
                Ready to Begin?
              </span>
              <h2 className="mt-6 max-w-[700px] text-[clamp(3rem,7vw,6rem)] font-normal leading-[0.98] tracking-[-0.075em]">
                Your next decision starts here.
              </h2>
              <p className={`mt-6 max-w-[480px] text-[14px] leading-8 ${muted}`}>
                Bring a question. Explore different paths. See what could be.
              </p>
            </div>

            <Link
              href="/explore"
              className="inline-flex w-fit shrink-0 items-center gap-4 rounded-full bg-[#FF6B35] px-7 py-4 text-[13px] font-medium text-white transition hover:-translate-y-1 hover:bg-[#F05B28]"
            >
              Start Exploring <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
