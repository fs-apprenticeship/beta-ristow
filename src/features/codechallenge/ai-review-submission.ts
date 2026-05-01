import generateStructuredOutput from "@/lib/openai/generate-structured-output";
import getClient from "@/lib/prisma/get-client";

import { SubmissionReview, submissionReviewSchema } from "./validation";

const jsonSchema = submissionReviewSchema;

export async function aiReviewSubmission({
  challengeId,
  userCode,
}: {
  challengeId: string;
  userCode: string;
}): Promise<SubmissionReview> {
  const prisma = getClient();

  // Fetch challenge context
  const challenge = await prisma.challenge.findUniqueOrThrow({
    select: {
      prompt: true,
    },
    where: { id: challengeId },
  });

  const prompt = `
You are a senior software engineer reviewing a coding challenge submission.

You will be given:
- A coding problem
- A user's solution

Your task:
1. Determine if the solution is correct
2. Provide clear, actionable feedback

STRICT RULES:
- Do NOT mention test cases
- Do NOT assume execution environment details
- Focus on logic correctness, edge cases, and clarity
- Be strict but fair
- If anything important is missing or incorrect, set correct = false

### PROBLEM
${challenge.prompt}

### USER CODE
\`\`\`
${userCode}
\`\`\`
    `;

  const result = await generateStructuredOutput({
    formatSchema: jsonSchema,
    instructions:
      "You are a strict but fair code reviewer for a coding education platform.",
    prompt,
  });

  return submissionReviewSchema.parse(result);
}
