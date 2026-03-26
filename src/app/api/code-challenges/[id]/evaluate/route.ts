import { evaluateChallenge } from "@/features/codechallenge/evaluate-challenge";
import { getChallenge } from "@/features/codechallenge/get-challenge";

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { userCode } = await req.json();

    if (!userCode) {
      return new Response(
        JSON.stringify({ correct: false, feedback: "Missing user code." }),
        { headers: { "Content-Type": "application/json" }, status: 400 },
      );
    }

    const params = await context.params;
    const challengeId = params.id;

    let challenge;
    try {
      challenge = await getChallenge(challengeId);
    } catch {
      return new Response(
        JSON.stringify({ correct: false, feedback: "Challenge not found." }),
        { headers: { "Content-Type": "application/json" }, status: 404 },
      );
    }

    const result = await evaluateChallenge(challenge.prompt, userCode);

    return new Response(JSON.stringify(result), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Challenge evaluation error:", err);
    return new Response(
      JSON.stringify({
        correct: false,
        feedback: "Server error during evaluation.",
      }),
      { headers: { "Content-Type": "application/json" }, status: 500 },
    );
  }
}
