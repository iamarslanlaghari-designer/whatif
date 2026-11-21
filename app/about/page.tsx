
"use client";

import Link from "next/link";
import { usePersistentTheme } from "@/lib/use-persistent-theme";
import { useEffect, useState } from "react";

const values = [
  {
    number: "01",
    title: "Clarity over complexity",
    description:
      "We make complex situations easier to understand by breaking them into clear choices and manageable steps.",
  },
  {
    number: "02",
    title: "Explore before deciding",
    description:
      "Consider different directions before committing to one. Understanding your options can help you make more informed decisions.",
  },
  {
    number: "03",
    title: "Think beyond the obvious",
    description:
      "Look beyond the immediate choice and explore the opportunities, challenges, and consequences that may follow.",
  },
  {
    number: "04",
    title: "Possibilities, not predictions",
    description:
      "WhatIf helps you explore possible scenarios. It does not promise or predict what will happen in real life.",
  },
];

const steps = [
  {
    number: "01",
    title: "Describe your situation",
    description:
      "Start with a question, challenge, or decision you are thinking about.",
  },
  {
    number: "02",
    title: "Explore different choices",
    description:
      "Discover alternative paths and see how different decisions could lead to different situations.",
  },
  {
    number: "03",
    title: "Understand possible outcomes",
    description:
      "Explore potential benefits, risks, challenges, and opportunities connected to each path.",
  },
  {
    number: "04",
    title: "Make your own decision",
    description:
      "Use what you have explored to think more clearly and decide what makes sense for you.",
  },
];

