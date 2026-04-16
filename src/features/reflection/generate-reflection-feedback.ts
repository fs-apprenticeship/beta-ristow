import { z } from "zod";

import generateText from "@/lib/openai/generate-text";
import parseJsonResponse from "@/lib/openai/parse-json-response";

import type { ReflectionFeedback, ReflectionSubmission } from "./types";

const reflectionFeedbackSchema = z.object({
  overallFeedback: z.string(),
});

export default async function generateReflectionFeedback({
  answers,
  context,
  reflectionQuestions,
}: ReflectionSubmission): Promise<ReflectionFeedback> {
  const prompt = generatePrompt({ answers, context, reflectionQuestions });
  const result = await generateText({ instructions, prompt });

  const parsed = parseJsonResponse(result);

  const validatedFeedback = reflectionFeedbackSchema.safeParse(parsed);

  if (!validatedFeedback.success) {
    throw new Error("Reflection feedback generator returned an invalid shape.");
  }

  return validatedFeedback.data;
}

const instructions = `
You evaluate answers to reflection questions submissions based on lesson content.

Rules:
- Return JSON only.
- Do not include markdown or explanations outside JSON.
- Evaluate answers based only on the provided lesson content.
- Consider all answers together, not in isolation.
- Based on these answers in aggregate within the lesson context provide estimation of overall understanding of the lesson content.
- Limit response to two paragraphs for the feedback.
- Provide a third paragraph with actionable feedback for improvement if needed.
- Be fair and consistent in evaluation.
- Be positive and encouraging but not dishonest. If the answers demonstrate misunderstandings, reflect that in the feedback while still being constructive.
`;

function generatePrompt({ answers, context, reflectionQuestions }: ReflectionSubmission): string {
  const answerDetails = answers.map((answer) => {
    return reflectionQuestions.questions.find(
      (item) => item.id === answer.questionId,
    );
  });

  return `
Evaluate the following reflection submission.

Return JSON in exactly this shape:
{
  "overallFeedback": "string",
}

Lesson title:
${context.title}

Lesson content:
${context.content}

Reflection questions:
${JSON.stringify(reflectionQuestions, null, 2)}

User Answers:
${JSON.stringify(answerDetails, null, 2)}
`;
}