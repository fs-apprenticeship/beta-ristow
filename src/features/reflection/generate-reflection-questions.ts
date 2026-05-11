import { z } from "zod";

import generateText from "@/lib/openai/generate-text";
import parseJsonResponse from "@/lib/openai/parse-json-response";

import type { GeneratedReflection, ReflectionContext } from "./types.js";

const reflectionQuestionSchema = z.object({
  id: z.string(),
  prompt: z.string(),
});

const generatedReflectionSchema = z.object({
  questions: z.array(reflectionQuestionSchema).min(1),
  title: z.string(),
});

export default async function generateReflection(
  context: ReflectionContext,
): Promise<GeneratedReflection> {
  const instructions = `
You generate open-ended questions for reflection form in strict JSON format.

Rules:
- Return JSON only.
- Do not wrap the JSON in markdown.
- Create exactly ${context.questionCount ?? 5} questions.
- Use question ids like "q1", "q2", "q3".
- Questions must be based only on the provided lesson content.
- Keep wording clear and concise.
- Do not include answers or explanations.
`;

  const prompt = `
Generate a reflection form from this lesson context.

Return JSON in exactly this shape:
{
  "title": "string",
  "questions": [
    {
      "id": "q1",
      "prompt": "string",
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

  const validatedReflection = generatedReflectionSchema.safeParse(parsed);

  if (!validatedReflection.success) {
    throw new Error(
      "Reflection generator returned an invalid reflection shape.",
    );
  }

  return validatedReflection.data;
}
