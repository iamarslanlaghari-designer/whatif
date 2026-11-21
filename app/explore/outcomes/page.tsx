
"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type MouseEvent,
} from "react";
import { useRouter } from "next/navigation";

import SiteHeader from "@/components/site-header";

import {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  ReactFlow,
  Handle,
  Position,
  type Edge,
  type Node,
  type NodeProps,
} from "@xyflow/react";

import type { DecisionGraph } from "@/lib/ai-analysis-types";

type FlowNodeData = {
  title: string;
  description: string;
  kind: "start" | "decision" | "outcome";
  selected: boolean;
  onPath: boolean;
};

type FlowNode = Node<FlowNodeData, "whatif">;

function subscribeToGraphStorage() {
  return () => {};
}

function getGraphStorageSnapshot(): string {
  try {
    return sessionStorage.getItem("whatif_graph") ?? "__missing__";
  } catch {
    return "__storage_unavailable__";
  }
}

function getServerGraphStorageSnapshot(): null {
  return null;
}

function WhatIfNode({ data }: NodeProps<FlowNode>) {
  const styles = {
    start: {
      border: "border-[#FF6B35]",
      background: "bg-[#FF6B35]",
      title: "text-white",
      description: "text-white/75",
      label: "START",
      labelColor: "text-white/70",
    },
    decision: {
      border: "border-black/[0.10]",
      background: "bg-white",
      title: "text-[#171717]",
      description: "text-black/50",
      label: "DECISION",
      labelColor: "text-[#FF6B35]",
    },
    outcome: {
      border: "border-emerald-200",
      background: "bg-emerald-50",
      title: "text-[#171717]",
      description: "text-black/50",
      label: "POSSIBLE OUTCOME",
      labelColor: "text-emerald-700",
    },
  };

  const style = styles[data.kind];

  return (
    <div
      className={`relative w-[235px] rounded-2xl border-2 p-4 shadow-sm transition ${
        style.border
      } ${style.background} ${
        data.selected
          ? "ring-4 ring-[#FF6B35]/25 shadow-lg"
          : data.onPath
            ? "shadow-md"
            : "opacity-75 hover:opacity-100"
      }`}
    >
      {data.kind !== "start" && (
        <Handle
          type="target"
          position={Position.Left}
          className="!h-3 !w-3 !border-2 !border-white !bg-[#FF6B35]"
        />
      )}

      <div
        className={`text-[9px] font-bold tracking-[0.15em] ${style.labelColor}`}
      >
        {style.label}
        {data.onPath && data.kind !== "start" ? " · YOUR PATH" : ""}
      </div>

      <div className={`mt-2 text-sm font-bold leading-5 ${style.title}`}>
        {data.title}
      </div>

      <p
        className={`mt-2 line-clamp-3 text-[11px] leading-5 ${style.description}`}
      >
        {data.description}
      </p>

      {data.kind !== "outcome" && (
        <Handle
          type="source"
          position={Position.Right}
          className="!h-3 !w-3 !border-2 !border-white !bg-[#FF6B35]"
        />
      )}
    </div>
  );
}

const nodeTypes = {
  whatif: WhatIfNode,
};

