
"use client";

import {
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
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

type Decision = {
  id: number;
  title: string;
  description: string;
  options: string[];
};

const initialDecisions: Decision[] = [
  {
    id: 1,
    title: "",
    description: "",
    options: ["Option A", "Option B"],
  },
];

type SavedPageData = {
  scenario: Scenario;
  decisions: Decision[];
};

function isDecision(value: unknown): value is Decision {
  if (!value || typeof value !== "object") return false;

  const candidate = value as Partial<Decision>;
  return (
    typeof candidate.id === "number" &&
    typeof candidate.title === "string" &&
    typeof candidate.description === "string" &&
    Array.isArray(candidate.options) &&
    candidate.options.length >= 2 &&
    candidate.options.length <= 6 &&
    candidate.options.every((option) => typeof option === "string")
  );
}

function subscribeToSavedData() {
  return () => {};
}

function getSavedDataSnapshot(): string | null {
  try {
    const scenario = sessionStorage.getItem("whatif_scenario");
    const decisions = sessionStorage.getItem("whatif_decisions");

    if (!scenario) {
      return "missing";
    }

    return JSON.stringify({ scenario, decisions });
  } catch {
    return "invalid";
  }
}

function getServerSavedDataSnapshot(): string | null {
  return null;
}

function parseSavedData(snapshot: string | null): SavedPageData | null {
  if (!snapshot || snapshot === "missing" || snapshot === "invalid") {
    return null;
  }

  try {
    const saved = JSON.parse(snapshot) as {
      scenario?: string;
      decisions?: string | null;
    };

    if (!saved.scenario) {
      return null;
    }

    const parsed = JSON.parse(saved.scenario);

    if (!parsed || typeof parsed.situation !== "string") {
      return null;
    }

    const category = Object.prototype.hasOwnProperty.call(
      categoryLabels,
      parsed.category
    )
      ? (parsed.category as DecisionCategory)
      : "";

    const scenario: Scenario = {
      category,
      situation: parsed.situation,
      context:
        typeof parsed.context === "string" ? parsed.context : "",
      goal: typeof parsed.goal === "string" ? parsed.goal : "",
      constraints:
        typeof parsed.constraints === "string"
          ? parsed.constraints
          : "",
    };

    let decisions = initialDecisions;

    if (saved.decisions) {
      const parsedDecisions = JSON.parse(saved.decisions);

      if (
        Array.isArray(parsedDecisions) &&
        parsedDecisions.length > 0 &&
        parsedDecisions.length <= 20 &&
        parsedDecisions.every(isDecision)
      ) {
        decisions = parsedDecisions;
      }
    }

    return { scenario, decisions };
  } catch {
    return null;
  }
}

function Logo() {
  return (
    <Link href="/" className="flex shrink-0 items-center gap-2.5">
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

export default function DecisionsPage() {
  const router = useRouter();

  const snapshot = useSyncExternalStore(
    subscribeToSavedData,
    getSavedDataSnapshot,
    getServerSavedDataSnapshot
  );

  const savedData = useMemo(
    () => parseSavedData(snapshot),
    [snapshot]
  );

  useEffect(() => {
    if (snapshot !== null && !savedData) {
      router.replace("/explore");
    }
  }, [snapshot, savedData, router]);

  if (snapshot === null || !savedData) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white">
        <p className="text-sm text-[#888]">
          Loading your decisions...
        </p>
      </main>
    );
  }

  return (
    <DecisionEditor
      scenario={savedData.scenario}
      initialSavedDecisions={savedData.decisions}
    />
  );
}

function DecisionEditor({
  scenario,
  initialSavedDecisions,
}: {
  scenario: Scenario;
  initialSavedDecisions: Decision[];
}) {
  const router = useRouter();

  const [decisions, setDecisions] = useState<Decision[]>(
    initialSavedDecisions
  );
  const [error, setError] = useState("");

  function updateDecision(
    id: number,
    field: "title" | "description",
    value: string
  ) {
    setDecisions((current) =>
      current.map((decision) =>
        decision.id === id ? { ...decision, [field]: value } : decision
      )
    );
  }

  function updateOption(
    decisionId: number,
    optionIndex: number,
    value: string
  ) {
    setDecisions((current) =>
      current.map((decision) => {
        if (decision.id !== decisionId) return decision;

        const options = [...decision.options];
        options[optionIndex] = value;

        return { ...decision, options };
      })
    );
  }

  function addOption(decisionId: number) {
    setDecisions((current) =>
      current.map((decision) => {
        if (decision.id !== decisionId || decision.options.length >= 6) {
          return decision;
        }

        return {
          ...decision,
          options: [
            ...decision.options,
            `Option ${String.fromCharCode(65 + decision.options.length)}`,
          ],
        };
      })
    );
  }

  function removeOption(decisionId: number, optionIndex: number) {
    setDecisions((current) =>
      current.map((decision) =>
        decision.id === decisionId && decision.options.length > 2
          ? {
              ...decision,
              options: decision.options.filter(
                (_, index) => index !== optionIndex
              ),
            }
          : decision
      )
    );
  }

  function addDecision() {
    if (decisions.length >= 20) return;

    const nextId = Math.max(0, ...decisions.map((item) => item.id)) + 1;

    const newDecision: Decision = {
      id: nextId,
      title: "",
      description: "",
      options: ["Option A", "Option B"],
    };

    setDecisions((current) => [...current, newDecision]);
  }

  function removeDecision(id: number) {
    if (decisions.length <= 1) return;

    setDecisions((current) =>
      current.filter((decision) => decision.id !== id)
    );
  }

  function handleContinue() {
    if (!scenario.category) {
      setError(
        "Your decision category is missing. Please return to Explore and select it."
      );
      return;
    }

    const incomplete = decisions.some(
      (decision) =>
        !decision.title.trim() ||
        decision.options.length < 2 ||
        decision.options.some((option) => !option.trim())
    );

    if (incomplete) {
      setError(
        "Please complete every decision title and option before continuing."
      );
      return;
    }

    setError("");
    sessionStorage.setItem("whatif_decisions", JSON.stringify(decisions));
    router.push("/explore/paths");
  }

  return (
    <main className="min-h-screen overflow-hidden bg-white text-[#171717]">
      {/* Navigation */}
      <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4">
        <nav className="mx-auto flex max-w-[940px] items-center justify-between gap-3 rounded-[22px] border border-black/[0.065] bg-white/90 p-2 shadow-[0_8px_35px_rgba(0,0,0,0.075)] backdrop-blur-2xl sm:px-4">
          <div className="pl-1 sm:pl-2">
            <Logo />
          </div>

          <div className="hidden items-center gap-2 rounded-full bg-[#F2F2F2] px-4 py-2.5 sm:flex">
            <span className="h-2 w-2 rounded-full bg-[#FF6B35]" />
            <span className="text-[12px] font-semibold text-[#555]">
              Decision builder
            </span>
          </div>

          <Link
            href="/explore/review"
            className="flex shrink-0 items-center gap-2 rounded-[15px] border border-black/10 px-3.5 py-3 text-[12px] font-semibold text-[#555] transition hover:border-[#FF6B35] hover:text-[#FF6B35] sm:px-5"
          >
            <Arrow back />
            <span className="hidden sm:inline">Back to review</span>
            <span className="sm:hidden">Back</span>
          </Link>
        </nav>
      </header>

      <section className="px-5 pb-24 pt-36 sm:px-7 sm:pt-40 lg:px-10 lg:pt-44">
        <div className="mx-auto max-w-[1100px]">
          {/* Page introduction */}
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-16">
            <div>
              <p className="mb-5 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.19em] text-[#888] sm:text-[11px]">
                <span className="h-2 w-2 rounded-full bg-[#FF6B35]" />
                Step 3 — Identify your choices
              </p>

              <h1 className="text-[clamp(3rem,7vw,6rem)] font-normal leading-[0.95] tracking-[-0.085em]">
                Every choice
                <br />
                creates a{" "}
                <span className="text-[#92908E]">new path.</span>
              </h1>
            </div>

            <div className="max-w-[440px] pb-2 lg:justify-self-end">
              <p className="text-[15px] leading-8 text-[#777] sm:text-[17px]">
                Break your situation into important decisions. Identify
                the realistic choices available at each step so WhatIf
                can help you explore different directions.
              </p>
            </div>
          </div>

          {/* Progress */}
          <div className="mt-12">
            <div className="flex h-[5px] overflow-hidden rounded-full bg-[#F0F0EE]">
              <div className="w-3/4 rounded-full bg-[#FF6B35]" />
            </div>

            <div className="mt-3 flex justify-between text-[10px] font-medium text-[#999]">
              <span>Building your decision map</span>
              <span>Step 3 of 4</span>
            </div>
          </div>

          {/* Situation summary */}
          <div className="mt-10 rounded-[23px] border border-black/[0.07] bg-[#F7F7F5] p-6 sm:p-8">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#FF6B35]" />
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#999]">
                Your starting situation
              </p>
            </div>

            <div className="mt-4">
              <span className="inline-flex items-center rounded-full bg-[#FFF0E9] px-3.5 py-2 text-[10px] font-semibold text-[#D9572D]">
                {scenario.category
                  ? categoryLabels[scenario.category]
                  : "Category not selected"}
              </span>
            </div>

            <p className="mt-4 max-w-[850px] text-[14px] leading-7 text-[#555] sm:text-[15px]">
              {scenario.situation}
            </p>

            {scenario.goal && (
              <div className="mt-5 border-t border-black/[0.07] pt-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#999]">
                  Your desired outcome
                </p>
                <p className="mt-2 text-[12px] leading-6 text-[#777]">
                  {scenario.goal}
                </p>
              </div>
            )}
          </div>

          {/* Decision heading */}
          <div className="mt-14 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#FF6B35]">
                Map your options
              </p>
              <h2 className="mt-2 text-[28px] font-medium tracking-[-0.06em] sm:text-[34px]">
                Your decision points.
              </h2>
              <p className="mt-2 text-[12px] leading-6 text-[#888]">
                Add up to 20 decisions, each with 2–6 available choices.
              </p>
            </div>

            <span className="w-fit rounded-full bg-[#FFF0E9] px-4 py-2.5 text-[11px] font-semibold text-[#E95F30]">
              {decisions.length} / 20 decisions
            </span>
          </div>

          {/* Decision cards */}
          <div className="mt-7 space-y-5">
            {decisions.map((decision, index) => (
              <div
                key={decision.id}
                className="overflow-hidden rounded-[25px] border border-black/[0.07] bg-white shadow-[0_12px_45px_rgba(0,0,0,0.035)]"
              >
                {/* Card header */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/[0.07] px-5 py-5 sm:px-7">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-[13px] bg-[#FF6B35] text-[12px] font-bold text-white">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <div>
                      <h3 className="text-[14px] font-semibold">
                        Decision point {index + 1}
                      </h3>
                      <p className="mt-1 text-[10px] text-[#999]">
                        Define a choice in your situation
                      </p>
                    </div>
                  </div>

                  {decisions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeDecision(decision.id)}
                      className="rounded-full px-3 py-2 text-[11px] font-semibold text-[#999] transition hover:bg-red-50 hover:text-red-500"
                    >
                      Remove decision ×
                    </button>
                  )}
                </div>

                <div className="p-5 sm:p-7">
                  {/* Decision title */}
                  <div className="mb-6">
                    <label
                      htmlFor={`decision-title-${decision.id}`}
                      className="mb-3 block text-[12px] font-semibold"
                    >
                      What is this decision about?
                      <span className="ml-1 text-[#FF6B35]">*</span>
                    </label>

                    <input
                      id={`decision-title-${decision.id}`}
                      value={decision.title}
                      onChange={(e) => {
                        updateDecision(decision.id, "title", e.target.value);
                        setError("");
                      }}
                      placeholder="Example: Should I leave my job?"
                      maxLength={180}
                      className="w-full rounded-[15px] border border-black/[0.09] bg-[#FAFAF9] px-4 py-4 text-[13px] outline-none transition placeholder:text-[#AAA] focus:border-[#FF6B35] focus:bg-white focus:ring-4 focus:ring-[#FF6B35]/[0.08]"
                    />
                  </div>

                  {/* Description */}
                  <div className="mb-8">
                    <label
                      htmlFor={`decision-description-${decision.id}`}
                      className="mb-3 block text-[12px] font-semibold"
                    >
                      Add some details
                      <span className="ml-2 font-normal text-[#AAA]">
                        Optional
                      </span>
                    </label>

                    <textarea
                      id={`decision-description-${decision.id}`}
                      value={decision.description}
                      onChange={(e) =>
                        updateDecision(
                          decision.id,
                          "description",
                          e.target.value
                        )
                      }
                      placeholder="Why is this decision important? What factors should be considered?"
                      rows={3}
                      maxLength={1000}
                      className="w-full resize-y rounded-[15px] border border-black/[0.09] bg-[#FAFAF9] px-4 py-4 text-[13px] leading-7 outline-none transition placeholder:text-[#AAA] focus:border-[#FF6B35] focus:bg-white focus:ring-4 focus:ring-[#FF6B35]/[0.08]"
                    />
                  </div>

                  {/* Options heading */}
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-t border-black/[0.07] pt-7">
                    <div>
                      <h4 className="text-[12px] font-semibold">
                        What choices are available?
                      </h4>
                      <p className="mt-1 text-[10px] text-[#999]">
                        Add realistic alternatives for this decision.
                      </p>
                    </div>

                    <span className="rounded-full bg-[#F5F5F4] px-3 py-1.5 text-[10px] font-semibold text-[#777]">
                      {decision.options.length} / 6 choices
                    </span>
                  </div>

                  {/* Options */}
                  <div className="space-y-3">
                    {decision.options.map((option, optionIndex) => (
                      <div
                        key={optionIndex}
                        className="flex items-center gap-3"
                      >
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[13px] bg-[#FFF0E9] text-[11px] font-bold text-[#FF6B35]">
                          {String.fromCharCode(65 + optionIndex)}
                        </span>

                        <input
                          value={option}
                          onChange={(e) => {
                            updateOption(
                              decision.id,
                              optionIndex,
                              e.target.value
                            );
                            setError("");
                          }}
                          placeholder={`Enter choice ${optionIndex + 1}`}
                          maxLength={180}
                          className="min-w-0 flex-1 rounded-[14px] border border-black/[0.09] bg-[#FAFAF9] px-4 py-3.5 text-[12px] outline-none transition placeholder:text-[#AAA] focus:border-[#FF6B35] focus:bg-white"
                        />

                        {decision.options.length > 2 && (
                          <button
                            type="button"
                            onClick={() =>
                              removeOption(decision.id, optionIndex)
                            }
                            aria-label={`Remove choice ${optionIndex + 1}`}
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[19px] text-[#AAA] transition hover:bg-red-50 hover:text-red-500"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {decision.options.length < 6 && (
                    <button
                      type="button"
                      onClick={() => addOption(decision.id)}
                      className="mt-5 inline-flex items-center gap-2 text-[11px] font-semibold text-[#FF6B35] transition hover:text-[#E95420]"
                    >
                      <span className="text-[17px]">+</span>
                      Add another choice
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Add decision */}
          <button
            type="button"
            onClick={addDecision}
            disabled={decisions.length >= 20}
            className="mt-6 flex w-full items-center justify-center gap-3 rounded-[21px] border border-dashed border-black/20 bg-[#FAFAF9] px-6 py-7 text-[12px] font-semibold text-[#777] transition hover:border-[#FF6B35] hover:bg-[#FFF8F4] hover:text-[#FF6B35] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <span className="text-[21px] font-normal">+</span>
            Add another decision point
          </button>

          {/* Helpful guidance */}
          <div className="mt-8 grid gap-5 lg:grid-cols-[1fr_300px]">
            <div className="rounded-[24px] bg-[#F5F5F4] p-6 sm:p-8">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#FF6B35]">
                ✳
              </span>

              <h3 className="mt-5 text-[21px] font-medium tracking-[-0.05em]">
                Think beyond the obvious.
              </h3>

              <p className="mt-3 max-w-[620px] text-[12px] leading-7 text-[#777]">
                Consider realistic alternatives, including doing nothing,
                delaying a decision, or exploring a completely different
                direction. You don&apos;t need to know which option is best yet.
                The purpose is to understand what is actually available.
              </p>
            </div>

            <div className="rounded-[24px] bg-[#FF713B] p-6 text-white">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/70">
                Coming next
              </p>

              <h3 className="mt-5 text-[25px] font-medium leading-tight tracking-[-0.055em]">
                Build your alternative paths.
              </h3>

              <p className="mt-3 text-[11px] leading-6 text-white/80">
                Explore how different choices can lead to different
                possibilities.
              </p>
            </div>
          </div>

          {/* Validation error */}
          {error && (
            <div
              role="alert"
              className="mt-6 rounded-[15px] border border-red-200 bg-red-50 px-5 py-4 text-[12px] leading-6 text-red-600"
            >
              {error}
            </div>
          )}

          {/* Navigation actions */}
          <div className="mt-9 flex flex-col-reverse gap-3 border-t border-black/[0.07] pt-7 sm:flex-row sm:items-center sm:justify-between">
            <Link
              href="/explore/review"
              className="inline-flex items-center justify-center gap-2 rounded-[15px] border border-black/10 px-6 py-4 text-[12px] font-semibold text-[#555] transition hover:border-[#FF6B35] hover:text-[#FF6B35]"
            >
              <Arrow back />
              Back to review
            </Link>

            <button
              type="button"
              onClick={handleContinue}
              className="group inline-flex items-center justify-center gap-3 rounded-[15px] bg-[#FF6B35] px-7 py-4 text-[12px] font-semibold text-white shadow-[0_7px_18px_rgba(255,107,53,0.22)] transition hover:-translate-y-0.5 hover:bg-[#ed5d2b]"
            >
              Continue to explore paths
              <span className="transition group-hover:translate-x-1">
                <Arrow />
              </span>
            </button>
          </div>

          <p className="mt-10 text-center text-[10px] text-[#AAA]">
            WhatIf — Explore What Could Be.
          </p>
        </div>
      </section>
    </main>
  );
}
