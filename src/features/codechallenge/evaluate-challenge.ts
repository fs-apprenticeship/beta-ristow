import generateStructuredOutput from "@/lib/openai/generate-structured-output";

type EvaluationResult = {
  correct: boolean;
  errorCode?: string;
  expectedOutput?: string[];
  feedback: string;
  output?: string[];
  stdout?: string[];
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
      errorCode: { type: "string" },
      expectedOutput: {
        items: { type: "string" },
        maxItems: 3,
        minItems: 3,
        type: "array",
      },

      feedback: { type: "string" },
      output: {
        items: { type: "string" },
        maxItems: 3,
        minItems: 3,
        type: "array",
      },
      stdout: {
        items: { type: "string" },
        maxItems: 3,
        minItems: 3,
        type: "array",
      },
      testExamples: {
        items: { type: "string" },
        maxItems: 3,
        minItems: 3,
        type: "array",
      },
    },
    required: [
      "correct",
      "errorCode",
      "feedback",
      "testExamples",
      "expectedOutput",
      "output",
      "stdout",
    ],
    type: "object",
  } as const;

  const instructions = `
You are a strict code evaluator.

Return a JSON object that matches the schema exactly.

Rules:
- Generate EXACTLY 3 test examples.
- testExamples must contain the inputs.
- expectedOutput must contain the correct outputs for each test.
- output must contain the user's code results.
- stdout must contain any console logs (or empty string if none).

- All arrays MUST have exactly 3 items and align by index:
  index 0 = Test 1
  index 1 = Test 2
  index 2 = Test 3

- Include:
  1 normal case
  1 edge case
  1 corner/tricky case

- "correct" is true ONLY if all outputs match expectedOutput.

- Do NOT leave any array empty.
- Use empty string "" if no stdout exists.
`;

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
