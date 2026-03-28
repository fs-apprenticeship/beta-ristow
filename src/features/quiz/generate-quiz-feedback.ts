import { z } from "zod";

import generateText from "@/lib/openai/generate-text";
import parseJsonResponse from "@/lib/openai/parse-json-response";

import type { QuizFeedback, QuizSubmission } from "./types";

const questionFeedbackSchema = z.object({
  feedback: z.string(),
  isCorrect: z.boolean().optional(),
  questionId: z.string(),
});

const quizFeedbackSchema = z.object({
  overallFeedback: z.string(),
  passed: z.boolean().optional(),
  questionFeedback: z.array(questionFeedbackSchema),
});

const instructions = `
You evaluate multiple-choice quiz submissions based on lesson content.

Rules:
- Return JSON only.
- Do not include markdown or explanations outside JSON.
- Evaluate answers based only on the provided lesson content.
- Provide clear and concise feedback.
- For each question:
  - Indicate whether the answer is correct (true/false).
  - Provide short feedback explaining why.
- Include an overall summary of performance.
- Determine if the quiz is passed or not.
- Be fair and consistent in evaluation.
`;

export default async function generateQuizFeedback({
  answers,
  context,
  quiz,
}: QuizSubmission): Promise<QuizFeedback> {
  const prompt = generatePrompt({ answers, context, quiz });
  const result = await generateText({ instructions, prompt });

  const parsed = parseJsonResponse(result);

  const validatedFeedback = quizFeedbackSchema.safeParse(parsed);

  if (!validatedFeedback.success) {
    throw new Error("Quiz feedback generator returned an invalid shape.");
  }

  return validatedFeedback.data;
}

function generatePrompt({ answers, context, quiz }: QuizSubmission): string {
  return `
Evaluate the following quiz submission.

Return JSON in exactly this shape:
{
  "overallFeedback": "string",
  "passed": true,
  "questionFeedback": [
    {
      "questionId": "q1",
      "isCorrect": true,
      "feedback": "string"
    }
  ]
}

Lesson title:
${context.title}

Lesson content:
${context.content}

Quiz:
${JSON.stringify(quiz, null, 2)}

User Answers:
${JSON.stringify(answers, null, 2)}
`;
}
