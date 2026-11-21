
import type {
  DecisionOption,
  EvaluationCriterion,
  OptionEvaluation,
} from "./decision-types";

export type OptionRanking = {
  optionId: string;
  optionTitle: string;
  weightedScore: number;
  evaluatedCriteria: number;
  totalCriteria: number;
};

export type EvaluationResult = {
  rankings: OptionRanking[];
  winner: OptionRanking | null;
  isComplete: boolean;
};

export function evaluateOptions(
  options: DecisionOption[],
  criteria: EvaluationCriterion[],
  evaluations: OptionEvaluation[]
): EvaluationResult {
  if (options.length === 0 || criteria.length === 0) {
    return {
      rankings: [],
      winner: null,
      isComplete: false,
    };
  }

  const validCriteria = criteria.filter(
    (criterion) =>
      Number.isFinite(criterion.weight) &&
      criterion.weight > 0
  );

  if (validCriteria.length === 0) {
    return {
      rankings: [],
      winner: null,
      isComplete: false,
    };
  }

  const rankings: OptionRanking[] = options.map((option) => {
    let weightedTotal = 0;
    let totalWeight = 0;
    let evaluatedCriteria = 0;

    for (const criterion of validCriteria) {
      const evaluation = evaluations.find(
        (item) =>
          item.optionId === option.id &&
          item.criterionId === criterion.id
      );

      if (
        !evaluation ||
        !Number.isFinite(evaluation.score) ||
        evaluation.score < 1 ||
        evaluation.score > 5
      ) {
        continue;
      }

      weightedTotal += evaluation.score * criterion.weight;
      totalWeight += criterion.weight;
      evaluatedCriteria += 1;
    }

    const weightedScore =
      totalWeight > 0 ? weightedTotal / totalWeight : 0;

    return {
      optionId: option.id,
      optionTitle: option.title,
      weightedScore: Number(weightedScore.toFixed(2)),
      evaluatedCriteria,
      totalCriteria: validCriteria.length,
    };
  });

  rankings.sort(
    (a, b) => b.weightedScore - a.weightedScore
  );

  const isComplete = rankings.every(
    (ranking) =>
      ranking.evaluatedCriteria === validCriteria.length
  );

  return {
    rankings,
    winner: isComplete ? rankings[0] : null,
    isComplete,
  };
}
