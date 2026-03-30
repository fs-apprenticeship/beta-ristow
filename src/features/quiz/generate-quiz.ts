import { z } from "zod";

import generateText from "@/lib/openai/generate-text";
import parseJsonResponse from "@/lib/openai/parse-json-response";

import type { GeneratedQuiz, QuizContext } from "./types";

const quizOptionSchema = z.object({
  id: z.string(),
  text: z.string(),
});

const quizQuestionSchema = z.object({
  id: z.string(),
  options: z.array(quizOptionSchema).length(4),
  prompt: z.string(),
});

const generatedQuizSchema = z.object({
  questions: z.array(quizQuestionSchema).min(1),
  title: z.string(),
});

export default async function generateQuiz(
  context: QuizContext,
): Promise<GeneratedQuiz> {
  const instructions = `
You generate multiple-choice quizzes in strict JSON format.

Rules:
- Return JSON only.
- Do not wrap the JSON in markdown.
- Create exactly ${context.questionCount ?? 5} questions.
- Each question must have exactly 4 options.
- Use question ids like "q1", "q2", "q3".
- Use option ids like "a", "b", "c", "d".
- Questions must be based only on the provided lesson content.
- Keep wording clear and concise.
- Do not include answers or explanations.
`;

  const prompt = `
Generate a quiz from this lesson context.

Return JSON in exactly this shape:
{
  "title": "string",
  "questions": [
    {
      "id": "q1",
      "prompt": "string",
      "options": [
        { "id": "a", "text": "string" },
        { "id": "b", "text": "string" },
        { "id": "c", "text": "string" },
        { "id": "d", "text": "string" }
      ]
    }
  ]
}

Lesson title:
${context.title}

Lesson content:
${context.content}
`;

  const result = await generateText({
    instructions,
    prompt,
  });

  const parsed = parseJsonResponse(result);

  const validatedQuiz = generatedQuizSchema.safeParse(parsed);

  if (!validatedQuiz.success) {
    throw new Error("Quiz generator returned an invalid quiz shape.");
  }

  return validatedQuiz.data;
}
