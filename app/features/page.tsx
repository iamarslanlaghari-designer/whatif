
"use client";

import Link from "next/link";
import { usePersistentTheme } from "@/lib/use-persistent-theme";
import { useEffect, useState } from "react";

const features = [
  {
    number: "01",
    title: "AI-Powered Decision Generation",
    description:
      "Describe your situation and let AI turn your question into a structured decision experience with connected choices and possible outcomes.",
    tag: "Smart Generation",
  },
  {
    number: "02",
    title: "Interactive Decision Maps",
    description:
      "Explore your decision visually through connected nodes. Follow branches, understand relationships, and see how one choice can lead to another.",
    tag: "Visual Exploration",
  },
  {
    number: "03",
    title: "Multiple Decision Paths",
    description:
      "Explore different directions instead of looking at only one option. Follow alternative branches and discover where each path could lead.",
    tag: "Branching Choices",
  },
  {
    number: "04",
    title: "Yes / No Branching",
    description:
      "Move through meaningful choices using clear branches such as Yes and No, or other options that fit your situation.",
    tag: "Interactive Choices",
  },
  {
    number: "05",
    title: "Possible Outcomes",
    description:
      "Understand what could happen along different paths. Explore potential results without treating them as guaranteed predictions.",
    tag: "Outcome Exploration",
  },
  {
    number: "06",
    title: "Risk & Opportunity Analysis",
    description:
      "Consider possible benefits, challenges, risks, and opportunities before moving forward with a decision.",
    tag: "Think Ahead",
  },
  {
    number: "07",
    title: "Compare Different Paths",
    description:
      "Review alternative routes and compare their possible consequences to understand the differences between your choices.",
    tag: "Side-by-Side Thinking",
  },
  {
    number: "08",
    title: "Explore at Your Own Pace",
    description:
      "Move through the decision map at your own pace. Revisit branches and consider alternatives whenever you need.",
    tag: "Flexible Exploration",
  },
];

const useCases = [
  {
    title: "Business Decisions",
    description:
      "Explore business ideas, new opportunities, investments, and strategic choices.",
  },
  {
    title: "Career & Education",
    description:
      "Think through career changes, learning paths, and educational decisions.",
  },
  {
    title: "Personal Decisions",
    description:
      "Consider everyday situations, important choices, and alternative directions.",
  },
  {
    title: "Projects & Planning",
    description:
      "Explore project options, possible obstacles, and different ways forward.",
  },
];