function createFlowLayout(
  graph: DecisionGraph,
  selectedId: string | null,
  pathNodeIds: Set<string>,
  pathEdgeIds: Set<string>
) {
  const outgoing = new Map<string, typeof graph.edges>();

  for (const node of graph.nodes) {
    outgoing.set(node.id, []);
  }

  for (const edge of graph.edges) {
    outgoing.get(edge.source)?.push(edge);
  }

  for (const edges of outgoing.values()) {
    edges.sort((a, b) => {
      const aLabel = a.label.trim().toLowerCase();
      const bLabel = b.label.trim().toLowerCase();

      if (aLabel === "yes" && bLabel === "no") return -1;
      if (aLabel === "no" && bLabel === "yes") return 1;

      return 0;
    });
  }

  const subtreeSizes = new Map<string, number>();

  function getSubtreeSize(
    nodeId: string,
    visiting: Set<string>
  ): number {
    const cached = subtreeSizes.get(nodeId);

    if (cached !== undefined) return cached;
    if (visiting.has(nodeId)) return 1;

    const nextVisiting = new Set(visiting);
    nextVisiting.add(nodeId);

    const children = outgoing.get(nodeId) ?? [];

    if (children.length === 0) {
      subtreeSizes.set(nodeId, 1);
      return 1;
    }

    let total = 0;

    for (const edge of children) {
      total += getSubtreeSize(edge.target, nextVisiting);
    }

    const result = Math.max(1, total);
    subtreeSizes.set(nodeId, result);

    return result;
  }

  getSubtreeSize(graph.startNodeId, new Set());

  const positions = new Map<
    string,
    { x: number; y: number }
  >();

  const visited = new Set<string>();

  const horizontalSpacing = 370;
  const verticalSpacing = 235;

  let leafPosition = 0;

  function placeNode(
    nodeId: string,
    depth: number
  ): number {
    const existing = positions.get(nodeId);

    if (existing) return existing.y;
    if (visited.has(nodeId)) return 0;

    visited.add(nodeId);

    const children = outgoing.get(nodeId) ?? [];
    const x = depth * horizontalSpacing;

    if (children.length === 0) {
      const y = leafPosition * verticalSpacing;
      leafPosition++;

      positions.set(nodeId, { x, y });

      return y;
    }

    const childPositions: number[] = [];

    for (const edge of children) {
      const childY = placeNode(edge.target, depth + 1);
      childPositions.push(childY);
    }

    const first = childPositions[0];
    const last = childPositions[childPositions.length - 1];

    const y = (first + last) / 2;

    positions.set(nodeId, { x, y });

    return y;
  }

  placeNode(graph.startNodeId, 0);

  for (const node of graph.nodes) {
    if (!positions.has(node.id)) {
      positions.set(node.id, {
        x: 0,
        y: leafPosition * verticalSpacing,
      });

      leafPosition++;
    }
  }

  const nodes: FlowNode[] = graph.nodes.map((node) => ({
    id: node.id,
    type: "whatif",
    position: positions.get(node.id) ?? { x: 0, y: 0 },
    data: {
      title: node.title,
      description: node.description,
      kind: node.kind,
      selected: node.id === selectedId,
      onPath: pathNodeIds.has(node.id),
    },
  }));

  const edges: Edge[] = graph.edges.map((edge) => {
    const isSelectedPath = pathEdgeIds.has(edge.id);
    const label = edge.label.trim().toLowerCase();

    let labelColor = "#555555";

    if (label === "yes") labelColor = "#15803D";
    if (label === "no") labelColor = "#DC2626";

    if (isSelectedPath) labelColor = "#FF6B35";

    return {
      id: edge.id,
      source: edge.source,
      target: edge.target,
      label: edge.label,
      type: "smoothstep",
      animated: isSelectedPath,
      style: {
        stroke: isSelectedPath ? "#FF6B35" : "#C8C8C8",
        strokeWidth: isSelectedPath ? 3 : 1.5,
        opacity: isSelectedPath ? 1 : 0.75,
      },
      labelStyle: {
        fill: labelColor,
        fontSize: 12,
        fontWeight: 700,
      },
      labelBgStyle: {
        fill: "#FFFFFF",
        fillOpacity: 0.98,
      },
      labelBgPadding: [7, 4] as [number, number],
      labelBgBorderRadius: 6,
    };
  });

  return { nodes, edges };
}

