
"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import type {
  DecisionGraph,
  DecisionGraphNode,
} from "@/lib/ai-analysis-types";

type TabId =
  | "scorecard"
  | "simulator"
  | "risks"
  | "opportunities"
  | "scenarios"
  | "comparison"
  | "assumptions"
  | "journal"
  | "action"
  | "tracker";

type PathOption = {
  id: string;
  label: string;
  nodes: DecisionGraphNode[];
  edges: DecisionGraph["edges"];
  outcome: DecisionGraphNode;
};

type JournalEntry = {
  id: string;
  title: string;
  savedAt: string;
  scenario: string;
  pathName: string;
  notes: string;
};

type ActionTask = {
  id: string;
  title: string;
  detail: string;
  done: boolean;
};

type TrackedOutcome = {
  id: string;
  title: string;
  status: "not-started" | "in-progress" | "completed" | "blocked";
  note: string;
  updatedAt: string;
};

const STORAGE = {
  journal: "whatif_decision_journal",
  tasks: "whatif_action_tasks",
  tracker: "whatif_outcome_tracker",
};

const tabs: {
  id: TabId;
  number: string;
  label: string;
  description: string;
}[] = [
  {
    id: "scorecard",
    number: "01",
    label: "Scorecard",
    description: "Rate paths against what matters to you.",
  },
  {
    id: "simulator",
    number: "02",
    label: "What-if simulator",
    description:
      "Test how changing an assumption could affect your exploration.",
  },
  {
    id: "risks",
    number: "03",
    label: "Risk radar",
    description: "Review risks mentioned across your decision map.",
  },
  {
    id: "opportunities",
    number: "04",
    label: "Opportunity finder",
    description:
      "Spot alternative branches and openings worth investigating.",
  },
  {
    id: "scenarios",
    number: "05",
    label: "Best & worst case",
    description:
      "Review favorable, difficult, and mixed possible outcomes.",
  },
  {
    id: "comparison",
    number: "06",
    label: "Path comparison",
    description: "Compare two complete routes side by side.",
  },
  {
    id: "assumptions",
    number: "07",
    label: "Assumption checker",
    description: "Track what needs evidence before you decide.",
  },
  {
    id: "journal",
    number: "08",
    label: "Decision journal",
    description:
      "Save your reasoning and the route you are considering.",
  },
  {
    id: "action",
    number: "09",
    label: "Plan of action",
    description:
      "Turn a selected route into practical next steps.",
  },
  {
    id: "tracker",
    number: "10",
    label: "Outcome tracker",
    description:
      "Record what happens and review your progress.",
  },
];

const criteria = [
  {
    id: "benefit",
    label: "Potential benefits",
    hint: "How much could this path support your goals?",
  },
  {
    id: "cost",
    label: "Cost and resources",
    hint: "How manageable could the required resources be?",
  },
  {
    id: "time",
    label: "Time and effort",
    hint: "How realistic is the time and effort involved?",
  },
  {
    id: "risk",
    label: "Risk exposure",
    hint: "How manageable do the risks appear?",
  },
  {
    id: "fit",
    label: "Personal fit",
    hint: "How well does this path fit your priorities?",
  },
];

function makeId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function readList<T,>(key: string): T[] {
  try {
    const value = localStorage.getItem(key);

    return value ? (JSON.parse(value) as T[]) : [];
  } catch {
    return [];
  }
}

function saveList<T,>(key: string, value: T[]) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // The page remains usable if browser storage is unavailable.
  }
}

function buildPaths(graph: DecisionGraph): PathOption[] {
  const outgoing = new Map<string, DecisionGraph["edges"]>();

  graph.nodes.forEach((node) => {
    outgoing.set(node.id, []);
  });

  graph.edges.forEach((edge) => {
    outgoing.get(edge.source)?.push(edge);
  });

  const nodeMap = new Map(
    graph.nodes.map((node) => [node.id, node])
  );

  const result: PathOption[] = [];

  function walk(
    currentId: string,
    nodes: DecisionGraphNode[],
    edges: DecisionGraph["edges"],
    visited: Set<string>
  ) {
    if (result.length >= 60 || visited.has(currentId)) {
      return;
    }

    const current = nodeMap.get(currentId);

    if (!current) {
      return;
    }

    const nextNodes = [...nodes, current];

    const nextVisited = new Set(visited);
    nextVisited.add(currentId);

    const nextEdges = outgoing.get(currentId) ?? [];

    if (current.kind === "outcome" || nextEdges.length === 0) {
      if (current.kind === "outcome") {
        const firstLabel = edges[0]?.label ?? "Route";

        result.push({
          id: edges.map((edge) => edge.id).join("__") || current.id,
          label: `${firstLabel} → ${current.title}`,
          nodes: nextNodes,
          edges,
          outcome: current,
        });
      }

      return;
    }

    for (const edge of nextEdges) {
      walk(
        edge.target,
        nextNodes,
        [...edges, edge],
        nextVisited
      );
    }
  }

  walk(graph.startNodeId, [], [], new Set());

  return result;
}

