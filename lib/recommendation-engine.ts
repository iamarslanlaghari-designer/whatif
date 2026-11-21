
import type {
  DecisionOption,
  EvaluationCriterion,
  OptionEvaluation,
} from "./decision-types";

import {
  evaluateOptions,
  type OptionRanking,
} from "./decision-engine";

export type RecommendationResult = {
  status: "ready" | "needs_more_information" | "tie" | "no_options";
  recommendedOption: OptionRanking | null;
  rankings: OptionRanking[];
  explanation: string;
};

export function generateRecommendation(
  options: DecisionOption[],
  criteria: EvaluationCriterion[],
  evaluations: OptionEvaluation[]
): RecommendationResult {
  if (options.length === 0) {
    return {
      status: "no_options",
      recommendedOption: null,
      rankings: [],
      explanation: "Add at least one option before evaluating a decision.",
    };
  }

  const result = evaluateOptions(
    options,
    criteria,
    evaluations
  );

  if (!result.isComplete) {
    return {
      status: "needs_more_information",
      recommendedOption: null,
      rankings: result.rankings,
      explanation:
        "Complete the evaluation of every option against every criterion before making a recommendation.",
    };
  }

  if (result.rankings.length === 0) {
    return {
      status: "needs_more_information",
      recommendedOption: null,
      rankings: [],
      explanation:
        "There is not enough evaluation information to recommend an option.",
    };
  }

  const highestScore = result.rankings[0].weightedScore;

  const tiedOptions = result.rankings.filter(
    (option) => option.weightedScore === highestScore
  );

  if (tiedOptions.length > 1) {
    return {
      status: "tie",
      recommendedOption: null,
      rankings: result.rankings,
      explanation:
        "Several options have the same evaluation score. Review your priorities or gather more information before choosing.",
    };
  }

  return {
    status: "ready",
    recommendedOption: result.rankings[0],
    rankings: result.rankings,
    explanation:
      "This option achieved the highest weighted evaluation score based on the selected criteria and their importance.",
  };
}
