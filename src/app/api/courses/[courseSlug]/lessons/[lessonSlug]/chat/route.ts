import { NextRequest, NextResponse } from "next/server";

import requireCurrentAccount from "@/features/identity/actions/require-current-account";
import generateTextStream from "@/lib/openai/generate-text-stream";

export async function POST(request: NextRequest) {
  try {
    console.log("Received POST request");

    await requireCurrentAccount();

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

    const textStream = generateTextStream({ instructions, prompt });

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const delta of textStream) {
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
    console.error("API Error:", error);

    // Return proper 401 for unauthenticated users
    if (error instanceof Error) {
      if (
        error.message.includes("Unable to get account") ||
        error.message.includes("clerkUserId")
      ) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    // Any other error
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