function sentiment(text: string) {
  const value = text.toLowerCase();

  const positive = [
    "success",
    "gain",
    "growth",
    "improve",
    "achieve",
    "strong",
    "benefit",
    "opportunity",
    "progress",
    "profitable",
    "stable",
    "secure",
    "clarity",
    "complete",
  ];

  const negative = [
    "fail",
    "loss",
    "risk",
    "pressure",
    "debt",
    "delay",
    "decline",
    "conflict",
    "uncertain",
    "difficult",
    "stress",
    "costly",
    "miss",
    "damage",
  ];

  const score =
    positive.reduce(
      (sum, word) => sum + (value.includes(word) ? 1 : 0),
      0
    ) -
    negative.reduce(
      (sum, word) => sum + (value.includes(word) ? 1 : 0),
      0
    );

  return score > 0
    ? "favorable"
    : score < 0
      ? "challenging"
      : "mixed";
}

function severity(text: string): "High" | "Medium" | "Low" {
  const value = text.toLowerCase();

  if (
    [
      "severe",
      "major",
      "significant",
      "loss",
      "debt",
      "legal",
      "safety",
      "critical",
      "failure",
    ].some((word) => value.includes(word))
  ) {
    return "High";
  }

  if (
    [
      "risk",
      "delay",
      "pressure",
      "uncertain",
      "limited",
      "cost",
      "depend",
      "competition",
    ].some((word) => value.includes(word))
  ) {
    return "Medium";
  }

  return "Low";
}

function SectionHeading({
  eyebrow,
  title,
  text,
}: {
  eyebrow: string;
  title: string;
  text: string;
}) {
  return (
    <div className="mb-7">
      <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-[#FF6B35]">
        {eyebrow}
      </p>

      <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] sm:text-3xl">
        {title}
      </h2>

      <p className="mt-2 max-w-3xl text-sm leading-7 text-black/50">
        {text}
      </p>
    </div>
  );
}