function DetailSection({
  title,
  items,
  emptyText,
}: {
  title: string;
  items: string[];
  emptyText: string;
}) {
  return (
    <div className="border-t border-black/[0.07] pt-5">
      <h3 className="text-[10px] font-bold uppercase tracking-[0.14em] text-black/40">
        {title}
      </h3>

      {items.length > 0 ? (
        <ul className="mt-3 space-y-3">
          {items.map((item, index) => (
            <li
              key={`${index}-${item}`}
              className="flex gap-2.5 text-sm leading-6 text-black/65"
            >
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#FF6B35]" />
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-sm leading-6 text-black/40">
          {emptyText}
        </p>
      )}
    </div>
  );
}

export default function OutcomesPage() {
  const router = useRouter();

  const storageSnapshot = useSyncExternalStore(
    subscribeToGraphStorage,
    getGraphStorageSnapshot,
    getServerGraphStorageSnapshot
  );

  const graph = useMemo<DecisionGraph | null>(() => {
    if (
      storageSnapshot === null ||
      storageSnapshot === "__missing__" ||
      storageSnapshot === "__storage_unavailable__"
    ) {
      return null;
    }

    try {
      const parsed = JSON.parse(storageSnapshot) as DecisionGraph;

      if (
        !parsed ||
        !Array.isArray(parsed.nodes) ||
        !Array.isArray(parsed.edges) ||
        typeof parsed.startNodeId !== "string" ||
        parsed.startNodeId.length === 0 ||
        parsed.nodes.length === 0 ||
        !parsed.nodes.some((node) => node.id === parsed.startNodeId)
      ) {
        return null;
      }

      return parsed;
    } catch {
      return null;
    }
  }, [storageSnapshot]);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [chosenEdges, setChosenEdges] = useState<Record<string, string>>(
    {}
  );

  const activeSelectedId = selectedId ?? graph?.startNodeId ?? null;

  useEffect(() => {
    if (storageSnapshot !== null && !graph) {
      router.replace("/explore");
    }
  }, [router, storageSnapshot, graph]);

  const selectedPath = useMemo(() => {
    if (!graph) {
      return {
        nodes: new Set<string>(),
        edges: new Set<string>(),
      };
    }

    const pathNodes = new Set<string>();
    const pathEdges = new Set<string>();

    let currentId = graph.startNodeId;
    let safetyCounter = 0;

    pathNodes.add(currentId);

    while (safetyCounter < graph.nodes.length) {
      safetyCounter++;

      const selectedEdgeId = chosenEdges[currentId];

      if (!selectedEdgeId) break;

      const edge = graph.edges.find(
        (item) =>
          item.id === selectedEdgeId && item.source === currentId
      );

      if (!edge) break;

      pathEdges.add(edge.id);
      pathNodes.add(edge.target);

      currentId = edge.target;
    }

    return {
      nodes: pathNodes,
      edges: pathEdges,
    };
  }, [graph, chosenEdges]);

  const selectedNode = useMemo(() => {
    if (!graph || !activeSelectedId) return null;

    return (
      graph.nodes.find((node) => node.id === activeSelectedId) ?? null
    );
  }, [graph, activeSelectedId]);

  const availableBranches = useMemo(() => {
    if (!graph || !selectedNode) return [];

    return graph.edges.filter(
      (edge) => edge.source === selectedNode.id
    );
  }, [graph, selectedNode]);

  const flow = useMemo(() => {
    if (!graph) {
      return { nodes: [], edges: [] };
    }

    return createFlowLayout(
      graph,
      activeSelectedId,
      selectedPath.nodes,
      selectedPath.edges
    );
  }, [graph, activeSelectedId, selectedPath]);

  const handleNodeClick = useCallback(
    (_event: MouseEvent, node: FlowNode) => {
      setSelectedId(node.id);
    },
    []
  );

  const chooseBranch = useCallback(
    (edge: Edge) => {
      if (!graph) return;

      const sourceNode = graph.nodes.find(
        (node) => node.id === edge.source
      );

      if (!sourceNode || sourceNode.kind === "outcome") return;

      setChosenEdges((previous) => {
        const next: Record<string, string> = {};

        let currentId = graph.startNodeId;
        let counter = 0;

        while (counter < graph.nodes.length) {
          counter++;

          if (currentId === edge.source) break;

          const previousEdgeId = previous[currentId];

          if (!previousEdgeId) break;

          const previousEdge = graph.edges.find(
            (item) =>
              item.id === previousEdgeId &&
              item.source === currentId
          );

          if (!previousEdge) break;

          next[currentId] = previousEdge.id;
          currentId = previousEdge.target;
        }

        next[edge.source] = edge.id;

        return next;
      });

      setSelectedId(edge.target);
    },
    [graph]
  );

  const handleEdgeClick = useCallback(
    (_event: MouseEvent, edge: Edge) => {
      chooseBranch(edge);
    },
    [chooseBranch]
  );

  const resetExploration = useCallback(() => {
    if (!graph) return;

    setChosenEdges({});
    setSelectedId(graph.startNodeId);
  }, [graph]);

  const pathStepCount = selectedPath.edges.size;

  if (storageSnapshot === null || !graph) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F7F7F5]">
        <p className="text-sm text-black/45">
          Preparing your decision map...
        </p>
      </main>
    );
  }

  const kindLabels = {
    start: "Starting situation",
    decision: "Decision point",
    outcome: "Possible outcome",
  };

  return (
    <main className="min-h-screen bg-[#F7F7F5] text-[#171717]">
      <SiteHeader />

      <div className="border-b border-black/[0.06] bg-white">
        <div className="mx-auto flex min-h-[48px] max-w-[1600px] items-center justify-between gap-3 px-5 sm:px-8">
          <div className="hidden items-center gap-2 sm:flex">
            <span className="text-xs font-semibold uppercase tracking-[0.13em] text-black/35">
              Your decision map
            </span>

            <span className="text-black/20">/</span>

            <span className="text-xs font-bold text-[#FF6B35]">
              Explore possibilities
            </span>
          </div>

          <span className="text-xs font-semibold text-[#FF6B35] sm:hidden">
            Your decision map
          </span>

          <button
            type="button"
            onClick={() => router.push("/explore")}
            className="rounded-full border border-black/10 px-4 py-2 text-xs font-semibold transition hover:border-[#FF6B35] hover:text-[#FF6B35]"
          >
            + New decision
          </button>
        </div>
      </div>

      <section className="mx-auto max-w-[1600px] px-5 pb-12 pt-9 sm:px-8">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#FF6B35]/20 bg-[#FF6B35]/[0.06] px-3.5 py-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[#FF6B35]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#FF6B35]" />
              Your possibilities, connected
            </span>

            <h1 className="mt-5 text-3xl font-semibold tracking-[-0.04em] sm:text-5xl">
              {graph.title}
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-black/50 sm:text-base">
              {graph.summary}
            </p>
          </div>

          <div className="flex shrink-0 gap-3">
            <div className="rounded-2xl border border-black/[0.07] bg-white px-5 py-4">
              <p className="text-2xl font-semibold">
                {graph.nodes.length}
              </p>

              <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-black/40">
                Workflow nodes
              </p>
            </div>

            <div className="rounded-2xl border border-black/[0.07] bg-white px-5 py-4">
              <p className="text-2xl font-semibold">
                {graph.edges.length}
              </p>

              <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-black/40">
                Connections
              </p>
            </div>
          </div>
        </div>

        <div className="mt-7 flex flex-col justify-between gap-3 rounded-2xl border border-[#FF6B35]/15 bg-white p-5 sm:flex-row sm:items-center">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#FF6B35]">
              Your exploration
            </p>

            <p className="mt-1 text-sm font-semibold">
              {pathStepCount === 0
                ? "Start by exploring your decision."
                : `${pathStepCount} branch${pathStepCount === 1 ? "" : "es"} selected`}
            </p>

            <p className="mt-1 text-xs text-black/40">
              Follow a route and see where your choices could lead.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-[#FF6B35]/10 px-3 py-2 text-xs font-semibold text-[#FF6B35]">
              {selectedPath.nodes.size} nodes on your path
            </span>

            <button
              type="button"
              onClick={resetExploration}
              disabled={pathStepCount === 0}
              className="rounded-full border border-black/10 px-4 py-2.5 text-xs font-semibold transition hover:border-[#FF6B35] hover:text-[#FF6B35] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Reset path
            </button>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3 rounded-2xl border border-black/[0.06] bg-white px-5 py-4">
          <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-black/35">
            Node guide
          </span>

          <div className="flex items-center gap-2 text-xs font-medium text-black/60">
            <span className="h-3 w-3 rounded bg-[#FF6B35]" />
            Starting point
          </div>

          <div className="flex items-center gap-2 text-xs font-medium text-black/60">
            <span className="h-3 w-3 rounded border border-black/20 bg-white" />
            Decision
          </div>

          <div className="flex items-center gap-2 text-xs font-medium text-black/60">
            <span className="h-3 w-3 rounded border border-emerald-300 bg-emerald-50" />
            Possible outcome
          </div>

          <div className="flex items-center gap-2 text-xs font-medium text-black/60">
            <span className="h-1 w-5 rounded bg-[#FF6B35]" />
            Your selected path
          </div>
        </div>

        <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
          <div className="min-w-0 overflow-hidden rounded-3xl border border-black/[0.08] bg-white">
            <div className="flex items-center justify-between border-b border-black/[0.06] px-5 py-4">
              <div>
                <h2 className="text-sm font-semibold">
                  Interactive decision workflow
                </h2>

                <p className="mt-1 text-xs text-black/40">
                  Select a decision, then choose a branch to continue.
                </p>
              </div>

              <span className="rounded-full bg-[#F7F7F5] px-3 py-1.5 text-[10px] font-semibold text-black/45">
                Interactive map
              </span>
            </div>

            <div className="h-[650px] w-full sm:h-[760px]">
              <ReactFlow
                nodes={flow.nodes}
                edges={flow.edges}
                nodeTypes={nodeTypes}
                onNodeClick={handleNodeClick}
                onEdgeClick={handleEdgeClick}
                fitView
                fitViewOptions={{ padding: 0.2 }}
                minZoom={0.12}
                maxZoom={1.5}
                nodesDraggable={false}
                nodesConnectable={false}
                elementsSelectable
                panOnScroll
                zoomOnScroll
                proOptions={{ hideAttribution: true }}
              >
                <Background
                  variant={BackgroundVariant.Dots}
                  gap={20}
                  size={1}
                  color="#DADADA"
                />

                <Controls
                  showInteractive={false}
                  className="!overflow-hidden !rounded-xl !border !border-black/10 !bg-white !shadow-sm"
                />

                <MiniMap
                  pannable
                  zoomable
                  nodeColor={(node) => {
                    const kind = (node.data as FlowNodeData).kind;

                    if (kind === "start") return "#FF6B35";
                    if (kind === "outcome") return "#A7DCC3";

                    return "#D4D4D4";
                  }}
                  maskColor="rgba(0,0,0,0.06)"
                  className="!overflow-hidden !rounded-xl !border !border-black/10"
                />
              </ReactFlow>
            </div>

            <div className="border-t border-black/[0.06] px-5 py-3 text-xs leading-6 text-black/40">
              Tip: Select a decision node and choose a branch in the
              details panel. You can also click a connection to follow it.
            </div>
          </div>

          <aside className="h-fit rounded-3xl border border-black/[0.07] bg-white p-6 xl:sticky xl:top-24">
            {selectedNode ? (
              <>
                <div className="flex items-center justify-between gap-3">
                  <span
                    className={`rounded-full px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.13em] ${
                      selectedNode.kind === "start"
                        ? "bg-[#FF6B35]/10 text-[#FF6B35]"
                        : selectedNode.kind === "outcome"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-[#F7F7F5] text-black/55"
                    }`}
                  >
                    {kindLabels[selectedNode.kind]}
                  </span>

                  <span className="text-[10px] text-black/30">
                    Selected node
                  </span>
                </div>

                <h2 className="mt-5 text-xl font-semibold leading-7 tracking-tight">
                  {selectedNode.title}
                </h2>

                <p className="mt-3 text-sm leading-7 text-black/55">
                  {selectedNode.description}
                </p>

                <div className="mt-6 rounded-2xl bg-[#F7F7F5] p-4">
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.13em] text-black/40">
                    Possible consequence
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-black/65">
                    {selectedNode.consequence}
                  </p>
                </div>

                <div className="mt-6 space-y-5">
                  <DetailSection
                    title="Potential risks"
                    items={selectedNode.risks}
                    emptyText="No specific risks were identified for this node."
                  />

                  <DetailSection
                    title="Assumptions"
                    items={selectedNode.assumptions}
                    emptyText="No specific assumptions were listed."
                  />

                  <div className="border-t border-black/[0.07] pt-5">
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.14em] text-black/40">
                      What remains uncertain
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-black/60">
                      {selectedNode.uncertainty}
                    </p>
                  </div>
                </div>

                {selectedNode.kind !== "outcome" && (
                  <div className="mt-7 border-t border-black/[0.07] pt-5">
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.14em] text-black/40">
                      Choose your next direction
                    </h3>

                    <p className="mt-2 text-xs leading-5 text-black/45">
                      Select a branch to continue exploring this possibility.
                    </p>

                    <div className="mt-4 space-y-3">
                      {availableBranches.map((edge) => {
                        const isChosen =
                          chosenEdges[selectedNode.id] === edge.id;

                        return (
                          <button
                            key={edge.id}
                            type="button"
                            onClick={() => chooseBranch(edge as Edge)}
                            className={`flex w-full items-center justify-between gap-3 rounded-xl border p-4 text-left transition ${
                              isChosen
                                ? "border-[#FF6B35] bg-[#FF6B35]/[0.06]"
                                : "border-black/[0.08] bg-white hover:border-[#FF6B35]/50 hover:bg-[#FF6B35]/[0.025]"
                            }`}
                          >
                            <span>
                              <span className="block text-sm font-semibold text-[#171717]">
                                {edge.label}
                              </span>

                              <span className="mt-1 block text-[11px] text-black/40">
                                {graph.nodes.find(
                                  (node) => node.id === edge.target
                                )?.title ?? "Next step"}
                              </span>
                            </span>

                            <span
                              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                                isChosen
                                  ? "bg-[#FF6B35] text-white"
                                  : "bg-[#F7F7F5] text-black/45"
                              }`}
                            >
                              {isChosen ? "✓" : "→"}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {selectedNode.kind === "outcome" && (
                  <div className="mt-7 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                    <p className="text-sm font-semibold text-emerald-800">
                      You&apos;ve reached a possible outcome.
                    </p>

                    <p className="mt-2 text-xs leading-6 text-emerald-800/70">
                      This is one possible ending of this decision path,
                      not a guaranteed prediction.
                    </p>
                  </div>
                )}
              </>
            ) : (
              <p className="text-sm text-black/40">
                Select a node to see its details.
              </p>
            )}
          </aside>
        </div>

        <div className="mt-6 rounded-2xl border border-[#FF6B35]/15 bg-[#FF6B35]/[0.045] p-5 sm:p-6">
          <div className="flex gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#FF6B35]/10 text-sm font-bold text-[#FF6B35]">
              i
            </span>

            <div>
              <h3 className="text-sm font-semibold">
                Explore possibilities, not predictions.
              </h3>

              <p className="mt-2 text-sm leading-6 text-black/55">
                This map is an AI-generated exploration of potential paths.
                Real outcomes depend on your circumstances, actions, and
                factors that may not be known today. Use it to think through
                choices, not as a guarantee of the future.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col-reverse gap-3 border-t border-black/[0.07] pt-7 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={() => router.push("/explore")}
            className="rounded-full border border-black/10 bg-white px-7 py-3.5 text-sm font-semibold transition hover:border-black/30"
          >
            ← Explore another decision
          </button>

          <button
            type="button"
            onClick={resetExploration}
            className="rounded-full bg-[#FF6B35] px-7 py-3.5 text-sm font-bold text-white transition hover:bg-[#f45c27]"
          >
            Start exploration again ↑
          </button>
        </div>
      </section>
    </main>
  );
}
