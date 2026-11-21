
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

export type DecisionScenario = {
  id: string;
  category: DecisionCategory;
  situation: string;
  context?: string;
  goal?: string;
  constraints?: string;
  priorities?: DecisionPriority[];
};

export type DecisionPriority = {
  name: string;
  importance: number;
};

export type DecisionOption = {
  id: string;
  title: string;
  description?: string;
};

export type DecisionPoint = {
  id: string;
  title: string;
  description?: string;
  options: DecisionOption[];
};

export type AlternativePath = {
  id: string;
  name: string;
  description?: string;
  choices: Record<string, string>;
};

export type EvaluationCriterion = {
  id: string;
  name: string;
  description: string;
  weight: number;
};

export type OptionEvaluation = {
  optionId: string;
  criterionId: string;
  score: number;
  explanation: string;
};

export type FollowUpQuestion = {
  id: string;
  question: string;
  reason: string;
  required: boolean;
};

export type RiskAssessment = {
  description: string;
  severity: "low" | "medium" | "high";
  mitigation?: string;
};

export type DecisionRecommendation = {
  recommendedOptionId: string;
  recommendation: string;
  reasoning: string[];
  advantages: string[];
  disadvantages: string[];
  risks: RiskAssessment[];
  uncertainties: string[];
  alternativeOptionIds: string[];
  nextSteps: string[];
};

export type DecisionAnalysis = {
  summary: string;
  criteria: EvaluationCriterion[];
  evaluations: OptionEvaluation[];
  followUpQuestions: FollowUpQuestion[];
  recommendation: DecisionRecommendation | null;
  assumptions: string[];
  limitations: string[];
  analyzedAt: string;
};
