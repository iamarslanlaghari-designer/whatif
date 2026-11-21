
"use client";

import { useEffect, useState, useMemo, useSyncExternalStore } from "react";
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

type Decision = {
  id: number;
  title: string;
  description: string;
  options: string[];
};

type Path = {
  id: number;
  name: string;
  description: string;
  choices: Record<number, number>;
};

type SavedPageData = {
  decisions: Decision[];
  paths: Path[];
  scenarioTitle: string;
  category: DecisionCategory;
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

const validCategories = Object.keys(categoryLabels) as DecisionCategory[];

function subscribeToPageStorage() {
  return () => {};
}

function getPageStorageSnapshot(): string {
  try {
    return JSON.stringify({
      scenario: sessionStorage.getItem("whatif_scenario"),
      decisions: sessionStorage.getItem("whatif_decisions"),
      paths: sessionStorage.getItem("whatif_paths"),
    });
  } catch {
    return "__storage_unavailable__";
  }
}

function getServerPageStorageSnapshot(): null {
  return null;
}

function isDecision(value: unknown): value is Decision {
  if (!value || typeof value !== "object") return false;

  const decision = value as Record<string, unknown>;

  return (
    typeof decision.id === "number" &&
    typeof decision.title === "string" &&
    typeof decision.description === "string" &&
    Array.isArray(decision.options) &&
    decision.options.length >= 2 &&
    decision.options.every((option) => typeof option === "string")
  );
}

function isPath(value: unknown): value is Path {
  if (!value || typeof value !== "object") return false;

  const path = value as Record<string, unknown>;

  if (
    typeof path.id !== "number" ||
    typeof path.name !== "string" ||
    typeof path.description !== "string" ||
    !path.choices ||
    typeof path.choices !== "object" ||
    Array.isArray(path.choices)
  ) {
    return false;
  }

  return Object.values(path.choices).every(
    (choice) => typeof choice === "number"
  );
}

function parseSavedPageData(snapshot: string | null): SavedPageData | null {
  if (
    snapshot === null ||
    snapshot === "__storage_unavailable__"
  ) {
    return null;
  }

  try {
    const storage = JSON.parse(snapshot) as {
      scenario: string | null;
      decisions: string | null;
      paths: string | null;
    };

    if (!storage.scenario || !storage.decisions) return null;

    const scenario = JSON.parse(storage.scenario) as Record<
      string,
      unknown
    >;

    const decisions = JSON.parse(storage.decisions) as unknown;

    if (
      !scenario ||
      typeof scenario.situation !== "string" ||
      typeof scenario.category !== "string" ||
      !validCategories.includes(scenario.category as DecisionCategory) ||
      !Array.isArray(decisions) ||
      decisions.length === 0 ||
      !decisions.every(isDecision)
    ) {
      return null;
    }

    let paths: Path[] = [];

    if (storage.paths) {
      try {
        const parsedPaths: unknown = JSON.parse(storage.paths);

        if (Array.isArray(parsedPaths) && parsedPaths.every(isPath)) {
          paths = parsedPaths;
        }
      } catch {
        paths = [];
      }
    }

    return {
      decisions,
      paths,
      scenarioTitle: scenario.situation,
      category: scenario.category as DecisionCategory,
    };
  } catch {
    return null;
  }
}

export default function PathsPage() {
  const router = useRouter();

  const storageSnapshot = useSyncExternalStore(
    subscribeToPageStorage,
    getPageStorageSnapshot,
    getServerPageStorageSnapshot
  );

  const savedData = useMemo(
    () => parseSavedPageData(storageSnapshot),
    [storageSnapshot]
  );

  useEffect(() => {
    if (storageSnapshot === null) return;

    if (!savedData) {
      router.replace("/explore");
    }
  }, [router, storageSnapshot, savedData]);

  if (storageSnapshot === null || !savedData) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F7F7F5]">
        <p className="text-sm text-black/50">Building your paths...</p>
      </main>
    );
  }

  return (
    <PathsEditor
      decisions={savedData.decisions}
      initialPaths={savedData.paths}
      scenarioTitle={savedData.scenarioTitle}
      category={savedData.category}
    />
  );
}

