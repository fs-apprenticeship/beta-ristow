import generateText from "@/lib/openai/generate-text";
import parseJsonResponse from "@/lib/openai/parse-json-response";

interface EvaluationResult {
  correct: boolean;
  "error-code"?: string;
  feedback: string;
  output?: string;
  stdout?: string;
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
- Return true ONLY if the user's code fully solves the problem.
- Consider edge cases.
- Evaluate logic and correctness.
- Include line number if there is an error.
- Capture any prints or console logs.
- Return the output if the code runs.
- If the code runs, accept it and provide optimization feedback.

Return JSON only in this format:
{
  "correct": true|false,
  "error-code": "string",
  "feedback": "string",
  "output": "string",
  "stdout": "string"
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
