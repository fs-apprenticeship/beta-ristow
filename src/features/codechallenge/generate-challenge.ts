import { zodToJsonSchema } from "zod-to-json-schema";

import generateStructuredOutput from "@/lib/openai/generate-structured-output";

import { ChallengeData, challengeSchema } from "./validation";

const jsonSchema = zodToJsonSchema(challengeSchema)

export async function generateChallenge(
  title: string, 
  topics: string
): Promise<ChallengeData> {
  const prompt = `
  Create a coding challenge.

  STRICT REQUIREMENTS:
  - Return EXACTLY 3 test cases
  - Each test case MUST include:
    - input (string)
    - expectedOutput (string)
  - Do NOT include extra fields
  - Output must strictly match the schema

  Test case rules:
  1. Normal case
  2. Edge case
  3. Tricky or corner case

  Ensure:
  - Outputs match the solution exactly
  - No extra whitespace
  - Deterministic results

  Title: ${title}
  Topics: ${topics}`;

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      
      const response = await generateStructuredOutput({
        formatSchema: jsonSchema,
        instructions:
          "You are a coding challenge generator for a coding education platform.",
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