function PathsEditor({
  decisions,
  initialPaths,
  scenarioTitle,
  category,
}: {
  decisions: Decision[];
  initialPaths: Path[];
  scenarioTitle: string;
  category: DecisionCategory;
}) {
  const router = useRouter();

  const [paths, setPaths] = useState<Path[]>(initialPaths);
  const [error, setError] = useState("");

  function createPath() {
    const newPath: Path = {
      id: Date.now(),
      name: `Alternative path ${paths.length + 1}`,
      description: "",
      choices: {},
    };

    setPaths((current) => [...current, newPath]);
    setError("");
  }

  function updatePath(
    pathId: number,
    field: "name" | "description",
    value: string
  ) {
    setPaths((current) =>
      current.map((path) =>
        path.id === pathId ? { ...path, [field]: value } : path
      )
    );
    setError("");
  }

  function updateChoice(
    pathId: number,
    decisionId: number,
    optionIndex: number
  ) {
    setPaths((current) =>
      current.map((path) =>
        path.id === pathId
          ? {
              ...path,
              choices: {
                ...path.choices,
                [decisionId]: optionIndex,
              },
            }
          : path
      )
    );
    setError("");
  }

  function removePath(pathId: number) {
    setPaths((current) => current.filter((path) => path.id !== pathId));
    setError("");
  }

  function handleContinue() {
    if (!category) {
      setError(
        "Your decision category is missing. Please review your scenario."
      );
      return;
    }

    if (paths.length < 2) {
      setError("Create at least two alternative paths before continuing.");
      return;
    }

    const incomplete = paths.some(
      (path) =>
        !path.name.trim() ||
        decisions.some(
          (decision) => path.choices[decision.id] === undefined
        )
    );

    if (incomplete) {
      setError(
        "Complete every path: add a name and select one choice for each decision."
      );
      return;
    }

    sessionStorage.setItem("whatif_paths", JSON.stringify(paths));
    router.push("/explore/compare");
  }

  return (
    <main className="min-h-screen bg-[#F7F7F5] text-[#171717]">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-black/[0.05] bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FF6B35] text-xl font-bold text-white">
              W
            </div>
            <span className="text-xl font-bold tracking-tight">WhatIf</span>
          </Link>

          <div className="hidden items-center gap-2 sm:flex">
            <span className="text-xs font-medium text-black/35">
              YOUR DECISION JOURNEY
            </span>
            <span className="text-black/20">/</span>
            <span className="text-xs font-bold text-[#FF6B35]">PATHS</span>
          </div>

          <Link
            href="/explore/decisions"
            className="rounded-full border border-black/10 bg-white px-4 py-2.5 text-sm font-semibold transition hover:border-[#FF6B35] hover:text-[#FF6B35]"
          >
            ← <span className="hidden sm:inline">Edit decisions</span>
            <span className="sm:hidden">Back</span>
          </Link>
        </div>
      </nav>

      <section className="mx-auto max-w-6xl px-5 pb-24 pt-12 sm:px-8 lg:px-10 lg:pt-16">
        {/* Progress */}
        <div className="mb-12">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-black/35">
              Step 4 of 6
            </span>
            <span className="text-xs font-semibold text-[#FF6B35]">
              Explore possibilities
            </span>
          </div>

          <div className="h-1.5 overflow-hidden rounded-full bg-black/[0.06]">
            <div className="h-full w-2/3 rounded-full bg-[#FF6B35]" />
          </div>
        </div>

        {/* Hero */}
        <div className="mb-12 grid gap-10 lg:grid-cols-[1fr_300px] lg:items-end">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#FF6B35]/20 bg-[#FF6B35]/[0.06] px-3.5 py-2 text-[11px] font-bold uppercase tracking-[0.13em] text-[#FF6B35]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#FF6B35]" />
              Explore different possibilities
            </span>

            <h1 className="mt-7 text-[42px] font-semibold leading-[1.08] tracking-[-0.045em] sm:text-6xl lg:text-[68px]">
              One situation.
              <br />
              <span className="text-[#FF6B35]">Different directions.</span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-black/50 sm:text-lg">
              Every decision creates another possibility. Build different
              routes, explore your choices, and see how changing your
              decisions can change the direction of your situation.
            </p>
          </div>

          <div className="rounded-3xl bg-[#171717] p-6 text-white">
            <span className="text-[10px] font-bold uppercase tracking-[0.17em] text-white/40">
              Your progress
            </span>
            <div className="mt-5 flex items-end justify-between">
              <div>
                <p className="text-4xl font-semibold tracking-tight">
                  {paths.length}
                </p>
                <p className="mt-1 text-xs text-white/45">
                  Paths created
                </p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FF6B35] text-xl">
                ↗
              </div>
            </div>
            <div className="mt-6 h-px bg-white/10" />
            <p className="mt-4 text-xs leading-6 text-white/55">
              Build at least two different paths to move forward.
            </p>
          </div>
        </div>

        {/* Starting situation */}
        <div className="mb-12 rounded-3xl border border-black/[0.06] bg-white p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#F7F7F5] text-lg">
              ◉
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-black/35">
                Your starting situation
              </span>

              <div className="mt-3">
                <span className="inline-flex rounded-full bg-[#FF6B35]/[0.08] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.1em] text-[#FF6B35]">
                  {categoryLabels[category]}
                </span>
              </div>

              <p className="mt-2 text-sm leading-7 text-black/65 sm:text-base">
                {scenarioTitle}
              </p>
            </div>
          </div>
        </div>

        {/* Section heading */}
        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.17em] text-[#FF6B35]">
              Build your alternatives
            </span>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
              Your alternative paths
            </h2>
            <p className="mt-2 text-sm leading-6 text-black/45">
              Give each route a direction by making different choices.
            </p>
          </div>

          <span className="w-fit rounded-full border border-black/[0.07] bg-white px-4 py-2 text-xs font-semibold text-black/55">
            {paths.length} {paths.length === 1 ? "path" : "paths"} created
          </span>
        </div>

        {/* Empty state */}
        {paths.length === 0 && (
          <div className="rounded-3xl border border-dashed border-black/15 bg-white px-6 py-16 text-center sm:py-20">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FF6B35]/10 text-3xl text-[#FF6B35]">
              ↗
            </div>
            <h3 className="mt-6 text-xl font-semibold tracking-tight">
              Your possibilities start here.
            </h3>
            <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-black/45">
              Create your first alternative route. You will choose a
              different combination of decisions for every path.
            </p>
            <button
              type="button"
              onClick={createPath}
              className="mt-7 rounded-full bg-[#FF6B35] px-6 py-3.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#f45c27]"
            >
              Create your first path →
            </button>
          </div>
        )}

        {/* Paths */}
        <div className="space-y-7">
          {paths.map((path, pathIndex) => {
            const selectedCount = decisions.filter(
              (decision) => path.choices[decision.id] !== undefined
            ).length;

            const progress = Math.round(
              (selectedCount / decisions.length) * 100
            );

            return (
              <article
                key={path.id}
                className="overflow-hidden rounded-3xl border border-black/[0.07] bg-white shadow-[0_8px_35px_rgba(0,0,0,0.025)]"
              >
                {/* Path header */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-black/[0.06] px-6 py-6 sm:px-8">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#FF6B35] text-sm font-bold text-white">
                      {String(pathIndex + 1).padStart(2, "0")}
                    </div>
                    <div>
                      <h3 className="text-base font-semibold">
                        Alternative route {pathIndex + 1}
                      </h3>
                      <p className="mt-1 text-xs text-black/40">
                        {selectedCount} of {decisions.length} decisions
                        completed
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => removePath(path.id)}
                    className="rounded-full px-4 py-2 text-xs font-semibold text-red-500 transition hover:bg-red-50"
                  >
                    Remove path ×
                  </button>
                </div>

                <div className="p-6 sm:p-8">
                  {/* Progress indicator */}
                  <div className="mb-8">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-[0.13em] text-black/35">
                        Route completion
                      </span>
                      <span className="text-xs font-semibold text-[#FF6B35]">
                        {progress}%
                      </span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-black/[0.06]">
                      <div
                        className="h-full rounded-full bg-[#FF6B35] transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Name */}
                  <div className="mb-6">
                    <label
                      htmlFor={`path-name-${path.id}`}
                      className="mb-2 block text-sm font-semibold"
                    >
                      Give this path a name
                    </label>
                    <input
                      id={`path-name-${path.id}`}
                      value={path.name}
                      onChange={(e) =>
                        updatePath(path.id, "name", e.target.value)
                      }
                      placeholder="Example: Start my own business"
                      maxLength={100}
                      className="w-full rounded-xl border border-black/[0.09] bg-[#F7F7F5] px-4 py-4 text-sm outline-none transition placeholder:text-black/30 focus:border-[#FF6B35] focus:bg-white focus:ring-4 focus:ring-[#FF6B35]/[0.07]"
                    />
                  </div>

                  {/* Description */}
                  <div className="mb-9">
                    <label
                      htmlFor={`path-description-${path.id}`}
                      className="mb-2 block text-sm font-semibold"
                    >
                      Describe this direction
                      <span className="ml-2 font-normal text-black/35">
                        Optional
                      </span>
                    </label>
                    <textarea
                      id={`path-description-${path.id}`}
                      value={path.description}
                      onChange={(e) =>
                        updatePath(path.id, "description", e.target.value)
                      }
                      placeholder="What makes this route different? Describe your overall approach..."
                      rows={3}
                      maxLength={1000}
                      className="w-full resize-y rounded-xl border border-black/[0.09] bg-[#F7F7F5] px-4 py-4 text-sm leading-7 outline-none transition placeholder:text-black/30 focus:border-[#FF6B35] focus:bg-white focus:ring-4 focus:ring-[#FF6B35]/[0.07]"
                    />
                  </div>

                  {/* Decisions */}
                  <div className="mb-6">
                    <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#FF6B35]">
                      Decision sequence
                    </span>
                    <h4 className="mt-2 text-lg font-semibold tracking-tight">
                      Build this route step by step
                    </h4>
                    <p className="mt-1 text-xs leading-6 text-black/45">
                      Select one option for every decision point.
                    </p>
                  </div>

                  <div className="space-y-5">
                    {decisions.map((decision, decisionIndex) => (
                      <div
                        key={decision.id}
                        className="relative rounded-2xl border border-black/[0.07] bg-[#FAFAF9] p-5 sm:p-6"
                      >
                        {decisionIndex !== decisions.length - 1 && (
                          <div className="absolute -bottom-5 left-[35px] h-5 w-px bg-[#FF6B35]/35" />
                        )}

                        <div className="mb-5 flex items-start gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#171717] text-xs font-bold text-white">
                            {String(decisionIndex + 1).padStart(2, "0")}
                          </div>

                          <div className="min-w-0 pt-1">
                            <h5 className="text-sm font-semibold">
                              {decision.title}
                            </h5>
                            {decision.description && (
                              <p className="mt-1 text-xs leading-6 text-black/45">
                                {decision.description}
                              </p>
                            )}
                          </div>

                          {path.choices[decision.id] !== undefined && (
                            <span className="ml-auto shrink-0 rounded-full bg-green-50 px-3 py-1.5 text-[10px] font-bold text-green-700">
                              Selected ✓
                            </span>
                          )}
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                          {decision.options.map((option, optionIndex) => {
                            const selected =
                              path.choices[decision.id] === optionIndex;

                            return (
                              <button
                                key={optionIndex}
                                type="button"
                                onClick={() =>
                                  updateChoice(
                                    path.id,
                                    decision.id,
                                    optionIndex
                                  )
                                }
                                aria-pressed={selected}
                                className={`rounded-xl border p-4 text-left transition ${
                                  selected
                                    ? "border-[#FF6B35] bg-[#FF6B35]/[0.06] ring-2 ring-[#FF6B35]/10"
                                    : "border-black/[0.08] bg-white hover:border-[#FF6B35]/50 hover:bg-[#FF6B35]/[0.02]"
                                }`}
                              >
                                <div className="mb-3 flex items-center justify-between">
                                  <span className="text-[10px] font-bold uppercase tracking-[0.13em] text-black/35">
                                    Choice{" "}
                                    {String.fromCharCode(65 + optionIndex)}
                                  </span>
                                  <span
                                    className={`flex h-5 w-5 items-center justify-center rounded-full border text-[10px] ${
                                      selected
                                        ? "border-[#FF6B35] bg-[#FF6B35] text-white"
                                        : "border-black/15 text-transparent"
                                    }`}
                                  >
                                    ✓
                                  </span>
                                </div>
                                <span
                                  className={`text-sm font-semibold leading-6 ${
                                    selected
                                      ? "text-[#171717]"
                                      : "text-black/60"
                                  }`}
                                >
                                  {option}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Add path */}
        {paths.length > 0 && (
          <button
            type="button"
            onClick={createPath}
            className="mt-7 flex w-full items-center justify-center gap-3 rounded-2xl border border-dashed border-black/20 bg-white/60 px-6 py-7 text-sm font-semibold text-black/55 transition hover:border-[#FF6B35] hover:bg-white hover:text-[#FF6B35]"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FF6B35]/10 text-xl text-[#FF6B35]">
              +
            </span>
            Create another alternative path
          </button>
        )}

        {/* Important note */}
        <div className="mt-10 flex gap-4 rounded-3xl border border-[#FF6B35]/15 bg-[#FF6B35]/[0.045] p-6 sm:p-7">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FF6B35]/10 text-lg text-[#FF6B35]">
            i
          </div>
          <div>
            <h3 className="text-sm font-semibold">
              Every path is a possibility, not a prediction.
            </h3>
            <p className="mt-2 text-sm leading-7 text-black/55">
              Different choices create different hypothetical routes.
              WhatIf will help you examine their potential trade-offs and
              outcomes. These routes do not guarantee what will happen
              in real life.
            </p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div
            role="alert"
            className="mt-7 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm leading-6 text-red-700"
          >
            {error}
          </div>
        )}

        {/* Bottom navigation */}
        <div className="mt-10 flex flex-col-reverse gap-3 border-t border-black/[0.07] pt-8 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/explore/decisions"
            className="rounded-full border border-black/10 bg-white px-7 py-4 text-center text-sm font-semibold transition hover:border-black/30"
          >
            ← Back to decisions
          </Link>

          <button
            type="button"
            onClick={handleContinue}
            className="rounded-full bg-[#FF6B35] px-8 py-4 text-sm font-bold text-white shadow-lg shadow-[#FF6B35]/15 transition hover:-translate-y-0.5 hover:bg-[#f45c27]"
          >
            Continue to comparison →
          </button>
        </div>
      </section>
    </main>
  );
}
