
"use client";

import { useEffect, useMemo, useSyncExternalStore } from "react";
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
  category: DecisionCategory;
  situation: string;
  context?: string;
  goal?: string;
  constraints?: string;
};

type Decision = {
  id: number;
  title: string;
  description?: string;
  options: string[];
};

type Path = {
  id: number;
  name: string;
  description?: string;
  choices: Record<number, string | number>;
};

const categoryLabels: Record<DecisionCategory, string> = {
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

const validCategories = Object.keys(categoryLabels);

function subscribeToComparison() {
  return () => {};
}

function getComparisonSnapshot() {
  try {
    return JSON.stringify([
      sessionStorage.getItem("whatif_scenario"),
      sessionStorage.getItem("whatif_decisions"),
      sessionStorage.getItem("whatif_paths"),
    ]);
  } catch {
    return "storage-unavailable";
  }
}

function getServerComparisonSnapshot() {
  return null;
}

export default function ComparePage() {
  const router = useRouter();

  const storedData = useSyncExternalStore(
    subscribeToComparison,
    getComparisonSnapshot,
    getServerComparisonSnapshot
  );

  const comparison = useMemo(() => {
    if (!storedData || storedData === "storage-unavailable") {
      return null;
    }

    try {
      const [savedScenario, savedDecisions, savedPaths] =
        JSON.parse(storedData);

      if (!savedScenario || !savedDecisions || !savedPaths) {
        return null;
      }

      const parsedScenario = JSON.parse(savedScenario);
      const parsedDecisions = JSON.parse(savedDecisions);
      const parsedPaths = JSON.parse(savedPaths);

      if (
        !parsedScenario ||
        !parsedScenario.category ||
        !validCategories.includes(parsedScenario.category) ||
        typeof parsedScenario.situation !== "string" ||
        !Array.isArray(parsedDecisions) ||
        !Array.isArray(parsedPaths) ||
        parsedDecisions.length === 0 ||
        parsedPaths.length < 2
      ) {
        return null;
      }

      return {
        scenario: parsedScenario as Scenario,
        decisions: parsedDecisions as Decision[],
        paths: parsedPaths as Path[],
      };
    } catch {
      return null;
    }
  }, [storedData]);

  useEffect(() => {
    if (storedData !== null && !comparison) {
      router.replace("/explore");
    }
  }, [storedData, comparison, router]);

  const scenario = comparison?.scenario ?? null;
  const decisions = comparison?.decisions ?? [];
  const paths = comparison?.paths ?? [];

  function getChoice(path: Path, decisionId: number) {
    const choice = path.choices?.[decisionId];

    if (choice === undefined || choice === null || choice === "") {
      return "Not selected";
    }

    if (typeof choice === "number") {
      const decision = decisions.find((item) => item.id === decisionId);
      return decision?.options?.[choice] ?? "Not selected";
    }

    return choice;
  }

  function countDifferences(path: Path) {
    if (paths.length < 2) return 0;

    const otherPaths = paths.filter((item) => item.id !== path.id);

    return decisions.filter((decision) =>
      otherPaths.some(
        (other) =>
          String(getChoice(path, decision.id)) !==
          String(getChoice(other, decision.id))
      )
    ).length;
  }

  if (!comparison || !scenario) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F7F7F5]">
        <p className="text-sm text-black/45">
          Preparing your comparison...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F7F7F5] text-[#171717]">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-black/[0.05] bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="flex items-center gap-2.5"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FF6B35] text-xl font-bold text-white">
              W
            </span>
            <span className="text-xl font-bold tracking-tight">WhatIf</span>
          </button>

          <div className="hidden items-center gap-2 sm:flex">
            <span className="text-xs font-medium text-black/35">
              YOUR DECISION JOURNEY
            </span>
            <span className="text-black/20">/</span>
            <span className="text-xs font-bold text-[#FF6B35]">
              COMPARISON
            </span>
          </div>

          <button
            type="button"
            onClick={() => router.push("/explore/paths")}
            className="rounded-full border border-black/10 px-4 py-2.5 text-sm font-semibold transition hover:border-[#FF6B35] hover:text-[#FF6B35]"
          >
            ← <span className="hidden sm:inline">Edit paths</span>
            <span className="sm:hidden">Back</span>
          </button>
        </div>
      </nav>

      <section className="mx-auto max-w-6xl px-5 pb-24 pt-12 sm:px-8 lg:px-10 lg:pt-16">
        {/* Progress */}
        <div className="mb-12">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-black/35">
              Step 5 of 6
            </span>
            <span className="text-xs font-semibold text-[#FF6B35]">
              Compare your alternatives
            </span>
          </div>

          <div className="h-1.5 overflow-hidden rounded-full bg-black/[0.06]">
            <div className="h-full w-5/6 rounded-full bg-[#FF6B35]" />
          </div>
        </div>

        {/* Hero */}
        <div className="grid gap-10 lg:grid-cols-[1fr_280px] lg:items-end">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#FF6B35]/20 bg-[#FF6B35]/[0.06] px-3.5 py-2 text-[11px] font-bold uppercase tracking-[0.13em] text-[#FF6B35]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#FF6B35]" />
              See the differences
            </span>

            <h1 className="mt-7 text-[42px] font-semibold leading-[1.08] tracking-[-0.045em] sm:text-6xl lg:text-[68px]">
              Compare your
              <br />
              <span className="text-[#FF6B35]">possible directions.</span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-black/50 sm:text-lg">
              Look at your alternative paths together. Understand which
              choices change, where your routes differ, and what each
              direction involves.
            </p>
          </div>

          <div className="rounded-3xl bg-[#171717] p-6 text-white">
            <span className="text-[10px] font-bold uppercase tracking-[0.17em] text-white/40">
              Comparison overview
            </span>

            <div className="mt-5 grid grid-cols-2 gap-4">
              <div>
                <p className="text-4xl font-semibold tracking-tight">
                  {paths.length}
                </p>
                <p className="mt-1 text-xs text-white/45">
                  Alternative paths
                </p>
              </div>

              <div>
                <p className="text-4xl font-semibold tracking-tight">
                  {decisions.length}
                </p>
                <p className="mt-1 text-xs text-white/45">
                  Decision points
                </p>
              </div>
            </div>

            <div className="mt-6 h-px bg-white/10" />

            <p className="mt-4 text-xs leading-6 text-white/55">
              Explore the differences before examining possible outcomes.
            </p>
          </div>
        </div>

        {/* Situation */}
        <div className="mt-12 rounded-3xl border border-black/[0.06] bg-white p-6 sm:p-8">
          <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#FF6B35]">
            Your starting situation
          </span>

          <div className="mt-3">
            <span className="inline-flex rounded-full bg-[#FF6B35]/[0.08] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.1em] text-[#FF6B35]">
              {categoryLabels[scenario.category]}
            </span>
          </div>

          <h2 className="mt-4 text-lg font-semibold">
            What you are exploring
          </h2>

          <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-black/55">
            {scenario.situation}
          </p>

          {scenario.context && (
            <div className="mt-5 border-t border-black/[0.06] pt-5">
              <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-black/35">
                Additional context
              </span>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-black/55">
                {scenario.context}
              </p>
            </div>
          )}

          {scenario.goal && (
            <div className="mt-5 border-t border-black/[0.06] pt-5">
              <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-black/35">
                Your goal
              </span>
              <p className="mt-2 text-sm leading-7 text-black/55">
                {scenario.goal}
              </p>
            </div>
          )}

          {scenario.constraints && (
            <div className="mt-5 border-t border-black/[0.06] pt-5">
              <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-black/35">
                Your constraints
              </span>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-black/55">
                {scenario.constraints}
              </p>
            </div>
          )}
        </div>

        {/* Path cards */}
        <div className="mb-7 mt-14">
          <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#FF6B35]">
            Your alternatives
          </span>

          <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            Meet each possible direction
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-black/45">
            Each path represents a different combination of decisions.
            Review what you have selected before moving forward.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {paths.map((path, index) => (
            <article
              key={path.id}
              className="rounded-3xl border border-black/[0.07] bg-white p-6 sm:p-7"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="rounded-full bg-[#FF6B35]/[0.08] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.13em] text-[#FF6B35]">
                  Path {String(index + 1).padStart(2, "0")}
                </span>

                <span className="text-xs text-black/35">
                  {decisions.length} decisions
                </span>
              </div>

              <h3 className="mt-6 text-xl font-semibold tracking-tight">
                {path.name}
              </h3>

              {path.description && (
                <p className="mt-2 text-sm leading-6 text-black/45">
                  {path.description}
                </p>
              )}

              <div className="mt-6 space-y-4">
                {decisions.map((decision, decisionIndex) => (
                  <div
                    key={decision.id}
                    className="border-t border-black/[0.06] pt-4"
                  >
                    <div className="flex items-start gap-3">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#F7F7F5] text-[10px] font-bold text-black/50">
                        {decisionIndex + 1}
                      </span>

                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-black/40">
                          {decision.title}
                        </p>

                        <p className="mt-1 text-sm font-semibold leading-6 text-[#171717]">
                          {getChoice(path, decision.id)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-2xl bg-[#F7F7F5] p-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-black/35">
                  Decisions that differ from other paths
                </p>
                <p className="mt-2 text-2xl font-semibold tracking-tight">
                  {countDifferences(path)}
                  <span className="ml-2 text-xs font-medium text-black/40">
                    decision points
                  </span>
                </p>
              </div>
            </article>
          ))}
        </div>

        {/* Comparison matrix */}
        <div className="mt-14">
          <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#FF6B35]">
            Side-by-side view
          </span>

          <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            Where do your choices differ?
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-black/45">
            Review each decision across all paths in one place.
          </p>
        </div>

        <div className="mt-7 overflow-hidden rounded-3xl border border-black/[0.07] bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] border-collapse text-left">
              <thead>
                <tr className="border-b border-black/[0.07] bg-[#FAFAF9]">
                  <th className="px-5 py-5 text-xs font-bold text-black/45 sm:px-6">
                    Decision point
                  </th>

                  {paths.map((path, index) => (
                    <th
                      key={path.id}
                      className="px-5 py-5 text-xs font-bold text-[#FF6B35] sm:px-6"
                    >
                      Path {index + 1}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {decisions.map((decision, index) => {
                  const values = paths.map((path) =>
                    String(getChoice(path, decision.id))
                  );

                  const hasDifference = values.some(
                    (value) => value !== values[0]
                  );

                  return (
                    <tr
                      key={decision.id}
                      className={`border-b border-black/[0.06] last:border-0 ${
                        hasDifference ? "bg-[#FF6B35]/[0.025]" : ""
                      }`}
                    >
                      <td className="px-5 py-5 sm:px-6">
                        <div className="flex items-center gap-3">
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#F7F7F5] text-[10px] font-bold text-black/45">
                            {index + 1}
                          </span>
                          <span className="text-sm font-semibold">
                            {decision.title}
                          </span>
                        </div>
                      </td>

                      {paths.map((path) => (
                        <td
                          key={path.id}
                          className="px-5 py-5 sm:px-6"
                        >
                          <span className="text-sm leading-6 text-black/65">
                            {getChoice(path, decision.id)}
                          </span>
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="border-t border-black/[0.06] bg-[#FAFAF9] px-5 py-4 sm:px-6">
            <div className="flex flex-wrap items-center gap-2 text-xs text-black/45">
              <span className="h-2 w-2 rounded-full bg-[#FF6B35]" />
              Rows with different choices are lightly highlighted.
            </div>
          </div>
        </div>

        {/* Insight note */}
        <div className="mt-10 flex gap-4 rounded-3xl border border-[#FF6B35]/15 bg-[#FF6B35]/[0.045] p-6 sm:p-7">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FF6B35]/10 text-lg text-[#FF6B35]">
            i
          </div>

          <div>
            <h3 className="text-sm font-semibold">
              Different choices create different trade-offs.
            </h3>
            <p className="mt-2 text-sm leading-7 text-black/55">
              A path is not automatically better because it has more
              different choices. The next stage will help examine potential
              benefits, risks, assumptions, and unknowns.
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-10 flex flex-col-reverse gap-3 border-t border-black/[0.07] pt-8 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={() => router.push("/explore/paths")}
            className="rounded-full border border-black/10 bg-white px-7 py-4 text-center text-sm font-semibold transition hover:border-black/30"
          >
            ← Back to paths
          </button>

          <button
            type="button"
            onClick={() => router.push("/explore/outcomes")}
            className="rounded-full bg-[#FF6B35] px-8 py-4 text-sm font-bold text-white shadow-lg shadow-[#FF6B35]/15 transition hover:-translate-y-0.5 hover:bg-[#f45c27]"
          >
            Explore possible outcomes →
          </button>
        </div>
      </section>
    </main>
  );
}
