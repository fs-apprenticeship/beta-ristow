import { getChallenge } from "@/features/codechallenge/get-challenge";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const params = await context.params;

    console.log("PARAMS:", params); // 👈 add this

    if (!params?.id) {
      return new Response(
        JSON.stringify({ error: "Challenge ID is required" }),
        { headers: { "Content-Type": "application/json" }, status: 400 },
      );
    }

    const challenge = await getChallenge(params.id);

    return new Response(JSON.stringify(challenge), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error(error);

    const err = error as Error;

    // Differentiate not found vs server error
    const status = err.message === "Challenge not found" ? 404 : 500;

    return new Response(
      JSON.stringify({ error: err.message || "Internval server error" }),
      { headers: { "Content-Type": "application/json" }, status },
    );
  }
}
