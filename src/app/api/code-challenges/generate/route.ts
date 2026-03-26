import { generateChallenge } from "@/features/codechallenge/generate-challenge";
import { saveChallengeToDB } from "@/features/codechallenge/save-challenge";

export async function POST(req: Request) {
  try {
    const { title, topics } = await req.json();

    if (!title || !topics) {
      return new Response("Title and topics are required", { status: 400 });
    }

    // Generate challenge using OpenAI
    const challengeData = await generateChallenge(title, topics);

    // Save to DB using Prisma
    const savedChallenge = await saveChallengeToDB(challengeData);

    // Only return the ID for frontend routing
    return new Response(JSON.stringify({ id: savedChallenge.id }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: unknown) {
    console.error(error);
    return new Response(
      error instanceof Error ? error.message : "Internal server error",
      { status: 500 },
    );
  }
}
