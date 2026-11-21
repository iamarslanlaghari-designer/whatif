export type DecisionCategory =
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

export type DecisionGraphRequest = {
  category: DecisionCategory;
  situation: string;
  context?: string;
  goal?: string;
  constraints?: string;
};

export type DecisionNodeKind = "start" | "decision" | "outcome";

export type DecisionGraphNode = {
  id: string;
  kind: DecisionNodeKind;
  title: string;
  description: string;
  consequence: string;
  risks: string[];
  assumptions: string[];
  uncertainty: string;
};

export type DecisionGraphEdge = {
  id: string;
  source: string;
  target: string;
  label: string;
};

export type DecisionGraph = {
  title: string;
  summary: string;
  startNodeId: string;
  nodes: DecisionGraphNode[];
  edges: DecisionGraphEdge[];
};