
"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type DecisionCategory =
  | "business"
  | "career"
  | "education"
  | "technology"
  | "finance"
  | "personal"
  | "health"
  | "relationships"
  | "travel"
  | "other";

type Scenario = {
  category: DecisionCategory | "";
  situation: string;
  context: string;
  goal: string;
  constraints: string;
};

const categoryLabels: Record<DecisionCategory, string> = {
  business: "Business",
  career: "Career",
  education: "Education",
  technology: "Technology",
  finance: "Finance",
  personal: "Personal decisions",
  health: "Health",
  relationships: "Relationships",
  travel: "Travel",
  other: "Other",
};

const MISSING_SCENARIO = "__WHATIF_SCENARIO_MISSING__";

function subscribeToScenarioStorage() {
  return () => {};
}

function getScenarioSnapshot() {
  try {
    return sessionStorage.getItem("whatif_scenario") ?? MISSING_SCENARIO;
  } catch {
    return MISSING_SCENARIO;
  }
}

function getServerScenarioSnapshot() {
  return null;
}

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FF6B35] text-lg font-bold text-white">
        W
      </span>
      <span className="text-[21px] font-bold tracking-[-0.06em] text-[#171717]">
        WhatIf<span className="text-[#FF6B35]">.</span>
      </span>
    </Link>
  );
}

function Arrow({ back = false }: { back?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {back ? (
        <path d="m15 18-6-6 6-6M9 12h10" />
      ) : (
        <path d="M5 12h14m-7-7 7 7-7 7" />
      )}
    </svg>
  );
}

