
import type {
  DecisionGraph,
  DecisionGraphNode,
  DecisionGraphEdge,
} from "./ai-analysis-types";

function isStringArray(value: unknown): value is string[] {
  return (
    Array.isArray(value) &&
    value.every((item) => typeof item === "string")
  );
}

function isValidNode(value: unknown): value is DecisionGraphNode {
  if (!value || typeof value !== "object") return false;

  const node = value as Record<string, unknown>;

  return (
    typeof node.id === "string" &&
    ["start", "decision", "outcome"].includes(String(node.kind)) &&
    typeof node.title === "string" &&
    typeof node.description === "string" &&
    typeof node.consequence === "string" &&
    isStringArray(node.risks) &&
    isStringArray(node.assumptions) &&
    typeof node.uncertainty === "string"
  );
}

function isValidEdge(value: unknown): value is DecisionGraphEdge {
  if (!value || typeof value !== "object") return false;

  const edge = value as Record<string, unknown>;

  return (
    typeof edge.id === "string" &&
    typeof edge.source === "string" &&
    typeof edge.target === "string" &&
    typeof edge.label === "string"
  );
}

export function validateDecisionGraph(value: unknown): DecisionGraph {
  if (!value || typeof value !== "object") {
    throw new Error("The AI returned an invalid graph.");
  }

  const graph = value as Record<string, unknown>;

  if (
    typeof graph.title !== "string" ||
    typeof graph.summary !== "string" ||
    typeof graph.startNodeId !== "string" ||
    !Array.isArray(graph.nodes) ||
    !Array.isArray(graph.edges)
  ) {
    throw new Error("The AI response is missing required graph information.");
  }

  const nodes = graph.nodes;
  const edges = graph.edges;

  if (nodes.length < 5 || nodes.length > 30) {
    throw new Error("The AI generated an invalid number of workflow nodes.");
  }

  if (!nodes.every(isValidNode)) {
    throw new Error("One or more workflow nodes have invalid information.");
  }

  if (!edges.every(isValidEdge)) {
    throw new Error("One or more workflow connections are invalid.");
  }

  const typedNodes = nodes as DecisionGraphNode[];
  const typedEdges = edges as DecisionGraphEdge[];

  const nodeIds = new Set(typedNodes.map((node) => node.id));
  const edgeIds = new Set(typedEdges.map((edge) => edge.id));

  if (nodeIds.size !== typedNodes.length || edgeIds.size !== typedEdges.length) {
    throw new Error("The workflow contains duplicate IDs.");
  }

  const startNodes = typedNodes.filter((node) => node.kind === "start");

  if (
    startNodes.length !== 1 ||
    startNodes[0].id !== graph.startNodeId
  ) {
    throw new Error("The workflow must have exactly one valid start node.");
  }

  const outgoing = new Map<string, string[]>();

  for (const node of typedNodes) {
    outgoing.set(node.id, []);
  }

  for (const edge of typedEdges) {
    if (!nodeIds.has(edge.source) || !nodeIds.has(edge.target)) {
      throw new Error("The workflow contains a connection to a missing node.");
    }

    if (edge.source === edge.target) {
      throw new Error("The workflow contains an invalid self-connection.");
    }

    outgoing.get(edge.source)!.push(edge.target);
  }

  for (const node of typedNodes) {
    const connections = outgoing.get(node.id) ?? [];

    if (node.kind === "decision" && connections.length < 2) {
      throw new Error(
        `Decision node "${node.title}" needs at least two branches.`
      );
    }

    if (node.kind === "outcome" && connections.length !== 0) {
      throw new Error(
        `Outcome node "${node.title}" must not have outgoing connections.`
      );
    }

    if (node.kind === "start" && connections.length === 0) {
      throw new Error("The start node must connect to the workflow.");
    }
  }

  // Every node must be reachable from the start.
  const visited = new Set<string>();
  const queue = [graph.startNodeId];

  while (queue.length > 0) {
    const current = queue.shift()!;

    if (visited.has(current)) continue;

    visited.add(current);

    for (const next of outgoing.get(current) ?? []) {
      if (!visited.has(next)) queue.push(next);
    }
  }

  if (visited.size !== typedNodes.length) {
    throw new Error("The workflow contains disconnected nodes.");
  }

  // The workflow must not contain circular paths.
  const visiting = new Set<string>();
  const visitedForCycles = new Set<string>();

  function hasCycle(id: string): boolean {
    if (visiting.has(id)) return true;
    if (visitedForCycles.has(id)) return false;

    visiting.add(id);

    for (const next of outgoing.get(id) ?? []) {
      if (hasCycle(next)) return true;
    }

    visiting.delete(id);
    visitedForCycles.add(id);

    return false;
  }

  if (hasCycle(graph.startNodeId)) {
    throw new Error("The workflow contains a circular path.");
  }

  return {
    title: graph.title,
    summary: graph.summary,
    startNodeId: graph.startNodeId,
    nodes: typedNodes,
    edges: typedEdges,
  };
}
