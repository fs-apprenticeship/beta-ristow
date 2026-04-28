import generateStructuredOutput from "@/lib/openai/generate-structured-output";
import { evaluationResultSchema, challengeTestCaseSchema } from "./validation";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

type TestCase = z.infer<typeof challengeTestCaseSchema>;
type EvaluationResult = z.infer<typeof evaluationResultSchema>;

const jsonSchema = zodToJsonSchema(evaluationResultSchema);

/**
 * Evaluates user code against a coding challenge prompt.
 */
export async function evaluateChallenge(
  prompt: string,
  userCode: string,
  language: string,
  testCases: TestCase[]
): Promise<EvaluationResult> {
  if (!prompt || !userCode) {
    return { results: [] };
  }
  const instructions = `
You are a strict code execution simulator.

For each test case:
- Execute the user code mentally
- Determine the output
- Capture stdout (if any)
- Compare with expectedOutput internally
- Return whether it passed

IMPORTANT:
- DO NOT include input
- DO NOT include expectedOutput
- DO NOT include explanations
- ONLY return: output, stdout, passed

Return valid JSON only.
)

  `;

  try {
    const response = await generateStructuredOutput<EvaluationResult>({
      formatSchema: jsonSchema,
      instructions,
      prompt: `
Language: ${language}

Problem:
${prompt}

User Code:
${userCode}

Test Cases:
${JSON.stringify(testCases, null, 2)}
      `,
    });
    console.log("Evaluation response:", response);
    return evaluationResultSchema.parse(response);
  } catch (err) {
    console.error("Error during challenge evaluation:", err);
    return { results: [] };
  }
}
