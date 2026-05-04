import generateStructuredOutput from "@/lib/openai/generate-structured-output";

import type { ChallengeTestCase } from "./validation";

import { EvaluationResult, evaluationResultSchema } from "./validation";

const jsonSchema = evaluationResultSchema;

/**
 * Evaluates user code against a coding challenge prompt.
 */
export async function evaluateChallenge(
  challengePrompt: string,
  userCode: string,
  language: string,
  testCases: ChallengeTestCase[],
): Promise<EvaluationResult> {
  if (!challengePrompt || !userCode) {
    return { results: [] };
  }
  const instructions = `
    You are a strict code evaluator.
    You run and evaluate user-submitted code against a coding challenge prompt and a set of test cases.

    Run the user's submitted code using the input from each test case and 
    compare the user code output to the expected output for that test case. 

    The user's code should produce output that matches the expected output of each test case.

    IMPORTANT:
    - Only pass the test case user input to the user's function, do not include anything extra.
    - If the user's code produces the expected output for a test case, mark that test case as passed.
    - If the user's code does not produce the expected output for a test case, mark that test case as failed.

    Return valid JSON only.
    `;

  const prompt = `
  Language: ${language}

  Problem:
  ${challengePrompt}

  User Code:
  ${userCode}

  Test Cases:
  ${JSON.stringify(testCases, null, 2)}
  `;

  try {
    const response = await generateStructuredOutput({
      formatSchema: jsonSchema,
      instructions,
      prompt,
    });
    console.log("Evaluation response:", response);
    return evaluationResultSchema.parse(response);
  } catch (err) {
    console.error("Error during challenge evaluation:", err);
    return { results: [] };
  }
}
