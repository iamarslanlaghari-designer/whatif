
"use client";

import Link from "next/link";
import { usePersistentTheme } from "@/lib/use-persistent-theme";
import { useEffect, useState } from "react";

const faqs = [
  {
    category: "Getting Started",
    questions: [
      {
        question: "What is WhatIf?",
        answer:
          "WhatIf is an AI-powered decision exploration platform that helps you think through different choices, explore possible paths, and understand potential outcomes before making a decision.",
      },
      {
        question: "How does WhatIf work?",
        answer:
          "You start by describing a decision or situation. WhatIf uses AI to create an interactive branching decision flow. You can then explore different choices, follow alternative paths, and understand the possibilities connected to each decision.",
      },
      {
        question: "Who can use WhatIf?",
        answer:
          "Anyone who wants to think through a decision can use WhatIf. It can help with business planning, career choices, education, personal decisions, projects, and other situations where exploring alternatives is useful.",
      },
      {
        question: "Do I need any special knowledge to use it?",
        answer:
          "No. Simply describe your situation in everyday language. WhatIf is designed to make exploring decisions straightforward and accessible.",
      },
    ],
  },
  {
    category: "AI & Decision Paths",
    questions: [
      {
        question: "How does AI generate decision paths?",
        answer:
          "AI analyzes the situation you describe and organizes possible choices into connected decision steps. Depending on your situation, these steps may include Yes/No branches, alternative actions, possible consequences, risks, and outcomes.",
      },
      {
        question: "Are the outcomes guaranteed predictions?",
        answer:
          "No. WhatIf explores possibilities, not predictions. The results are AI-generated scenarios based on the information provided. Real-world outcomes can be different.",
      },
      {
        question: "Can I explore different choices?",
        answer:
          "Yes. You can follow different branches of the decision map to explore alternative choices and understand how each path could lead to different possibilities.",
      },
      {
        question: "Can WhatIf identify risks and opportunities?",
        answer:
          "WhatIf can highlight potential risks, benefits, opportunities, and challenges associated with different paths. These insights are intended to support your thinking, not replace your own judgment.",
      },
      {
        question: "Will every decision have the same number of paths?",
        answer:
          "No. The number and structure of paths depend on the complexity of your question and the alternatives that make sense for your situation.",
      },
    ],
  },
  {
    category: "Using WhatIf",
    questions: [
      {
        question: "Can I compare different decision paths?",
        answer:
          "WhatIf is designed to help you examine alternative paths and understand their potential differences. Comparison helps you reflect on the trade-offs involved in different choices.",
      },
      {
        question: "Can I change my original question?",
        answer:
          "You can start a new exploration whenever you want to examine a different question or approach the same situation from another perspective.",
      },
      {
        question: "What kind of decisions can I explore?",
        answer:
          "You can explore decisions related to business, careers, education, personal goals, projects, planning, and many everyday situations. The quality of the exploration depends on the context you provide.",
      },
      {
        question: "Does WhatIf make decisions for me?",
        answer:
          "No. WhatIf helps you explore possible directions and think through consequences. The final decision always remains yours.",
      },
    ],
  },
  {
    category: "Privacy & Trust",
    questions: [
      {
        question: "Should I share sensitive personal information?",
        answer:
          "Avoid entering passwords, financial account details, confidential business information, or other sensitive personal data. Share only the context necessary to explore your decision.",
      },
      {
        question: "Can AI make mistakes?",
        answer:
          "Yes. AI-generated information can sometimes be incomplete, inaccurate, or based on assumptions. Review the suggestions carefully and verify important information independently.",
      },
      {
        question: "Can I rely on WhatIf for professional advice?",
        answer:
          "WhatIf is a decision-exploration tool, not a replacement for qualified professional advice. For important legal, medical, financial, or other high-stakes decisions, consult an appropriate professional.",
      },
    ],
  },
];

