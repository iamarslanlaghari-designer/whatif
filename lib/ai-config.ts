
export const aiConfig = {
  provider: "groq",
  model: process.env.GROQ_MODEL || "openai/gpt-oss-120b",
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
  timeout: 60000,
  maxRetries: 2,
};

export function validateAIConfig(): void {
  if (!aiConfig.apiKey) {
    throw new Error(
      "Groq API key is missing. Add GROQ_API_KEY to your .env.local file."
    );
  }

  if (!aiConfig.model) {
    throw new Error("AI model is not configured.");
  }
}
