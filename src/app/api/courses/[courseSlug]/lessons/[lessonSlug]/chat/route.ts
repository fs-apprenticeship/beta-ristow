import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY ?? "missing-key",
});

export async function POST(request: NextRequest) {
  try {
    console.log("Received POST request");

    const body = await request.json();
    console.log("Body:", body);

    const { messages } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Missing or invalid messages" },
        { status: 400 },
      );
    }

    const completion = await openai.chat.completions.create({
      messages,
      model: "gpt-4o-mini",
    });

    return NextResponse.json({ result: completion });
  } catch (error) {
    // Properly typed error handling
    console.error("API ERROR:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    return NextResponse.json(
      {
        details: errorMessage,
        error: "Server error",
      },
      { status: 500 },
    );
  }
}