export default function FAQPage() {
  const [darkMode, setDarkMode] = usePersistentTheme();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [openQuestion, setOpenQuestion] = useState<string | null>("0-0");

  useEffect(() => {
    const handleScroll = () => {
      const scrollableHeight =
        document.documentElement.scrollHeight - window.innerHeight;

      const progress =
        scrollableHeight > 0
          ? (window.scrollY / scrollableHeight) * 100
          : 0;

      setScrollProgress(progress);
      setShowBackToTop(window.scrollY > 400);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleQuestion = (id: string) => {
    setOpenQuestion((current) => (current === id ? null : id));
  };

  const pageBg = darkMode ? "bg-[#111111]" : "bg-[#FAFAF9]";
  const headingColor = darkMode ? "text-white" : "text-[#171717]";
  const mutedColor = darkMode ? "text-[#A1A1AA]" : "text-[#85817E]";
  const cardBg = darkMode
    ? "border-white/[0.08] bg-[#191919]"
    : "border-black/[0.06] bg-white";
  const cardHover = darkMode
    ? "hover:border-[#FF6B35]/40"
    : "hover:border-[#FF6B35]/40";

  return (
    <main
      className={`relative min-h-screen overflow-hidden transition-colors duration-300 ${pageBg}`}
    >
      {/* Scroll Progress */}
      <div className="fixed left-0 top-0 z-[200] h-[3px] w-full bg-transparent">
        <div
          className="h-full bg-[#FF6B35] transition-[width] duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Hero */}
      <section className="px-5 pb-20 pt-32 sm:px-8 sm:pt-40">
        <div className="mx-auto max-w-[1100px] text-center">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#FF6B35]/20 bg-[#FF6B35]/[0.07] px-4 py-2">
            <span className="h-2 w-2 rounded-full bg-[#FF6B35]" />
            <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#FF6B35]">
              Frequently Asked Questions
            </span>
          </div>

          <h1
            className={`mx-auto max-w-[850px] text-[46px] font-normal leading-[1.08] tracking-[-0.075em] sm:text-[65px] lg:text-[78px] ${headingColor}`}
          >
            Questions?
            <br />
            <span className="text-[#FF6B35]">We&apos;ve got answers.</span>
          </h1>

          <p
            className={`mx-auto mt-7 max-w-[570px] text-[14px] leading-8 sm:text-[15px] ${mutedColor}`}
          >
            Everything you need to know about WhatIf, how it works, and how
            you can explore different possibilities before making a decision.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/explore"
              className="rounded-full bg-[#FF6B35] px-7 py-3.5 text-[13px] font-medium text-white transition hover:bg-[#e95c2c]"
            >
              Start Exploring
            </Link>

            <a
              href="#questions"
              className={`rounded-full border px-7 py-3.5 text-[13px] font-medium transition ${
                darkMode
                  ? "border-white/15 text-white hover:bg-white/5"
                  : "border-black/10 text-[#171717] hover:bg-black/[0.03]"
              }`}
            >
              Browse Questions
            </a>
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section id="questions" className="px-5 pb-28 sm:px-8">
        <div className="mx-auto max-w-[850px]">
          <div className="mb-12 text-center">
            <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.18em] text-[#FF6B35]">
              Find Your Answers
            </p>
            <h2
              className={`text-[32px] font-normal tracking-[-0.06em] sm:text-[44px] ${headingColor}`}
            >
              Everything, explained.
            </h2>
          </div>

          <div className="space-y-12">
            {faqs.map((group, groupIndex) => (
              <div key={group.category}>
                <div className="mb-5 flex items-center gap-4">
                  <h3
                    className={`shrink-0 text-[13px] font-semibold ${headingColor}`}
                  >
                    {group.category}
                  </h3>
                  <div
                    className={`h-px flex-1 ${
                      darkMode ? "bg-white/10" : "bg-black/[0.08]"
                    }`}
                  />
                </div>

                <div className="space-y-3">
                  {group.questions.map((item, questionIndex) => {
                    const id = `${groupIndex}-${questionIndex}`;
                    const isOpen = openQuestion === id;

                    return (
                      <div
                        key={item.question}
                        className={`overflow-hidden rounded-[18px] border transition-all duration-200 ${cardBg} ${cardHover}`}
                      >
                        <button
                          type="button"
                          onClick={() => toggleQuestion(id)}
                          aria-expanded={isOpen}
                          className="flex w-full items-center justify-between gap-5 px-5 py-5 text-left sm:px-7"
                        >
                          <span
                            className={`text-[13px] font-medium leading-6 sm:text-[14px] ${
                              isOpen ? "text-[#FF6B35]" : headingColor
                            }`}
                          >
                            {item.question}
                          </span>

                          <span
                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-200 ${
                              isOpen
                                ? "rotate-45 bg-[#FF6B35] text-white"
                                : darkMode
                                  ? "bg-white/[0.07] text-white"
                                  : "bg-black/[0.04] text-[#171717]"
                            }`}
                          >
                            <svg
                              width="15"
                              height="15"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                            >
                              <path d="M12 5v14M5 12h14" />
                            </svg>
                          </span>
                        </button>

                        <div
                          className={`grid transition-all duration-300 ${
                            isOpen
                              ? "grid-rows-[1fr] opacity-100"
                              : "grid-rows-[0fr] opacity-0"
                          }`}
                        >
                          <div className="overflow-hidden">
                            <p
                              className={`px-5 pb-6 text-[13px] leading-8 sm:px-7 sm:text-[14px] ${
                                darkMode
                                  ? "text-[#A1A1AA]"
                                  : "text-[#85817E]"
                              }`}
                            >
                              {item.answer}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="px-5 pb-28 sm:px-8">
        <div
          className={`mx-auto max-w-[1100px] overflow-hidden rounded-[30px] border px-7 py-16 text-center sm:px-12 sm:py-20 ${
            darkMode
              ? "border-white/[0.08] bg-[#191919]"
              : "border-black/[0.05] bg-[#F1EFEC]"
          }`}
        >
          <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FF6B35]/10 text-[#FF6B35]">
            <svg
              width="23"
              height="23"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8A8.5 8.5 0 0 1 8.7 3.9a8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z" />
            </svg>
          </div>

          <h2
            className={`text-[32px] font-normal tracking-[-0.06em] sm:text-[45px] ${headingColor}`}
          >
            Still have questions?
          </h2>

          <p
            className={`mx-auto mt-5 max-w-[470px] text-[13px] leading-8 sm:text-[14px] ${mutedColor}`}
          >
            We would love to hear from you. Get in touch if you need more
            information or have feedback about WhatIf.
          </p>

          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Link
              href="/contact"
              className="rounded-full bg-[#FF6B35] px-7 py-3.5 text-[13px] font-medium text-white transition hover:bg-[#e95c2c]"
            >
              Contact Us
            </Link>

            <Link
              href="/explore"
              className={`rounded-full border px-7 py-3.5 text-[13px] font-medium transition ${
                darkMode
                  ? "border-white/15 text-white hover:bg-white/5"
                  : "border-black/10 text-[#171717] hover:bg-black/[0.03]"
              }`}
            >
              Explore WhatIf
            </Link>
          </div>
        </div>
      </section>

      {/* Dark Mode Toggle */}
      <button
        type="button"
        onClick={() => setDarkMode((current) => !current)}
        aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        title={darkMode ? "Light mode" : "Dark mode"}
        className={`fixed bottom-24 right-5 z-[120] flex h-12 w-12 items-center justify-center rounded-full border shadow-lg transition hover:scale-105 ${
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

      {/* Back To Top */}
      {showBackToTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
          title="Back to top"
          className="fixed bottom-5 right-5 z-[120] flex h-12 w-12 items-center justify-center rounded-full bg-[#FF6B35] text-white shadow-lg transition hover:scale-105 hover:bg-[#e95c2c]"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m18 15-6-6-6 6" />
          </svg>
        </button>
      )}
    </main>
  );
}