export default function ReviewPage() {
  const router = useRouter();

  const savedScenario = useSyncExternalStore(
    subscribeToScenarioStorage,
    getScenarioSnapshot,
    getServerScenarioSnapshot
  );

  const [error, setError] = useState("");

  const scenarioResult = useMemo(() => {
    if (savedScenario === null) {
      return null;
    }

    if (savedScenario === MISSING_SCENARIO) {
      return {
        scenario: null,
        error: "No situation was found. Please describe your situation first.",
      };
    }

    try {
      const parsed: unknown = JSON.parse(savedScenario);

      if (typeof parsed === "string") {
        return {
          scenario: {
            category: "",
            situation: parsed,
            context: "",
            goal: "",
            constraints: "",
          } satisfies Scenario,
          error: "",
        };
      }

      if (typeof parsed === "object" && parsed !== null) {
        const data = parsed as Record<string, unknown>;

        const category =
          typeof data.category === "string" &&
          Object.prototype.hasOwnProperty.call(categoryLabels, data.category)
            ? (data.category as DecisionCategory)
            : "";

        return {
          scenario: {
            category,
            situation:
              typeof data.situation === "string" ? data.situation : "",
            context: typeof data.context === "string" ? data.context : "",
            goal: typeof data.goal === "string" ? data.goal : "",
            constraints:
              typeof data.constraints === "string" ? data.constraints : "",
          } satisfies Scenario,
          error: "",
        };
      }

      return {
        scenario: {
          category: "",
          situation: "",
          context: "",
          goal: "",
          constraints: "",
        } satisfies Scenario,
        error: "Your saved situation could not be read. Please go back and try again.",
      };
    } catch {
      return {
        scenario: {
          category: "",
          situation: savedScenario,
          context: "",
          goal: "",
          constraints: "",
        } satisfies Scenario,
        error: "",
      };
    }
  }, [savedScenario]);

  const scenario = scenarioResult?.scenario ?? null;
  const pageError = error || scenarioResult?.error || "";

  function handleContinue() {
    if (!scenario) {
      setError("No situation was found. Please go back and describe it first.");
      return;
    }

    if (!scenario.category) {
      setError("Your decision category is missing. Please go back and select it.");
      return;
    }

    if (!scenario.situation.trim()) {
      setError("Your situation is missing. Please go back and add it.");
      return;
    }

    try {
      sessionStorage.setItem("whatif_scenario", JSON.stringify(scenario));
      router.push("/explore/decisions");
    } catch {
      setError("Your situation could not be saved. Please try again.");
    }
  }

  const details = scenario
    ? [
        {
          number: "03",
          label: "Additional context",
          value: scenario.context,
        },
        {
          number: "04",
          label: "Desired outcome",
          value: scenario.goal,
        },
        {
          number: "05",
          label: "Limitations and constraints",
          value: scenario.constraints,
        },
      ]
    : [];

  return (
    <main className="min-h-screen bg-white text-[#171717]">
      {/* Navigation */}
      <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4">
        <nav className="mx-auto flex max-w-[940px] items-center justify-between rounded-[22px] border border-black/[0.065] bg-white/90 p-2 shadow-[0_8px_35px_rgba(0,0,0,0.075)] backdrop-blur-2xl sm:px-4">
          <div className="pl-1 sm:pl-2">
            <Logo />
          </div>

          <div className="hidden items-center gap-2 rounded-full bg-[#F2F2F2] px-4 py-2.5 sm:flex">
            <span className="h-2 w-2 rounded-full bg-[#FF6B35]" />
            <span className="text-[12px] font-semibold text-[#555]">
              Review your situation
            </span>
          </div>

          <Link
            href="/explore"
            className="flex items-center gap-2 rounded-[15px] border border-black/10 px-4 py-3 text-[12px] font-semibold text-[#555] transition hover:border-[#FF6B35] hover:text-[#FF6B35]"
          >
            <Arrow back />
            <span className="hidden sm:inline">Edit details</span>
            <span className="sm:hidden">Edit</span>
          </Link>
        </nav>
      </header>

      <section className="px-5 pb-24 pt-36 sm:px-7 sm:pt-40 lg:px-10 lg:pt-44">
        <div className="mx-auto max-w-[1050px]">
          {/* Heading */}
          <div className="max-w-[750px]">
            <p className="mb-5 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.19em] text-[#888] sm:text-[11px]">
              <span className="h-2 w-2 rounded-full bg-[#FF6B35]" />
              Step 2 — Review
            </p>

            <h1 className="text-[clamp(3rem,7vw,6rem)] font-normal leading-[0.95] tracking-[-0.085em]">
              Let&apos;s make sure
              <br />
              we&apos;ve got it <span className="text-[#92908E]">right.</span>
            </h1>

            <p className="mt-6 max-w-[570px] text-[15px] leading-8 text-[#777] sm:text-[17px]">
              Take a moment to review your situation. Make sure the
              information reflects what you really want to explore before
              moving forward.
            </p>
          </div>

          {/* Progress */}
          <div className="mt-12 rounded-full bg-[#F1F1EF] p-1">
            <div className="flex h-2 overflow-hidden rounded-full">
              <div className="w-1/4 rounded-full bg-[#FF6B35]" />
              <div className="w-1/4 rounded-full bg-[#FF6B35]" />
              <div className="w-1/2" />
            </div>
          </div>

          <div className="mt-3 flex justify-between text-[10px] font-medium text-[#999]">
            <span>Situation review</span>
            <span>Step 2 of 4</span>
          </div>

          {savedScenario === null ? (
            <div className="mt-12 rounded-[28px] border border-black/[0.07] p-10 text-center">
              <p className="text-sm text-[#888]">
                Loading your situation...
              </p>
            </div>
          ) : pageError || !scenario ? (
            <div className="mt-12 rounded-[25px] border border-red-200 bg-red-50 p-7">
              <p className="text-sm leading-6 text-red-600">
                {pageError || "Your situation could not be loaded."}
              </p>
              <Link
                href="/explore"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#FF6B35] px-5 py-3 text-xs font-semibold text-white"
              >
                Go back to Explore
                <Arrow />
              </Link>
            </div>
          ) : (
            <>
              {/* Situation card */}
              <div className="mt-10 overflow-hidden rounded-[28px] border border-black/[0.07] bg-white shadow-[0_15px_65px_rgba(0,0,0,0.045)]">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/[0.07] p-6 sm:px-9 sm:py-7">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-[#FF6B35]">
                      Your decision
                    </p>
                    <h2 className="mt-2 text-[23px] font-medium tracking-[-0.05em]">
                      Situation overview
                    </h2>
                  </div>

                  <span className="rounded-full bg-[#F0F7F0] px-3.5 py-2 text-[10px] font-semibold text-[#477A50]">
                    Ready for review
                  </span>
                </div>

                <div className="p-6 sm:p-9">
                  {/* Category */}
                  <div className="mb-8">
                    <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.15em] text-[#999]">
                      01. Decision category
                    </p>

                    <div className="inline-flex items-center gap-2 rounded-full bg-[#FFF0E9] px-4 py-2.5">
                      <span className="h-2 w-2 rounded-full bg-[#FF6B35]" />
                      <span className="text-[12px] font-semibold text-[#D9572D]">
                        {scenario.category
                          ? categoryLabels[scenario.category]
                          : "Category not selected"}
                      </span>
                    </div>
                  </div>

                  {/* Situation */}
                  <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.15em] text-[#999]">
                    02. Your situation
                  </p>

                  <div className="rounded-[19px] bg-[#F7F7F5] p-5 sm:p-7">
                    <p className="whitespace-pre-wrap text-[15px] leading-8 text-[#333] sm:text-[16px]">
                      {scenario.situation}
                    </p>
                  </div>

                  <div className="mt-9 grid gap-7 sm:grid-cols-2">
                    {details.map((item) => (
                      <div key={item.number}>
                        <div className="mb-3 flex items-center gap-2">
                          <span className="text-[10px] font-bold text-[#FF6B35]">
                            {item.number}.
                          </span>
                          <h3 className="text-[12px] font-semibold text-[#333]">
                            {item.label}
                          </h3>
                        </div>

                        <div className="min-h-[105px] rounded-[17px] border border-black/[0.07] bg-white p-4">
                          <p className="whitespace-pre-wrap text-[12px] leading-6 text-[#777]">
                            {item.value || "No additional information provided."}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Guidance */}
              <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_300px]">
                <div className="rounded-[25px] bg-[#F5F5F4] p-6 sm:p-8">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#FF6B35]">
                    ✳
                  </span>

                  <h3 className="mt-5 text-[22px] font-medium tracking-[-0.05em]">
                    Does everything look right?
                  </h3>

                  <p className="mt-3 max-w-[570px] text-[12px] leading-7 text-[#777]">
                    Your next step is to identify the actual decisions and
                    available options. Clear information now helps make
                    the later comparison more useful.
                  </p>
                </div>

                <div className="rounded-[25px] bg-[#FF713B] p-6 text-white sm:p-7">
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/70">
                    Coming next
                  </p>

                  <h3 className="mt-5 text-[26px] font-medium leading-tight tracking-[-0.055em]">
                    Explore your possible choices.
                  </h3>

                  <p className="mt-3 text-[11px] leading-6 text-white/80">
                    Organize the decision points and alternatives you
                    want to consider.
                  </p>

                  <div className="mt-6 flex items-center gap-2 text-[11px] font-semibold">
                    Step 3
                    <Arrow />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-9 flex flex-col-reverse gap-3 border-t border-black/[0.07] pt-7 sm:flex-row sm:items-center sm:justify-between">
                <Link
                  href="/explore"
                  className="inline-flex items-center justify-center gap-2 rounded-[15px] border border-black/10 px-6 py-4 text-[12px] font-semibold text-[#555] transition hover:border-[#FF6B35] hover:text-[#FF6B35]"
                >
                  <Arrow back />
                  Edit my information
                </Link>

                <button
                  onClick={handleContinue}
                  className="group inline-flex items-center justify-center gap-3 rounded-[15px] bg-[#FF6B35] px-7 py-4 text-[12px] font-semibold text-white shadow-[0_7px_18px_rgba(255,107,53,0.22)] transition hover:-translate-y-0.5 hover:bg-[#ed5d2b]"
                >
                  Continue to decisions
                  <span className="transition group-hover:translate-x-1">
                    <Arrow />
                  </span>
                </button>
              </div>
            </>
          )}

          <p className="mt-12 text-center text-[10px] text-[#AAA]">
            WhatIf — Explore What Could Be.
          </p>
        </div>
      </section>
    </main>
  );
}
