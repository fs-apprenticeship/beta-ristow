import { saveSubmission } from "@/features/codechallenge/save-submission";

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { userCode } = await req.json();
    const { id: challengeId } = await context.params;

    if (!userCode) {
      return new Response(
        JSON.stringify({ correct: false, feedback: "Missing user code." }),
        { headers: { "Content-Type": "application/json" }, status: 400 },
      );
    }

    const submission = await saveSubmission({
      challengeId,
      userCode,
    });

    return new Response(
      JSON.stringify({
        msg: "Submission saved successfully.",
        submission,
      }),
      { headers: { "Content-Type": "application/json" }, status: 200 },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({
        err: err instanceof Error ? err.message : "Unknown error",
        msg: "Server error during submission.",
      }),
      {
        headers: { "Content-Type": "application/json" },
        status: 500,
      },
    );
  }
  return new Response(
    JSON.stringify({
      msg: "Submission received. (Evaluation not implemented yet.)",
    }),
    {
      headers: { "Content-Type": "application/json" },
    },
  );
}
