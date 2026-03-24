export async function POST(req: Request) {
  try {
    const { userCode } = await req.json();

    if (!userCode) {
      return new Response(
        JSON.stringify({ correct: false, feedback: "Missing user code." }),
        { headers: { "Content-Type": "application/json" }, status: 400 },
      );
    }
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