function Panel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-2xl border border-black/[0.08] bg-white p-5 shadow-[0_8px_30px_rgba(0,0,0,0.025)] sm:p-6 ${className}`}
    >
      {children}
    </section>
  );
}

function EmptyState({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-xl border border-dashed border-black/15 bg-black/[0.02] px-5 py-8 text-center text-sm leading-6 text-black/45">
      {children}
    </div>
  );
}

export default function DecisionCenterPage() {
  const router = useRouter();

  const [graph, setGraph] = useState<DecisionGraph | null>(null);

  const [scenario, setScenario] = useState<{
    category?: string;
    situation?: string;
    context?: string;
    goal?: string;
    constraints?: string;
  } | null>(null);

  const [activeTab, setActiveTab] = useState<TabId>("scorecard");
  const [ready, setReady] = useState(false);

  const [selectedPathId, setSelectedPathId] = useState("");
  const [compareA, setCompareA] = useState("");
  const [compareB, setCompareB] = useState("");

  const [scores, setScores] = useState<
    Record<string, Record<string, number>>
  >({});

  const [assumptionStates, setAssumptionStates] = useState<
    Record<string, boolean>
  >({});

  const [journal, setJournal] = useState<JournalEntry[]>([]);
  const [journalNotes, setJournalNotes] = useState("");

  const [tasks, setTasks] = useState<ActionTask[]>([]);

  const [tracker, setTracker] = useState<TrackedOutcome[]>([]);
  const [newMilestone, setNewMilestone] = useState("");

  const [selectedJournalPath, setSelectedJournalPath] = useState("");

  useEffect(() => {
    let cancelled = false;

    const frameId = window.requestAnimationFrame(() => {
      if (cancelled) return;

      try {
        const rawGraph = sessionStorage.getItem("whatif_graph");
        const rawScenario = sessionStorage.getItem("whatif_scenario");

        if (!rawGraph) {
          router.replace("/explore");
          return;
        }

        const parsed = JSON.parse(rawGraph) as DecisionGraph;

        if (
          !parsed ||
          !Array.isArray(parsed.nodes) ||
          !Array.isArray(parsed.edges) ||
          !parsed.nodes.length
        ) {
          router.replace("/explore");
          return;
        }

        setGraph(parsed);

        setScenario(
          rawScenario ? JSON.parse(rawScenario) : null
        );

        setJournal(readList<JournalEntry>(STORAGE.journal));
        setTasks(readList<ActionTask>(STORAGE.tasks));
        setTracker(readList<TrackedOutcome>(STORAGE.tracker));

        setReady(true);
      } catch {
        router.replace("/explore");
      }
    });

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frameId);
    };
  }, [router]);

  const paths = useMemo(
    () => (graph ? buildPaths(graph) : []),
    [graph]
  );

  const selectedPath =
    paths.find((path) => path.id === selectedPathId) ??
    paths[0] ??
    null;

  const pathA =
    paths.find((path) => path.id === compareA) ??
    paths[0] ??
    null;

  const pathB =
    paths.find((path) => path.id === compareB) ??
    paths[1] ??
    paths[0] ??
    null;

  const assumptions = useMemo(() => {
    if (!graph) return [];

    const found = new Set<string>();

    graph.nodes.forEach((node) => {
      node.assumptions.forEach((item) => {
        const value = item.trim();

        if (value) {
          found.add(value);
        }
      });
    });

    return Array.from(found);
  }, [graph]);

  const risks = useMemo(() => {
    if (!graph) return [];

    return graph.nodes.flatMap((node) =>
      node.risks.map((risk) => ({
        id: `${node.id}-${risk}`,
        nodeTitle: node.title,
        risk,
        level: severity(risk),
      }))
    );
  }, [graph]);

  const opportunities = useMemo(() => {
    if (!graph) return [];

    const edgeItems = graph.edges.map((edge) => {
      const target = graph.nodes.find(
        (node) => node.id === edge.target
      );

      return {
        id: edge.id,
        title: edge.label,
        detail: target
          ? `${target.title}: ${target.description}`
          : "A branch in your decision map.",
        source: "Alternative branch",
      };
    });

    const outcomeItems = graph.nodes
      .filter((node) => node.kind === "outcome")
      .map((node) => ({
        id: `outcome-${node.id}`,
        title: node.title,
        detail: node.consequence || node.description,
        source: "Possible outcome",
      }));

    return [...edgeItems, ...outcomeItems];
  }, [graph]);

  const scenarios = useMemo(() => {
    return paths.map((path) => ({
      ...path,
      classification: sentiment(
        `${path.outcome.title} ${path.outcome.description} ${path.outcome.consequence} ${path.outcome.risks.join(" ")}`
      ),
    }));
  }, [paths]);

  const updateScore = useCallback(
    (
      pathId: string,
      criterionId: string,
      value: number
    ) => {
      setScores((current) => ({
        ...current,
        [pathId]: {
          ...(current[pathId] ?? {}),
          [criterionId]: value,
        },
      }));
    },
    []
  );

  function selectPath(pathId: string) {
    setSelectedPathId(pathId);
    setSelectedJournalPath(pathId);
  }

  function saveJournalEntry(pathToSave: PathOption) {
    const entry: JournalEntry = {
      id: makeId(),
      title: graph?.title ?? "Decision exploration",
      savedAt: new Date().toISOString(),
      scenario: scenario?.situation ?? graph?.summary ?? "",
      pathName: pathToSave.outcome.title,
      notes: journalNotes.trim(),
    };

    const next = [entry, ...journal];

    setJournal(next);
    saveList(STORAGE.journal, next);
    setJournalNotes("");
  }

  function deleteJournalEntry(id: string) {
    const next = journal.filter((entry) => entry.id !== id);

    setJournal(next);
    saveList(STORAGE.journal, next);
  }

  function generateTasks() {
    if (!selectedPath) return;

    const next: ActionTask[] = selectedPath.nodes
      .filter((node) => node.kind !== "start")
      .map((node, index) => ({
        id: `${selectedPath.id}-${node.id}-${index}`,
        title: node.title,
        detail: node.description,
        done: false,
      }));

    setTasks(next);
    saveList(STORAGE.tasks, next);
  }

  function toggleTask(id: string) {
    const next = tasks.map((task) =>
      task.id === id
        ? { ...task, done: !task.done }
        : task
    );

    setTasks(next);
    saveList(STORAGE.tasks, next);
  }

  function addMilestone() {
    const title = newMilestone.trim();

    if (!title) return;

    const next: TrackedOutcome[] = [
      {
        id: makeId(),
        title,
        status: "not-started",
        note: "",
        updatedAt: new Date().toISOString(),
      },
      ...tracker,
    ];

    setTracker(next);
    saveList(STORAGE.tracker, next);
    setNewMilestone("");
  }

  function updateMilestone(
    id: string,
    changes: Partial<TrackedOutcome>
  ) {
    const next = tracker.map((item) =>
      item.id === id
        ? {
            ...item,
            ...changes,
            updatedAt: new Date().toISOString(),
          }
        : item
    );

    setTracker(next);
    saveList(STORAGE.tracker, next);
  }

  if (!ready || !graph) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F7F7F5] text-sm text-black/45">
        Loading your decision tools...
      </main>
    );
  }

  const tabContent = () => {
    // 01 — DECISION SCORECARD

    if (activeTab === "scorecard") {
      return (
        <>
          <SectionHeading
            eyebrow="01 / Decision scorecard"
            title="Compare what matters most"
            text="Rate each possible route against your own priorities. These are your ratings, not AI-generated facts or objective scores."
          />

          {paths.length === 0 ? (
            <EmptyState>
              No complete outcome paths were found in this map.
            </EmptyState>
          ) : (
            <div className="space-y-5">
              {paths.map((path) => {
                const values = scores[path.id] ?? {};

                const total = criteria.reduce(
                  (sum, item) =>
                    sum + (values[item.id] ?? 3),
                  0
                );

                return (
                  <Panel key={path.id}>
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-[#FF6B35]">
                          Possible route
                        </p>

                        <h3 className="mt-2 text-lg font-semibold">
                          {path.outcome.title}
                        </h3>

                        <p className="mt-1 text-xs text-black/45">
                          {path.nodes.length} steps ·{" "}
                          {path.edges
                            .map((edge) => edge.label)
                            .join(" → ")}
                        </p>
                      </div>

                      <div className="rounded-xl bg-[#FFF2EC] px-4 py-3 text-right">
                        <p className="text-2xl font-semibold text-[#D94E1F]">
                          {total}/{criteria.length * 5}
                        </p>

                        <p className="text-[9px] font-bold uppercase tracking-wider text-[#D94E1F]/70">
                          Your rating
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 grid gap-4 md:grid-cols-2">
                      {criteria.map((criterion) => (
                        <label
                          key={criterion.id}
                          className="block"
                        >
                          <span className="flex justify-between gap-3 text-sm font-semibold">
                            <span>{criterion.label}</span>

                            <span className="tabular-nums text-[#FF6B35]">
                              {values[criterion.id] ?? 3}/5
                            </span>
                          </span>

                          <span className="mt-1 block text-xs text-black/40">
                            {criterion.hint}
                          </span>

                          <input
                            type="range"
                            min="1"
                            max="5"
                            step="1"
                            value={values[criterion.id] ?? 3}
                            onChange={(event) =>
                              updateScore(
                                path.id,
                                criterion.id,
                                Number(event.target.value)
                              )
                            }
                            className="mt-3 w-full accent-[#FF6B35]"
                          />
                        </label>
                      ))}
                    </div>
                  </Panel>
                );
              })}
            </div>
          )}
        </>
      );
    }

    // 02 — WHAT-IF SIMULATOR

    if (activeTab === "simulator") {
      return (
        <>
          <SectionHeading
            eyebrow="02 / What-if simulator"
            title="Test a different assumption"
            text="Mark an assumption as currently supported or still uncertain. WhatIf will highlight the map nodes that mention it so you can see what deserves another look. This does not regenerate or predict a new graph."
          />

          {assumptions.length === 0 ? (
            <EmptyState>
              Your AI map did not list explicit assumptions. Review the
              node details in the decision map.
            </EmptyState>
          ) : (
            <div className="space-y-3">
              {assumptions.map((assumption, index) => {
                const supported =
                  assumptionStates[assumption] ?? false;

                const affected = graph.nodes.filter((node) =>
                  node.assumptions.includes(assumption)
                );

                const affectedPaths = paths.filter((path) =>
                  path.nodes.some((node) =>
                    node.assumptions.includes(assumption)
                  )
                );

                return (
                  <Panel key={assumption}>
                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                      <div className="flex-1">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-black/35">
                          Assumption{" "}
                          {String(index + 1).padStart(2, "0")}
                        </p>

                        <p className="mt-2 text-sm font-medium leading-6">
                          {assumption}
                        </p>

                        <p className="mt-2 text-xs text-black/40">
                          Connected to {affected.length} map{" "}
                          {affected.length === 1 ? "node" : "nodes"}{" "}
                          and {affectedPaths.length} possible{" "}
                          {affectedPaths.length === 1 ? "route" : "routes"}.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setAssumptionStates((state) => ({
                            ...state,
                            [assumption]: !supported,
                          }))
                        }
                        className={`rounded-full px-4 py-2.5 text-xs font-bold ${
                          supported
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-[#FFF2EC] text-[#D94E1F]"
                        }`}
                      >
                        {supported
                          ? "Currently supported"
                          : "Needs verification"}
                      </button>
                    </div>

                    {affected.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {affected.map((node) => (
                          <span
                            key={node.id}
                            className="rounded-lg border border-black/[0.08] bg-black/[0.02] px-3 py-2 text-xs text-black/60"
                          >
                            {node.title}
                          </span>
                        ))}
                      </div>
                    )}

                    {affectedPaths.length > 0 && (
                      <div className="mt-4 border-t border-black/[0.06] pt-3">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-black/35">
                          Routes to review
                        </p>

                        <ul className="mt-2 space-y-2">
                          {affectedPaths.map((path) => (
                            <li
                              key={path.id}
                              className="text-xs leading-5 text-black/55"
                            >
                              {path.outcome.title}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </Panel>
                );
              })}
            </div>
          )}
        </>
      );
    }

    // 03 — RISK RADAR

    if (activeTab === "risks") {
      const order = {
        High: 0,
        Medium: 1,
        Low: 2,
      };

      const sorted = [...risks].sort(
        (a, b) => order[a.level] - order[b.level]
      );

      return (
        <>
          <SectionHeading
            eyebrow="03 / Risk radar"
            title="Risks to examine before choosing"
            text="This list collects risks already mentioned in your generated map. The level is a simple wording-based review aid, not a professional risk assessment."
          />

          <div className="mb-5 grid grid-cols-3 gap-3">
            {(["High", "Medium", "Low"] as const).map(
              (level) => (
                <Panel key={level} className="p-4">
                  <p className="text-2xl font-semibold">
                    {
                      risks.filter(
                        (risk) => risk.level === level
                      ).length
                    }
                  </p>

                  <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-black/40">
                    {level} wording signals
                  </p>
                </Panel>
              )
            )}
          </div>

          {sorted.length === 0 ? (
            <EmptyState>
              No risks were explicitly listed in the generated nodes.
            </EmptyState>
          ) : (
            <div className="space-y-3">
              {sorted.map((risk) => (
                <Panel key={risk.id}>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-semibold">
                      {risk.nodeTitle}
                    </p>

                    <span
                      className={`rounded-full px-3 py-1 text-[10px] font-bold ${
                        risk.level === "High"
                          ? "bg-red-50 text-red-700"
                          : risk.level === "Medium"
                            ? "bg-amber-50 text-amber-700"
                            : "bg-emerald-50 text-emerald-700"
                      }`}
                    >
                      {risk.level} review priority
                    </span>
                  </div>

                  <p className="mt-3 text-sm leading-6 text-black/60">
                    {risk.risk}
                  </p>
                </Panel>
              ))}
            </div>
          )}
        </>
      );
    }

    // 04 — OPPORTUNITY FINDER

    if (activeTab === "opportunities") {
      return (
        <>
          <SectionHeading
            eyebrow="04 / Opportunity finder"
            title="Explore alternatives and openings"
            text="These are branches and possible outcomes already present in your map. Use them as prompts for further investigation, not as confirmed opportunities."
          />

          <div className="grid gap-3 md:grid-cols-2">
            {opportunities.map((item) => (
              <Panel key={item.id}>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#FF6B35]">
                  {item.source}
                </p>

                <h3 className="mt-2 text-base font-semibold">
                  {item.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-black/55">
                  {item.detail}
                </p>
              </Panel>
            ))}
          </div>
        </>
      );
    }

    // 05 — BEST AND WORST CASE

    if (activeTab === "scenarios") {
      const favorable = scenarios.filter(
        (item) => item.classification === "favorable"
      );

      const mixed = scenarios.filter(
        (item) => item.classification === "mixed"
      );

      const challenging = scenarios.filter(
        (item) => item.classification === "challenging"
      );

      const groups = [
        {
          label: "Potentially favorable",
          note: "Outcome wording contains more positive signals.",
          items: favorable,
        },
        {
          label: "Mixed or uncertain",
          note: "Outcome wording does not clearly lean either way.",
          items: mixed,
        },
        {
          label: "Potentially challenging",
          note: "Outcome wording contains more difficult signals.",
          items: challenging,
        },
      ];

      return (
        <>
          <SectionHeading
            eyebrow="05 / Best & worst case"
            title="Look across a range of possible outcomes"
            text="The groups below are organized by wording in the outcome descriptions. They are not probability estimates, forecasts, or guarantees. Review the original node details before drawing conclusions."
          />

          <div className="grid gap-4 lg:grid-cols-3">
            {groups.map((group) => (
              <Panel key={group.label}>
                <h3 className="text-base font-semibold">
                  {group.label}
                </h3>

                <p className="mt-1 text-xs leading-5 text-black/40">
                  {group.note}
                </p>

                <div className="mt-4 space-y-3">
                  {group.items.length ? (
                    group.items.map((item) => (
                      <div
                        key={item.id}
                        className="rounded-xl border border-black/[0.07] p-3"
                      >
                        <p className="text-sm font-semibold">
                          {item.outcome.title}
                        </p>

                        <p className="mt-1 text-xs leading-5 text-black/50">
                          {item.outcome.consequence ||
                            item.outcome.description}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-black/35">
                      No outcomes in this group.
                    </p>
                  )}
                </div>
              </Panel>
            ))}
          </div>
        </>
      );
    }

    // 06 — PATH COMPARISON

    if (activeTab === "comparison") {
      return (
        <>
          <SectionHeading
            eyebrow="06 / Path comparison"
            title="Compare two routes side by side"
            text="Review the steps, trade-offs, risks, and possible endings for two paths in your generated decision map."
          />

          {paths.length < 2 ? (
            <EmptyState>
              Your map needs at least two complete outcome paths to
              compare.
            </EmptyState>
          ) : (
            <>
              <Panel className="mb-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-black/45">
                    Route A

                    <select
                      value={compareA || paths[0].id}
                      onChange={(event) =>
                        setCompareA(event.target.value)
                      }
                      className="mt-2 w-full rounded-xl border border-black/10 bg-white px-3 py-3 text-sm font-medium normal-case text-black"
                    >
                      {paths.map((path, index) => (
                        <option
                          key={`${path.id}-a-${index}`}
                          value={path.id}
                        >
                          {path.outcome.title}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="text-xs font-bold uppercase tracking-wider text-black/45">
                    Route B

                    <select
                      value={compareB || paths[1].id}
                      onChange={(event) =>
                        setCompareB(event.target.value)
                      }
                      className="mt-2 w-full rounded-xl border border-black/10 bg-white px-3 py-3 text-sm font-medium normal-case text-black"
                    >
                      {paths.map((path, index) => (
                        <option
                          key={`${path.id}-b-${index}`}
                          value={path.id}
                        >
                          {path.outcome.title}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              </Panel>

              <div className="grid gap-4 md:grid-cols-2">
                {[pathA, pathB].map(
                  (path, index) =>
                    path && (
                      <Panel key={`${index}-${path.id}`}>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-[#FF6B35]">
                          Route {index === 0 ? "A" : "B"}
                        </p>

                        <h3 className="mt-2 text-lg font-semibold">
                          {path.outcome.title}
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-black/55">
                          {path.outcome.consequence ||
                            path.outcome.description}
                        </p>

                        <h4 className="mt-5 text-[10px] font-bold uppercase tracking-wider text-black/40">
                          Steps in this route
                        </h4>

                        <ol className="mt-3 space-y-3">
                          {path.nodes.map((node, step) => (
                            <li
                              key={node.id}
                              className="flex gap-3"
                            >
                              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#FFF2EC] text-[10px] font-bold text-[#D94E1F]">
                                {step + 1}
                              </span>

                              <div>
                                <p className="text-sm font-semibold">
                                  {node.title}
                                </p>

                                <p className="mt-1 text-xs leading-5 text-black/45">
                                  {node.description}
                                </p>
                              </div>
                            </li>
                          ))}
                        </ol>

                        <div className="mt-5 border-t border-black/[0.07] pt-4">
                          <h4 className="text-[10px] font-bold uppercase tracking-wider text-black/40">
                            Risks to review
                          </h4>

                          {path.nodes.flatMap(
                            (node) => node.risks
                          ).length ? (
                            <ul className="mt-2 list-disc space-y-1 pl-5 text-xs leading-5 text-black/55">
                              {path.nodes
                                .flatMap((node) => node.risks)
                                .map((risk, i) => (
                                  <li key={`${i}-${risk}`}>
                                    {risk}
                                  </li>
                                ))}
                            </ul>
                          ) : (
                            <p className="mt-2 text-xs text-black/40">
                              No explicit risks listed.
                            </p>
                          )}
                        </div>
                      </Panel>
                    )
                )}
              </div>
            </>
          )}
        </>
      );
    }

    // 07 — ASSUMPTION CHECKER

    if (activeTab === "assumptions") {
      return (
        <>
          <SectionHeading
            eyebrow="07 / Assumption checker"
            title="Separate facts from things to verify"
            text="Review the assumptions supplied by the AI map. Mark each one after you have checked it in the real world; WhatIf does not verify claims for you."
          />

          {assumptions.length === 0 ? (
            <EmptyState>
              No explicit assumptions were included in this map.
            </EmptyState>
          ) : (
            <div className="space-y-3">
              {assumptions.map((assumption, index) => (
                <Panel key={assumption}>
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={assumptionStates[assumption] ?? false}
                      onChange={(event) =>
                        setAssumptionStates((state) => ({
                          ...state,
                          [assumption]: event.target.checked,
                        }))
                      }
                      className="mt-1 h-4 w-4 accent-[#FF6B35]"
                    />

                    <div className="flex-1">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-black/35">
                        Assumption {index + 1}
                      </p>

                      <p className="mt-2 text-sm leading-6">
                        {assumption}
                      </p>

                      <p className="mt-2 text-xs font-semibold text-[#FF6B35]">
                        {assumptionStates[assumption]
                          ? "Marked as checked by you"
                          : "Still needs verification"}
                      </p>
                    </div>
                  </div>
                </Panel>
              ))}
            </div>
          )}
        </>
      );
    }

    // 08 — DECISION JOURNAL

    if (activeTab === "journal") {
      return (
        <>
          <SectionHeading
            eyebrow="08 / Decision journal"
            title="Keep a record of your thinking"
            text="Save the route you are considering alongside your own notes. Journal entries are stored in this browser on this device."
          />

          <Panel>
            <label className="block text-xs font-bold uppercase tracking-wider text-black/45">
              Route to save

              <select
                value={
                  selectedJournalPath ||
                  selectedPath?.id ||
                  ""
                }
                onChange={(event) =>
                  setSelectedJournalPath(event.target.value)
                }
                className="mt-2 w-full rounded-xl border border-black/10 bg-white px-3 py-3 text-sm font-medium normal-case text-black"
              >
                {paths.map((path) => (
                  <option key={path.id} value={path.id}>
                    {path.outcome.title}
                  </option>
                ))}
              </select>
            </label>

            <label className="mt-5 block text-xs font-bold uppercase tracking-wider text-black/45">
              Your reasoning and reflections

              <textarea
                value={journalNotes}
                onChange={(event) =>
                  setJournalNotes(event.target.value)
                }
                rows={4}
                placeholder="Why are you considering this route? What do you still need to learn?"
                className="mt-2 w-full rounded-xl border border-black/10 bg-[#FAFAF9] px-4 py-3 text-sm font-normal normal-case leading-6 text-black outline-none focus:border-[#FF6B35]"
              />
            </label>

            <button
              type="button"
              onClick={() => {
                const chosen = paths.find(
                  (path) =>
                    path.id ===
                    (selectedJournalPath || selectedPath?.id)
                );

                if (chosen) {
                  saveJournalEntry(chosen);
                }
              }}
              className="mt-4 rounded-full bg-[#FF6B35] px-5 py-3 text-xs font-bold text-white hover:bg-[#ed5c2a]"
            >
              Save journal entry
            </button>
          </Panel>

          <div className="mt-6 space-y-3">
            {journal.length ? (
              journal.map((entry) => (
                <Panel key={entry.id}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-black/35">
                        {new Date(entry.savedAt).toLocaleString()}
                      </p>

                      <h3 className="mt-2 text-base font-semibold">
                        {entry.pathName}
                      </h3>

                      <p className="mt-1 text-xs text-black/45">
                        {entry.title}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        deleteJournalEntry(entry.id)
                      }
                      className="text-xs font-semibold text-red-600"
                    >
                      Delete
                    </button>
                  </div>

                  {entry.notes && (
                    <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-black/60">
                      {entry.notes}
                    </p>
                  )}

                  <p className="mt-3 line-clamp-2 text-xs leading-5 text-black/40">
                    {entry.scenario}
                  </p>
                </Panel>
              ))
            ) : (
              <EmptyState>
                Your saved decision entries will appear here.
              </EmptyState>
            )}
          </div>
        </>
      );
    }

    // 09 — PLAN OF ACTION

    if (activeTab === "action") {
      return (
        <>
          <SectionHeading
            eyebrow="09 / Plan of action"
            title="Turn a route into next steps"
            text="Generate a working checklist from the steps in one path. Check off tasks as you complete them."
          />

          <Panel>
            <label className="block text-xs font-bold uppercase tracking-wider text-black/45">
              Build plan from route

              <select
                value={selectedPath?.id ?? ""}
                onChange={(event) =>
                  selectPath(event.target.value)
                }
                className="mt-2 w-full rounded-xl border border-black/10 bg-white px-3 py-3 text-sm font-medium normal-case text-black"
              >
                {paths.map((path) => (
                  <option key={path.id} value={path.id}>
                    {path.outcome.title}
                  </option>
                ))}
              </select>
            </label>

            <button
              type="button"
              onClick={generateTasks}
              className="mt-4 rounded-full bg-[#FF6B35] px-5 py-3 text-xs font-bold text-white"
            >
              Generate action checklist
            </button>
          </Panel>

          <div className="mt-5 space-y-3">
            {tasks.length ? (
              <>
                <div className="flex items-center justify-between text-xs text-black/45">
                  <span>
                    {tasks.filter((task) => task.done).length} of{" "}
                    {tasks.length} completed
                  </span>

                  <span>
                    {Math.round(
                      (tasks.filter((task) => task.done).length /
                        tasks.length) *
                        100
                    )}
                    %
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-black/[0.07]">
                  <div
                    className="h-full rounded-full bg-[#FF6B35] transition-all"
                    style={{
                      width: `${
                        (tasks.filter((task) => task.done).length /
                          tasks.length) *
                        100
                      }%`,
                    }}
                  />
                </div>

                {tasks.map((task, index) => (
                  <Panel key={task.id}>
                    <label className="flex cursor-pointer items-start gap-3">
                      <input
                        type="checkbox"
                        checked={task.done}
                        onChange={() => toggleTask(task.id)}
                        className="mt-1 h-4 w-4 accent-[#FF6B35]"
                      />

                      <span className="flex-1">
                        <span
                          className={`block text-sm font-semibold ${
                            task.done
                              ? "text-black/35 line-through"
                              : ""
                          }`}
                        >
                          {index + 1}. {task.title}
                        </span>

                        <span className="mt-1 block text-xs leading-5 text-black/45">
                          {task.detail}
                        </span>
                      </span>
                    </label>
                  </Panel>
                ))}
              </>
            ) : (
              <EmptyState>
                Choose a route and generate your action checklist.
              </EmptyState>
            )}
          </div>
        </>
      );
    }

    // 10 — OUTCOME TRACKER

    return (
      <>
        <SectionHeading
          eyebrow="10 / Outcome tracker"
          title="Track what actually happens"
          text="Add real milestones and update their status as your situation develops. Compare your real progress with the possibilities explored in your map."
        />

        <Panel>
          <label className="block text-xs font-bold uppercase tracking-wider text-black/45">
            New milestone

            <input
              value={newMilestone}
              onChange={(event) =>
                setNewMilestone(event.target.value)
              }
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  addMilestone();
                }
              }}
              placeholder="e.g. Speak with three potential customers"
              className="mt-2 w-full rounded-xl border border-black/10 bg-[#FAFAF9] px-4 py-3 text-sm font-normal normal-case text-black outline-none focus:border-[#FF6B35]"
            />
          </label>

          <button
            type="button"
            onClick={addMilestone}
            className="mt-4 rounded-full bg-[#FF6B35] px-5 py-3 text-xs font-bold text-white"
          >
            Add milestone
          </button>
        </Panel>

        <div className="mt-5 space-y-3">
          {tracker.length ? (
            tracker.map((item) => (
              <Panel key={item.id}>
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                  <h3 className="text-sm font-semibold">
                    {item.title}
                  </h3>

                  <select
                    value={item.status}
                    onChange={(event) =>
                      updateMilestone(item.id, {
                        status: event.target.value as TrackedOutcome["status"],
                      })
                    }
                    className="rounded-lg border border-black/10 bg-white px-3 py-2 text-xs font-semibold"
                  >
                    <option value="not-started">
                      Not started
                    </option>

                    <option value="in-progress">
                      In progress
                    </option>

                    <option value="completed">
                      Completed
                    </option>

                    <option value="blocked">
                      Blocked
                    </option>
                  </select>
                </div>

                <textarea
                  value={item.note}
                  onChange={(event) =>
                    updateMilestone(item.id, {
                      note: event.target.value,
                    })
                  }
                  rows={2}
                  placeholder="What happened? Add an observation or result..."
                  className="mt-4 w-full rounded-lg border border-black/10 bg-[#FAFAF9] px-3 py-2 text-xs leading-5 outline-none focus:border-[#FF6B35]"
                />

                <p className="mt-2 text-[10px] text-black/35">
                  Updated {new Date(item.updatedAt).toLocaleString()}
                </p>
              </Panel>
            ))
          ) : (
            <EmptyState>
              Add a milestone to begin tracking real progress.
            </EmptyState>
          )}
        </div>
      </>
    );
  };

  const active = tabs.find(
    (tab) => tab.id === activeTab
  )!;

  return (
    <main className="min-h-screen bg-[#F7F7F5] text-[#171717]">
      <nav className="sticky top-0 z-40 border-b border-black/[0.07] bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex h-[68px] max-w-[1500px] items-center justify-between gap-3 px-5 sm:px-8">
          <button
            type="button"
            onClick={() => router.push("/explore/outcomes")}
            className="flex items-center gap-2 text-sm font-bold tracking-tight"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FF6B35] text-sm text-white">
              W
            </span>

            WhatIf
          </button>

          <div className="hidden text-[10px] font-bold uppercase tracking-[0.15em] text-black/35 sm:block">
            Decision center / {active.label}
          </div>

          <button
            type="button"
            onClick={() => router.push("/explore/outcomes")}
            className="rounded-full border border-black/10 px-4 py-2 text-xs font-semibold hover:border-[#FF6B35] hover:text-[#FF6B35]"
          >
            Back to map
          </button>
        </div>
      </nav>

      <div className="mx-auto max-w-[1500px] px-5 pb-16 pt-8 sm:px-8">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-[#FF6B35]">
              Explore what could be
            </p>

            <h1 className="mt-3 text-3xl font-semibold tracking-[-0.05em] sm:text-5xl">
              Your decision center
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-black/50">
              {graph.title} — use these tools to examine your map,
              compare possibilities, and keep track of your own
              decisions.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:flex">
            <div className="rounded-xl border border-black/[0.07] bg-white px-4 py-3">
              <p className="text-xl font-semibold">
                {graph.nodes.length}
              </p>

              <p className="text-[9px] font-bold uppercase tracking-wider text-black/40">
                Map nodes
              </p>
            </div>

            <div className="rounded-xl border border-black/[0.07] bg-white px-4 py-3">
              <p className="text-xl font-semibold">
                {paths.length}
              </p>

              <p className="text-[9px] font-bold uppercase tracking-wider text-black/40">
                Complete paths
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex gap-2 overflow-x-auto pb-3">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`shrink-0 rounded-full border px-4 py-3 text-xs font-semibold transition ${
                activeTab === tab.id
                  ? "border-[#FF6B35] bg-[#FF6B35] text-white"
                  : "border-black/[0.09] bg-white text-black/55 hover:border-black/20"
              }`}
            >
              <span className="mr-2 opacity-60">
                {tab.number}
              </span>

              {tab.label}
            </button>
          ))}
        </div>

        <div className="mt-5 rounded-2xl border border-[#FF6B35]/15 bg-[#FFF8F4] px-5 py-4">
          <p className="text-sm font-semibold">
            {active.label}
          </p>

          <p className="mt-1 text-xs leading-5 text-black/50">
            {active.description}
          </p>
        </div>

        <div className="mt-8">
          {tabContent()}
        </div>

        <p className="mt-10 border-t border-black/[0.07] pt-5 text-xs leading-6 text-black/35">
          WhatIf explores possibilities, not predictions. Scores and
          classifications are review aids. Verify important information
          independently before making consequential decisions. Journal
          entries, plans, and tracking data are saved in this browser
          only.
        </p>
      </div>
    </main>
  );
}
