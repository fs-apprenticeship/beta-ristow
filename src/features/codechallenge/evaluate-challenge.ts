import generateText from "@/lib/openai/generate-text";
import parseJsonResponse from "@/lib/openai/parse-json-response";

interface EvaluationResult {
  correct: boolean;
  "error-code"?: string;
  expectedOutput?: string[];
  feedback: string;
  output?: string[];
  stdout?: string[];
  testExamples?: string[];
}

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

  const evalPrompt = `
You are a strict coding evaluator.

Challenge:
${prompt}

User Code:
${userCode}

Instructions:
- Generate 3 test examples for this challenge: normal case, edge case, corner case.
- Run the user's code against each example.
- Capture any prints or console logs for each example.
- Return the output the code produces for each example.
- Include all test examples in the response.
- Provide optimization feedback if the code runs successfully.

Return JSON only in this format:
{
  "correct": true|false,
  "error-code": "string",
  "feedback": "string",
  "expectedOutput": ["string", "string", "string"],
  "output": ["string", "string", "string"],
  "stdout": ["string", "string", "string"],
  "testExamples": ["string", "string", "string"]
}
`;

  try {
    const response = await generateText({
      instructions:
        "You are a strict coding evaluator for a coding education platform. Always return valid JSON.",
      prompt: evalPrompt,
    });

    return parseJsonResponse(
      response,
      "Failed to evaluate coding challenge.",
    ) as EvaluationResult;
  } catch (err) {
    console.error("Evaluation error:", err);
    return { correct: false, feedback: "AI evaluation failed." };
  }
}
