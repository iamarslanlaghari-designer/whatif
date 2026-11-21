
import type { DecisionCategory, EvaluationCriterion } from "./decision-types";

type CriteriaTemplate = {
  name: string;
  description: string;
  weight: number;
};

const criteriaTemplates: Record<DecisionCategory, CriteriaTemplate[]> = {
  business: [
    { name: "Investment", description: "Initial and ongoing financial requirements.", weight: 5 },
    { name: "Profit Potential", description: "Potential to generate sustainable profit.", weight: 5 },
    { name: "Feasibility", description: "How practical and achievable the option is.", weight: 4 },
    { name: "Growth Potential", description: "Opportunities for future growth.", weight: 4 },
    { name: "Risk", description: "Financial and operational risks involved.", weight: 4 },
  ],

  career: [
    { name: "Income", description: "Salary and financial benefits.", weight: 5 },
    { name: "Career Growth", description: "Long-term professional development.", weight: 5 },
    { name: "Job Security", description: "Stability and employment security.", weight: 4 },
    { name: "Work-Life Balance", description: "Effect on personal time and lifestyle.", weight: 4 },
    { name: "Job Satisfaction", description: "Personal interest and fulfillment.", weight: 4 },
  ],

  education: [
    { name: "Cost", description: "Tuition and other expenses.", weight: 5 },
    { name: "Learning Quality", description: "Quality and relevance of education.", weight: 5 },
    { name: "Career Opportunities", description: "Potential career benefits.", weight: 5 },
    { name: "Duration", description: "Time required to complete.", weight: 3 },
    { name: "Flexibility", description: "Ability to balance other responsibilities.", weight: 3 },
  ],

  technology: [
    { name: "Performance", description: "Speed, reliability and functionality.", weight: 5 },
    { name: "Cost", description: "Initial and ongoing expenses.", weight: 4 },
    { name: "Security", description: "Protection of data and systems.", weight: 5 },
    { name: "Scalability", description: "Ability to grow with future needs.", weight: 4 },
    { name: "Maintainability", description: "Ease of updates and maintenance.", weight: 3 },
  ],

  finance: [
    { name: "Financial Cost", description: "Money required and associated fees.", weight: 5 },
    { name: "Potential Return", description: "Potential financial benefit.", weight: 5 },
    { name: "Risk", description: "Possibility of financial loss.", weight: 5 },
    { name: "Liquidity", description: "How easily money can be accessed.", weight: 3 },
    { name: "Time Horizon", description: "How well it fits the intended timeframe.", weight: 4 },
  ],

  personal: [
    { name: "Personal Well-being", description: "Effect on happiness and well-being.", weight: 5 },
    { name: "Long-term Impact", description: "Potential long-term consequences.", weight: 5 },
    { name: "Practicality", description: "How realistic the option is.", weight: 4 },
    { name: "Time and Effort", description: "Time and effort required.", weight: 3 },
    { name: "Personal Priorities", description: "Alignment with personal values and goals.", weight: 5 },
  ],

  health: [
    { name: "Safety", description: "Potential health and safety implications.", weight: 5 },
    { name: "Evidence", description: "Strength of reliable supporting evidence.", weight: 5 },
    { name: "Accessibility", description: "Availability of appropriate care.", weight: 3 },
    { name: "Practicality", description: "Practical considerations and constraints.", weight: 3 },
    { name: "Professional Guidance", description: "Whether qualified professional input is available.", weight: 5 },
  ],

  relationships: [
    { name: "Communication", description: "Effect on honest and respectful communication.", weight: 5 },
    { name: "Trust", description: "Effect on mutual trust and respect.", weight: 5 },
    { name: "Emotional Well-being", description: "Potential emotional impact.", weight: 5 },
    { name: "Long-term Impact", description: "Potential effect on the relationship.", weight: 4 },
    { name: "Personal Boundaries", description: "Respect for everyone's boundaries.", weight: 5 },
  ],

  travel: [
    { name: "Budget", description: "Total expected travel expenses.", weight: 5 },
    { name: "Safety", description: "Travel and destination safety considerations.", weight: 5 },
    { name: "Convenience", description: "Ease of transport and arrangements.", weight: 4 },
    { name: "Experience", description: "Activities and overall experience.", weight: 4 },
    { name: "Time", description: "Travel duration and schedule suitability.", weight: 3 },
  ],

  other: [
    { name: "Goal Alignment", description: "How well the option supports the main goal.", weight: 5 },
    { name: "Cost", description: "Financial resources required.", weight: 4 },
    { name: "Feasibility", description: "How practical and achievable the option is.", weight: 4 },
    { name: "Potential Benefits", description: "Expected advantages of the option.", weight: 4 },
    { name: "Risk", description: "Potential downsides and uncertainties.", weight: 4 },
    { name: "Long-term Impact", description: "Possible long-term consequences.", weight: 4 },
  ],
};

export function getSuggestedCriteria(
  category: DecisionCategory
): EvaluationCriterion[] {
  const templates = criteriaTemplates[category] ?? criteriaTemplates.other;

  return templates.map((criterion, index) => ({
    id: `${category}-criterion-${index + 1}`,
    name: criterion.name,
    description: criterion.description,
    weight: criterion.weight,
  }));
}