export default function AboutPage() {
  const [darkMode, setDarkMode] = usePersistentTheme();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const updateScroll = () => {
      const scrollableHeight =
        document.documentElement.scrollHeight - window.innerHeight;

      const progress =
        scrollableHeight > 0
          ? (window.scrollY / scrollableHeight) * 100
          : 0;

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

  const backToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const page = darkMode
    ? "bg-[#111111] text-white"
    : "bg-white text-[#171717]";

  const muted = darkMode ? "text-white/55" : "text-[#85817E]";

  const border = darkMode ? "border-white/10" : "border-[#EAE9E6]";

  const softSection = darkMode ? "bg-[#191919]" : "bg-[#F6F6F4]";

  const cardSection = darkMode ? "bg-[#151515]" : "bg-[#FAFAF9]";

  const card = darkMode
    ? "border-white/10 bg-[#202020] hover:border-[#FF6B35]/50"
    : "border-[#EAE9E6] bg-white hover:border-[#FF6B35]/40";

  return (
    <main className={`min-h-screen overflow-hidden transition-colors duration-300 ${page}`}>
      {/* Scroll Progress Bar */}
      <div className="fixed left-0 top-0 z-[200] h-[3px] w-full bg-transparent">
        <div
          className="h-full bg-[#FF6B35] transition-[width] duration-100"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Dark Mode Toggle - Bottom Right */}
      <button
        type="button"
        onClick={() => setDarkMode((current) => !current)}
        aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        aria-pressed={darkMode}
        title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        className={`fixed bottom-24 right-5 z-[120] flex h-12 w-12 items-center justify-center rounded-full border shadow-lg backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 ${
          darkMode
            ? "border-white/15 bg-[#252525] text-white hover:bg-[#333333]"
            : "border-black/10 bg-white text-[#171717] hover:bg-[#F6F6F4]"
        }`}
      >
        {darkMode ? (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            className="h-5 w-5"
          >
            <circle cx="12" cy="12" r="4" />
            <path
              strokeLinecap="round"
              d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"
            />
          </svg>
        ) : (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            className="h-5 w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5 8.5 8.5 0 1 0 20.5 14.2Z"
            />
          </svg>
        )}
      </button>

      {/* Back To Top */}
      {showBackToTop && (
        <button
          type="button"
          onClick={backToTop}
          aria-label="Back to top"
          title="Back to top"
          className="fixed bottom-5 right-5 z-[120] flex h-12 w-12 items-center justify-center rounded-full bg-[#FF6B35] text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-[#F05B28]"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-5 w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m5 12 7-7 7 7M12 19V5"
            />
          </svg>
        </button>
      )}

      {/* Hero Section */}
      <section className="relative px-5 pb-20 pt-28 sm:px-8 sm:pb-28 sm:pt-36">
        <div className="mx-auto max-w-[1100px]">
          <div className="mb-8 flex items-center gap-3">
            <span className="h-[2px] w-8 bg-[#FF6B35]" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#FF6B35]">
              About WhatIf
            </span>
          </div>

          <h1 className="max-w-[850px] text-[clamp(3.5rem,8vw,7rem)] font-normal leading-[0.98] tracking-[-0.075em]">
            Every decision
            <br />
            opens a new{" "}
            <span className="text-[#FF6B35]">possibility.</span>
          </h1>

          <div className="mt-10 flex flex-col justify-between gap-8 border-t pt-8 sm:flex-row sm:items-end sm:pt-10">
            <p className={`max-w-[510px] text-[15px] leading-8 ${muted}`}>
              WhatIf is a space to explore decisions, understand different
              possibilities, and think through the paths that could follow
              every choice.
            </p>

            <Link
              href="/explore"
              className="inline-flex w-fit items-center gap-3 rounded-full bg-[#FF6B35] px-6 py-3.5 text-[13px] font-medium text-white transition hover:bg-[#F05B28]"
            >
              Start Exploring
              <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className={`${softSection} px-5 py-20 sm:px-8 sm:py-28`}>
        <div className="mx-auto grid max-w-[1100px] gap-12 md:grid-cols-[0.8fr_1.2fr] md:gap-20">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#FF6B35]">
              Our Purpose
            </span>
            <h2 className="mt-5 text-[clamp(2.5rem,5vw,4.5rem)] font-normal leading-[1.04] tracking-[-0.07em]">
              Thinking through what comes next.
            </h2>
          </div>

          <div className="space-y-6 md:pt-12">
            <p className={`text-[17px] leading-9 ${muted}`}>
              Life and work are full of decisions. Some are simple, while
              others involve uncertainty, multiple choices, and consequences
              that are difficult to see at first.
            </p>

            <p className={`text-[15px] leading-8 ${muted}`}>
              WhatIf helps you look at those decisions from different angles.
              Instead of focusing on just one answer, you can explore
              alternative choices, follow possible paths, and understand what
              might happen next.
            </p>

            <p className={`text-[15px] leading-8 ${muted}`}>
              Our goal is to make decision exploration clearer, more
              interactive, and easier to understand.
            </p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-[1100px]">
          <div className="overflow-hidden rounded-[28px] bg-[#191919] px-7 py-12 text-white sm:px-14 sm:py-16">
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#FF8A61]">
              Our Mission
            </span>

            <h2 className="mt-7 max-w-[850px] text-[clamp(2.5rem,6vw,5.5rem)] font-normal leading-[1.05] tracking-[-0.07em]">
              Help people see more than one way forward.
            </h2>

            <div className="mt-10 flex flex-col justify-between gap-8 border-t border-white/15 pt-8 sm:flex-row sm:items-end">
              <p className="max-w-[500px] text-[14px] leading-8 text-white/55">
                We want to make it easier to explore different choices,
                understand possible consequences, and approach decisions
                with greater clarity.
              </p>

              <span className="text-[13px] font-medium text-[#FF8A61]">
                Explore What Could Be.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className={`${cardSection} px-5 py-20 sm:px-8 sm:py-28`}>
        <div className="mx-auto max-w-[1100px]">
          <div className="mb-14 max-w-[650px]">
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#FF6B35]">
              What We Believe
            </span>

            <h2 className="mt-5 text-[clamp(2.5rem,5vw,4.5rem)] font-normal leading-[1.05] tracking-[-0.07em]">
              The principles behind WhatIf.
            </h2>

            <p className={`mt-6 text-[14px] leading-8 ${muted}`}>
              The experience is built around helping you think clearly,
              consider alternatives, and understand uncertainty.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {values.map((value) => (
              <div
                key={value.number}
                className={`group rounded-[22px] border p-7 transition-all duration-300 hover:-translate-y-1 sm:p-9 ${card}`}
              >
                <span className="text-[12px] font-medium text-[#FF6B35]">
                  {value.number}
                </span>

                <h3 className="mt-9 text-[23px] font-normal tracking-[-0.045em]">
                  {value.title}
                </h3>

                <p className={`mt-4 text-[13px] leading-7 ${muted}`}>
                  {value.description}
                </p>

                <div className="mt-8 h-[2px] w-8 bg-[#FF6B35] transition-all duration-300 group-hover:w-16" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-[1100px]">
          <div className="mb-14 max-w-[650px]">
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#FF6B35]">
              How It Works
            </span>

            <h2 className="mt-5 text-[clamp(2.5rem,5vw,4.5rem)] font-normal leading-[1.05] tracking-[-0.07em]">
              From a question to different possibilities.
            </h2>
          </div>

          <div className={`border-t ${border}`}>
            {steps.map((step) => (
              <div
                key={step.number}
                className={`grid gap-4 border-b py-8 sm:grid-cols-[100px_1fr_1fr] sm:items-center sm:gap-8 ${border}`}
              >
                <span className="text-[13px] font-medium text-[#FF6B35]">
                  {step.number}
                </span>

                <h3 className="text-[21px] font-normal tracking-[-0.04em]">
                  {step.title}
                </h3>

                <p className={`text-[13px] leading-7 ${muted}`}>
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Important Note */}
      <section className={`${softSection} px-5 py-20 sm:px-8 sm:py-24`}>
        <div className="mx-auto max-w-[900px] text-center">
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#FF6B35]">
            An Important Note
          </span>

          <h2 className="mt-6 text-[clamp(2.5rem,6vw,5rem)] font-normal leading-[1.05] tracking-[-0.07em]">
            Possibilities,
            <br />
            <span className="text-[#FF6B35]">not predictions.</span>
          </h2>

          <p className={`mx-auto mt-8 max-w-[620px] text-[14px] leading-8 ${muted}`}>
            WhatIf is designed to help you explore possible scenarios and
            think through different outcomes. Real-life results depend on
            many factors, and the possibilities shown are not guarantees
            or predictions of what will happen.
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-5 py-24 sm:px-8 sm:py-32">
        <div className="mx-auto max-w-[1100px]">
          <div className="flex flex-col justify-between gap-10 sm:flex-row sm:items-end">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#FF6B35]">
                Your Next Step
              </span>

              <h2 className="mt-6 max-w-[700px] text-[clamp(3rem,7vw,6rem)] font-normal leading-[0.98] tracking-[-0.075em]">
                What will you
                <br />
                <span className="text-[#FF6B35]">explore next?</span>
              </h2>

              <p className={`mt-7 max-w-[470px] text-[14px] leading-8 ${muted}`}>
                Start with a question. Explore different paths. Discover
                what could be possible.
              </p>
            </div>

            <Link
              href="/explore"
              className="inline-flex w-fit shrink-0 items-center gap-4 rounded-full bg-[#FF6B35] px-7 py-4 text-[13px] font-medium text-white transition hover:-translate-y-1 hover:bg-[#F05B28]"
            >
              Explore WhatIf
              <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
