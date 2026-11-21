
"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import SiteHeader from "@/components/site-header";
import { usePersistentTheme } from "@/lib/use-persistent-theme";

const categories = [
  "business",
  "career",
  "education",
  "technology",
  "finance",
  "personal",
  "health",
  "relationships",
  "travel",
  "other",
] as const;

const categoryLabels: Record<string, string> = {
  business: "Business",
  career: "Career",
  education: "Education",
  technology: "Technology",
  finance: "Finance",
  personal: "Personal",
  health: "Health",
  relationships: "Relationships",
  travel: "Travel",
  other: "Other",
};

export default function ExplorePage() {
  const router = useRouter();
  const [darkMode, setDarkMode] = usePersistentTheme();

  const [category, setCategory] = useState("personal");
  const [situation, setSituation] = useState("");
  const [context, setContext] = useState("");
  const [goal, setGoal] = useState("");
  const [constraints, setConstraints] = useState("");
  const [showMore, setShowMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const colors = {
    page: darkMode ? "bg-[#111111] text-white" : "bg-[#FAFAF9] text-[#171717]",
    card: darkMode
      ? "border-white/[0.09] bg-[#191919]"
      : "border-black/[0.07] bg-white",
    muted: darkMode ? "text-white/50" : "text-black/45",
    label: darkMode ? "text-white/90" : "text-[#171717]",
    field: darkMode
      ? "border-white/[0.12] bg-[#111111] text-white placeholder:text-white/25 focus:bg-[#151515]"
      : "border-black/[0.10] bg-[#FAFAF9] text-[#171717] placeholder:text-black/30 focus:bg-white",
    secondaryCard: darkMode
      ? "border-white/[0.08] bg-[#191919]"
      : "border-black/[0.06] bg-white",
  };

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (situation.trim().length < 20) {
      setError("Please describe your situation in at least 20 characters.");
      return;
    }

    setLoading(true);

    try {
      const scenario = {
        category,
        situation: situation.trim(),
        context: context.trim(),
        goal: goal.trim(),
        constraints: constraints.trim(),
      };

      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(scenario),
      });

      const result = await response.json();

      if (!response.ok || !result.success || !result.data) {
        throw new Error(
          result.error ||
            "We couldn't generate your workflow. Please try again."
        );
      }

      sessionStorage.setItem("whatif_scenario", JSON.stringify(scenario));
      sessionStorage.setItem("whatif_graph", JSON.stringify(result.data));

      router.push("/explore/outcomes");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
      setLoading(false);
    }
  }

  return (
    <main
      className={`min-h-screen transition-colors duration-300 ${colors.page}`}
    >
      {/* Use the exact same shared header as the rest of WhatIf */}
      <SiteHeader />

      {/* Main content */}
      <section className="mx-auto max-w-5xl px-4 pb-24 pt-32 sm:px-7 sm:pt-36 lg:px-8">
        {/* Hero */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#FF6B35]/20 bg-[#FF6B35]/[0.07] px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#FF6B35]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#FF6B35]" />
            Explore your possibilities
          </span>

          <h1 className="mt-7 text-[38px] font-normal leading-[1.08] tracking-[-0.065em] sm:text-[56px] lg:text-[68px]">
            What decision are
            <br />
            <span className="text-[#FF6B35]">you thinking about?</span>
          </h1>

          <p
            className={`mx-auto mt-6 max-w-2xl text-[14px] leading-8 sm:text-[16px] ${colors.muted}`}
          >
            Describe what&apos;s happening. WhatIf will build an interactive
            decision map so you can explore different choices and where they
            could lead.
          </p>
        </div>

        {/* Decision form */}
        <form
          onSubmit={handleSubmit}
          className={`mx-auto mt-12 max-w-4xl rounded-[26px] border p-5 shadow-[0_15px_60px_rgba(0,0,0,0.035)] transition-colors sm:mt-14 sm:rounded-[30px] sm:p-9 lg:p-11 ${colors.card}`}
        >
          {/* Category */}
          <div>
            <label className={`block text-sm font-semibold ${colors.label}`}>
              What area does your decision relate to?
            </label>

            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
              {categories.map((item) => {
                const active = category === item;

                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setCategory(item)}
                    aria-pressed={active}
                    className={`min-h-11 rounded-xl border px-3 py-3 text-[12px] font-medium transition sm:text-[13px] ${
                      active
                        ? "border-[#FF6B35] bg-[#FF6B35]/[0.09] text-[#FF6B35]"
                        : darkMode
                          ? "border-white/[0.10] bg-white/[0.025] text-white/60 hover:border-white/25 hover:text-white"
                          : "border-black/[0.08] bg-white text-black/55 hover:border-black/20 hover:text-black"
                    }`}
                  >
                    {categoryLabels[item]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Situation */}
          <div className="mt-9">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label
                htmlFor="situation"
                className={`text-sm font-semibold ${colors.label}`}
              >
                Describe your situation
              </label>

              <span className={`text-[11px] tabular-nums ${colors.muted}`}>
                {situation.length}/3000
              </span>
            </div>

            <textarea
              id="situation"
              name="situation"
              value={situation}
              onChange={(event) =>
                setSituation(event.target.value.slice(0, 3000))
              }
              required
              minLength={20}
              maxLength={3000}
              rows={6}
              placeholder="For example: I'm currently studying at university, but I'm thinking about leaving my studies to focus on starting my own business. I want to understand what could happen with either choice..."
              className={`mt-3 min-h-[150px] w-full resize-y rounded-2xl border px-4 py-4 text-[13px] leading-7 outline-none transition focus:border-[#FF6B35] sm:px-5 ${colors.field}`}
            />

            <p className={`mt-2 text-[11px] leading-6 ${colors.muted}`}>
              Include your current situation, the decision you&apos;re facing,
              and anything important you think WhatIf should understand.
            </p>
          </div>

          {/* Additional information */}
          <div className="mt-8">
            <button
              type="button"
              onClick={() => setShowMore((current) => !current)}
              aria-expanded={showMore}
              className="flex min-h-11 items-center gap-2 rounded-lg text-[13px] font-semibold text-[#FF6B35] transition hover:opacity-75"
            >
              <span className="text-lg" aria-hidden="true">
                {showMore ? "−" : "+"}
              </span>
              {showMore
                ? "Hide additional context"
                : "Add more context (optional)"}
            </button>

            {showMore && (
              <div className="mt-5 space-y-5">
                <div>
                  <label
                    htmlFor="context"
                    className={`text-sm font-semibold ${colors.label}`}
                  >
                    Additional context
                  </label>

                  <textarea
                    id="context"
                    name="context"
                    value={context}
                    onChange={(event) =>
                      setContext(event.target.value.slice(0, 2000))
                    }
                    rows={3}
                    maxLength={2000}
                    placeholder="Tell us anything else that could help explain your situation."
                    className={`mt-2 min-h-[90px] w-full resize-y rounded-xl border px-4 py-3 text-[13px] leading-6 outline-none transition focus:border-[#FF6B35] ${colors.field}`}
                  />
                </div>

                <div>
                  <label
                    htmlFor="goal"
                    className={`text-sm font-semibold ${colors.label}`}
                  >
                    What would you like to achieve?
                  </label>

                  <textarea
                    id="goal"
                    name="goal"
                    value={goal}
                    onChange={(event) =>
                      setGoal(event.target.value.slice(0, 1000))
                    }
                    rows={2}
                    maxLength={1000}
                    placeholder="Describe what matters most to you."
                    className={`mt-2 min-h-[75px] w-full resize-y rounded-xl border px-4 py-3 text-[13px] leading-6 outline-none transition focus:border-[#FF6B35] ${colors.field}`}
                  />
                </div>

                <div>
                  <label
                    htmlFor="constraints"
                    className={`text-sm font-semibold ${colors.label}`}
                  >
                    Important limitations
                  </label>

                  <textarea
                    id="constraints"
                    name="constraints"
                    value={constraints}
                    onChange={(event) =>
                      setConstraints(event.target.value.slice(0, 1500))
                    }
                    rows={2}
                    maxLength={1500}
                    placeholder="For example: limited budget, family responsibilities, deadlines, or available time."
                    className={`mt-2 min-h-[75px] w-full resize-y rounded-xl border px-4 py-3 text-[13px] leading-6 outline-none transition focus:border-[#FF6B35] ${colors.field}`}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Error */}
          {error && (
            <div
              className="mt-6 rounded-xl border border-red-500/25 bg-red-500/[0.08] px-4 py-3 text-[13px] leading-6 text-red-500"
              role="alert"
            >
              {error}
            </div>
          )}

          {/* Loading state */}
          {loading && (
            <div
              className={`mt-7 rounded-2xl border p-5 sm:p-6 ${colors.secondaryCard}`}
              role="status"
              aria-live="polite"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#FF6B35]">
                    Preparing your exploration
                  </p>
                  <p className={`mt-2 text-sm font-semibold ${colors.label}`}>
                    Building your decision map...
                  </p>
                </div>

                <span className="h-5 w-5 shrink-0 animate-spin rounded-full border-2 border-[#FF6B35]/20 border-t-[#FF6B35]" />
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {[0, 1, 2].map((item) => (
                  <div
                    key={item}
                    className={`rounded-xl border p-4 ${
                      darkMode
                        ? "border-white/[0.08] bg-white/[0.025]"
                        : "border-black/[0.06] bg-black/[0.015]"
                    }`}
                  >
                    <div className="h-2.5 w-16 animate-pulse rounded-full bg-[#FF6B35]/20" />
                    <div className="mt-4 h-3 w-4/5 animate-pulse rounded-full bg-current opacity-10" />
                    <div className="mt-2 h-3 w-full animate-pulse rounded-full bg-current opacity-10" />
                    <div className="mt-2 h-3 w-2/3 animate-pulse rounded-full bg-current opacity-10" />
                  </div>
                ))}
              </div>

              <p className={`mt-4 text-[11px] ${colors.muted}`}>
                This can take a little while. Please keep this page open.
              </p>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="mt-8 flex min-h-[54px] w-full items-center justify-center gap-3 rounded-full bg-[#FF6B35] px-6 py-4 text-[13px] font-semibold text-white shadow-lg shadow-[#FF6B35]/15 transition hover:-translate-y-0.5 hover:bg-[#ed5d2b] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 sm:mt-9"
          >
            {loading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/35 border-t-white" />
                Building your decision map...
              </>
            ) : (
              <>
                Generate my decision map <span aria-hidden="true">→</span>
              </>
            )}
          </button>

          <p className={`mt-4 text-center text-[11px] leading-6 ${colors.muted}`}>
            WhatIf explores possible scenarios. It does not predict or
            guarantee what will happen.
          </p>
        </form>

        {/* Three steps */}
        <div className="mt-9 grid gap-3 sm:grid-cols-3 sm:gap-4">
          {[
            ["01", "Describe", "Explain the decision you&apos;re facing."],
            ["02", "Generate", "AI creates connected decision branches."],
            ["03", "Explore", "Follow paths and examine possible outcomes."],
          ].map(([number, title, description]) => (
            <div
              key={number}
              className={`rounded-2xl border p-5 sm:p-6 ${colors.secondaryCard}`}
            >
              <span className="text-[11px] font-bold text-[#FF6B35]">
                {number}
              </span>
              <h2 className={`mt-3 text-sm font-semibold ${colors.label}`}>
                {title}
              </h2>
              <p className={`mt-2 text-[12px] leading-6 ${colors.muted}`}>
                {description}
              </p>
            </div>
          ))}
        </div>

        {/* Trust note */}
        <p className={`mx-auto mt-10 max-w-xl text-center text-[11px] leading-6 ${colors.muted}`}>
          You remain in control of every decision. WhatIf is a tool for
          exploring possibilities, comparing alternatives, and thinking
          through potential consequences.
        </p>
      </section>

      {/* Persistent theme toggle */}
      <button
        type="button"
        onClick={() => setDarkMode(!darkMode)}
        aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        className={`fixed bottom-5 right-5 z-[120] flex h-12 w-12 items-center justify-center rounded-full border shadow-lg transition hover:scale-105 ${
          darkMode
            ? "border-white/10 bg-[#242424] text-white"
            : "border-black/[0.07] bg-white text-[#171717]"
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
