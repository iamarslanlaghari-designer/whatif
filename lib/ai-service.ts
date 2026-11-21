
import "server-only";

import OpenAI from "openai";

import { aiConfig, validateAIConfig } from "./ai-config";
import { buildDecisionPrompt } from "./decision-prompt";
import { validateDecisionGraph } from "./validate-ai-analysis";

import type { DecisionGraphRequest } from "./ai-analysis-types";
import type { AIProviderResult } from "./ai-provider";

export async function analyzeDecision(
  request: DecisionGraphRequest
): Promise<AIProviderResult> {
  try {
    validateAIConfig();

    const client = new OpenAI({
      apiKey: aiConfig.apiKey ?? "",
      baseURL: aiConfig.baseURL,
      timeout: aiConfig.timeout,
      maxRetries: aiConfig.maxRetries,
    });

    const completion = await client.chat.completions.create({
      model: aiConfig.model,

      messages: [
        {
          role: "system",
          content: `
You are WhatIf's decision workflow generation engine.

Return exactly one complete JSON object.

Required top-level fields:
title, summary, startNodeId, nodes, edges.

Never wrap the graph inside another object.
Never return Markdown or explanations.

Generate 18 to 24 connected nodes.

Every outcome node must have ZERO outgoing connections.
Every decision node must have at least TWO outgoing connections.
Every node must be reachable from the start.
The graph must not contain cycles.

Keep descriptions concise but meaningful.
Do not omit required node fields.
          `.trim(),
        },
        {
          role: "user",
          content: buildDecisionPrompt(request),
        },
      ],

      response_format: {
        type: "json_object",
      },

      // Allow enough output for the complete decision graph.
      max_completion_tokens: 12000,
    });

    const choice = completion.choices[0];

    if (!choice) {
      throw new Error("The AI did not return a response choice.");
    }

    if (choice.finish_reason === "length") {
      throw new Error(
        "The AI response reached its output limit. Increase the token limit or simplify the graph descriptions."
      );
    }

    if (choice.message.refusal) {
      throw new Error(choice.message.refusal);
    }

    const content = choice.message.content;

    if (!content || typeof content !== "string") {
      throw new Error("The AI returned an empty response.");
    }

    let parsed: unknown;

    try {
      parsed = JSON.parse(content);
    } catch {
      console.error("Invalid WhatIf AI JSON:", content);

      throw new Error("The AI returned incomplete or invalid JSON.");
    }

    const graph = validateDecisionGraph(parsed);

    return {
      success: true,
      data: graph,
    };
  } catch (error) {
    console.error("WhatIf AI analysis error:", error);

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Something went wrong while generating your decision workflow.",
    };
  }
}
