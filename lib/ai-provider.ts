import type {
  DecisionGraph,
  DecisionGraphRequest,
} from "./ai-analysis-types";

export type AIProviderResult =
  | {
      success: true;
      data: DecisionGraph;
    }
  | {
      success: false;
      error: string;
    };

export interface AIProvider {
  analyze(request: DecisionGraphRequest): Promise<AIProviderResult>;
}