export default function FeaturesPage() {
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
    ? "border-white/10 bg-[#202020] hover:border-[#FF6B35]/50"
    : "border-[#EAE9E6] bg-white hover:border-[#FF6B35]/40";

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
              WhatIf Features
            </span>
          </div>

          <h1 className="max-w-[950px] text-[clamp(3.5rem,8vw,7rem)] font-normal leading-[0.98] tracking-[-0.075em]">
            More ways to
            <br />
            explore what{" "}
            <span className="text-[#FF6B35]">could be.</span>
          </h1>

          <div className={`mt-10 flex flex-col justify-between gap-8 border-t pt-8 sm:flex-row sm:items-end ${border}`}>
            <p className={`max-w-[520px] text-[15px] leading-8 ${muted}`}>
              Discover the tools that help you turn a decision into an
              interactive experience. Explore paths, compare choices, and
              understand possible outcomes.
            </p>

            <Link
              href="/explore"
              className="inline-flex w-fit items-center gap-3 rounded-full bg-[#FF6B35] px-6 py-3.5 text-[13px] font-medium text-white transition hover:bg-[#F05B28]"
            >
              Start Exploring <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Overview */}
      <section className={`${soft} px-5 py-20 sm:px-8 sm:py-24`}>
        <div className="mx-auto grid max-w-[1100px] gap-12 md:grid-cols-2 md:items-center">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#FF6B35]">
              The WhatIf Experience
            </span>
            <h2 className="mt-5 text-[clamp(2.5rem,5vw,4.5rem)] font-normal leading-[1.04] tracking-[-0.07em]">
              One question. Many possible directions.
            </h2>
            <p className={`mt-6 text-[14px] leading-8 ${muted}`}>
              WhatIf brings AI-assisted thinking and visual decision
              exploration together. Instead of receiving only a long
              explanation, you can explore a connected map of choices and
              possible outcomes.
            </p>
          </div>

          <div className={`rounded-[26px] border p-6 sm:p-9 ${card}`}>
            <div className="mb-7 flex items-center justify-between">
              <span className="text-[12px] font-medium">Example decision map</span>
              <span className="rounded-full bg-[#FF6B35]/10 px-3 py-1 text-[10px] font-semibold text-[#FF6B35]">
                Interactive concept
              </span>
            </div>

            <div className="flex flex-col items-center">
              <div className="rounded-xl border border-[#FF6B35]/40 bg-[#FF6B35]/10 px-5 py-3 text-center">
                <span className="text-[10px] text-[#FF6B35]">START</span>
                <p className="mt-1 text-[13px] font-medium">Your decision</p>
              </div>

              <div className={`h-8 w-px ${darkMode ? "bg-white/25" : "bg-black/20"}`} />

              <div className="grid w-full grid-cols-2 gap-4">
                <div className="flex flex-col items-center">
                  <span className="rounded-full bg-[#FF6B35] px-3 py-1 text-[10px] font-semibold text-white">YES</span>
                  <div className={`h-6 w-px ${darkMode ? "bg-white/25" : "bg-black/20"}`} />
                  <div className="w-full rounded-xl border p-3 text-center">
                    <p className="text-[12px] font-medium">Explore option A</p>
                    <p className={`mt-1 text-[10px] ${muted}`}>Next decision</p>
                  </div>
                  <div className={`h-6 w-px ${darkMode ? "bg-white/25" : "bg-black/20"}`} />
                  <div className="w-full rounded-xl border border-[#FF6B35]/30 p-3 text-center">
                    <p className="text-[11px] font-medium text-[#FF6B35]">Possible outcome</p>
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <span className="rounded-full border px-3 py-1 text-[10px] font-semibold">NO</span>
                  <div className={`h-6 w-px ${darkMode ? "bg-white/25" : "bg-black/20"}`} />
                  <div className="w-full rounded-xl border p-3 text-center">
                    <p className="text-[12px] font-medium">Explore option B</p>
                    <p className={`mt-1 text-[10px] ${muted}`}>Alternative path</p>
                  </div>
                  <div className={`h-6 w-px ${darkMode ? "bg-white/25" : "bg-black/20"}`} />
                  <div className="w-full rounded-xl border p-3 text-center">
                    <p className="text-[11px] font-medium">Possible outcome</p>
                  </div>
                </div>
              </div>
            </div>

            <p className={`mt-7 text-center text-[10px] leading-5 ${muted}`}>
              Illustrative example. Actual branches depend on your question.
            </p>
          </div>
        </div>
      </section>

      {/* Main Features */}
      <section className="px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-[1100px]">
          <div className="mb-14 max-w-[700px]">
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#FF6B35]">
              Core Features
            </span>
            <h2 className="mt-5 text-[clamp(2.5rem,5vw,4.5rem)] font-normal leading-[1.05] tracking-[-0.07em]">
              Everything to explore a decision from different angles.
            </h2>
            <p className={`mt-6 text-[14px] leading-8 ${muted}`}>
              A closer look at the capabilities behind the WhatIf experience.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {features.map((feature) => (
              <article
                key={feature.number}
                className={`group rounded-[22px] border p-7 transition-all duration-300 hover:-translate-y-1 sm:p-9 ${card}`}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[12px] font-medium text-[#FF6B35]">
                    {feature.number}
                  </span>
                  <span className="rounded-full bg-[#FF6B35]/10 px-3 py-1 text-[10px] font-medium text-[#FF6B35]">
                    {feature.tag}
                  </span>
                </div>

                <h3 className="mt-9 text-[23px] font-normal tracking-[-0.045em]">
                  {feature.title}
                </h3>

                <p className={`mt-4 text-[13px] leading-7 ${muted}`}>
                  {feature.description}
                </p>

                <div className="mt-8 h-[2px] w-8 bg-[#FF6B35] transition-all duration-300 group-hover:w-16" />
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className={`${soft} px-5 py-20 sm:px-8 sm:py-28`}>
        <div className="mx-auto max-w-[1100px]">
          <div className="mb-14 max-w-[650px]">
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#FF6B35]">
              Where You Can Use It
            </span>
            <h2 className="mt-5 text-[clamp(2.5rem,5vw,4.5rem)] font-normal leading-[1.05] tracking-[-0.07em]">
              Decisions happen everywhere.
            </h2>
            <p className={`mt-6 text-[14px] leading-8 ${muted}`}>
              Bring different kinds of questions to WhatIf and explore the
              possibilities around them.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {useCases.map((item, index) => (
              <div key={item.title} className={`rounded-[22px] border p-7 sm:p-9 ${card}`}>
                <span className="text-[12px] font-medium text-[#FF6B35]">
                  0{index + 1}
                </span>
                <h3 className="mt-7 text-[22px] font-normal tracking-[-0.04em]">
                  {item.title}
                </h3>
                <p className={`mt-4 text-[13px] leading-7 ${muted}`}>
                  {item.description}
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
            A Clear Promise
          </span>
          <h2 className="mt-6 text-[clamp(2.5rem,6vw,4.5rem)] font-normal leading-[1.05] tracking-[-0.07em]">
            Possibilities, not predictions.
          </h2>
          <p className={`mx-auto mt-7 max-w-[650px] text-[14px] leading-8 ${muted}`}>
            WhatIf helps you explore scenarios and consider different
            outcomes. It does not guarantee results or know exactly what
            will happen. Your decisions remain your own.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 pb-24 pt-10 sm:px-8 sm:pb-32">
        <div className={`mx-auto max-w-[1100px] border-t pt-12 ${border}`}>
          <div className="flex flex-col justify-between gap-10 sm:flex-row sm:items-end">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#FF6B35]">
                Take the Next Step
              </span>
              <h2 className="mt-6 max-w-[700px] text-[clamp(3rem,7vw,6rem)] font-normal leading-[0.98] tracking-[-0.075em]">
                See your choices differently.
              </h2>
              <p className={`mt-6 max-w-[480px] text-[14px] leading-8 ${muted}`}>
                Start with one question and discover the paths you could explore.
              </p>
            </div>

            <Link
              href="/explore"
              className="inline-flex w-fit shrink-0 items-center gap-4 rounded-full bg-[#FF6B35] px-7 py-4 text-[13px] font-medium text-white transition hover:-translate-y-1 hover:bg-[#F05B28]"
            >
              Explore WhatIf <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
