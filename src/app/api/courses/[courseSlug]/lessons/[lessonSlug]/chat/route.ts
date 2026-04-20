import { NextRequest, NextResponse } from "next/server";

import generateTextStream from "@/lib/openai/generate-text-stream";

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

    // Extract instructions and prompt from messages
    const systemMessage = messages.find((msg) => msg.role === "system");
    const instructions = systemMessage ? systemMessage.content : "";
    const prompt = messages
      .filter((msg) => msg.role !== "system")
      .map((msg) => msg.content)
      .join(" ");

    // Use the helper to generate the stream
    const textStream = generateTextStream({ instructions, prompt });

    // Create a ReadableStream to properly format the streaming response
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const delta of textStream) {
            // JSON-encode so embedded newlines don't break SSE framing
            controller.enqueue(`data: ${JSON.stringify(delta)}\n\n`);
          }
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "Content-Type": "text/event-stream",
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    }
  }
}
