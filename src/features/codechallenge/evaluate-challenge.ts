import generateStructuredOutput from "@/lib/openai/generate-structured-output";

type EvaluationResult = {
  correct: boolean;
  "error-code"?: string;
  expectedOutput?: string;
  feedback: string;
  output?: string;
  stdout?: string;
  testExamples?: string[];
};

/**
 * Evaluates user code against a coding challenge prompt.
 */
export async function evaluateChallenge(
  prompt: string,
  userCode: string,
): Promise<EvaluationResult> {
  if (!prompt || !userCode) {
    return { correct: false, feedback: "Missing prompt or user code." };
  }

  const schema = {
    additionalProperties: false,
    properties: {
      correct: { type: "boolean" },
      errorcode: { type: "string" },
      feedback: { type: "string" },
      output: { type: "string" },
      stdout: { type: "string" },
    },
    required: ["correct", "stdout", "errorcode", "output", "feedback"],
    type: "object",
  } as const;

  const instructions = `- Return true ONLY if the user's code fully solves the problem.
- Consider edge cases.
- Evaluate logic and correctness.
- Include line number if there is an error.
- Capture any prints or console logs.
- Return the output if the code runs.
- If the code runs, accept it and provide optimization feedback.`;

  try {
    const response = await generateStructuredOutput<EvaluationResult>({
      formatSchema: schema,
      instructions,
      prompt,
    });
    console.log("Evaluation response:", response);
    return response;
  } catch (err) {
    console.error("Error during challenge evaluation:", err);
    return { correct: false, feedback: "Error evaluating code." };
  }
}
