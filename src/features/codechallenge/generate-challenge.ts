import generateStructuredOutput from "@/lib/openai/generate-structured-output";

import { ChallengeData, challengeSchema } from "./validation";

const jsonSchema = challengeSchema;

export async function generateChallenge(
  title: string,
  topics: string,
): Promise<ChallengeData> {
  const prompt = `
    Create a coding challenge based on the following title and topics.
    Title: ${title}
    Topics: ${topics}

    Use the coding challenge you created to generate test cases for the challenge.

    TEST CASE GENERATION REQUIREMENTS:
    - Return EXACTLY 3 test cases
      1. Normal case
      2. Edge case
      3. Tricky or corner case
    - Test cases must test the functionality of the generated code challenge.
    - Each test case MUST include:
      - input (string)
      - expectedOutput (string)
    - Test cases should be designed to validate the correctness and robustness of solutions to the challenge.
    - Ensure test cases are valid; the input should directly relate to the problem and determine the expected output based on the challenge requirements.

    Test Case Restrictions:
    - Do NOT include explanations or reasoning in the output
    - Do NOT include any fields other than input and expectedOutput
    - Ensure test cases are valid and can be used to evaluate solutions to the challenge
    - No extra whitespace in expectedOutput or input

    `;

  const instructions = `
    You are a coding challenge generator for a coding education platform.
    You will generate a coding challenge
    and a set of 3 test cases for the generated challenge
    `;

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const response = await generateStructuredOutput({
        formatSchema: jsonSchema,
        instructions: instructions,
        prompt,
      });

      console.log(`Attempt ${attempt}:`, response);

      return challengeSchema.parse(response);
    } catch (error) {
      console.error(`Attempt ${attempt} failed`, {
        error,
        title,
        topics,
      });

      if (attempt === 3) {
        throw new Error("AI failed to generate a valid challenge");
      }
    }
  }

  throw new Error("Unreachable");
}
