import { NextResponse } from "next/server";
import { z } from "zod";

import { analyzeDecision } from "@/lib/ai-service";

const requestSchema = z.object({
  category: z.enum([
    "business",
    "career",
    "education",
    "technology",
    "finance",
    "personal",
    "health",
    "relationships",
    "travel",
    "other",
  ]),
  situation: z.string().trim().min(20).max(3000),
  context: z.string().max(2000).optional(),
  goal: z.string().max(1000).optional(),
  constraints: z.string().max(1500).optional(),
});

export async function POST(request: Request) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Request body must contain valid JSON." },
        { status: 400, headers: { "Cache-Control": "no-store" } }
      );
    }

    const validation = requestSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Please provide a valid decision situation.",
          details: validation.error.flatten(),
        },
        { status: 400 }
      );
    }

    const result = await analyzeDecision(validation.data);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error,
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.data,
    });
  } catch (error) {
    console.error("WhatIf API error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to process your request. Please try again.",
      },
      { status: 500 }
    );
  }
}