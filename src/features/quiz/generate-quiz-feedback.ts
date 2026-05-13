import { z } from "zod";

import generateText from "@/lib/openai/generate-text";
import parseJsonResponse from "@/lib/openai/parse-json-response";

import type { QuizFeedback, QuizSubmission } from "./types";

const questionFeedbackSchema = z.object({
  chosenAnswer: z.string(),
  feedback: z.string(),
  isCorrect: z.boolean().optional(),
  questionId: z.string(),
});

const quizFeedbackSchema = z.object({
  overallFeedback: z.string(),
  questionFeedback: z.array(questionFeedbackSchema),
});

const instructions = `
You evaluate multiple-choice quiz submissions based on lesson content.

Rules:
- Return JSON only.
- Do not include markdown or explanations outside JSON.
- Evaluate answers based only on the provided lesson content and quiz.
- Provide clear and concise feedback.
- For each submitted answer:
  - Return the original questionId exactly as provided.
  - Return the chosenAnswer exactly as provided in User Answers.
  - Indicate whether the selected answer is correct using isCorrect true/false.
  - Provide short feedback explaining why the answer is correct or incorrect.
- Include an overall summary of the learner's performance.
- Do not decide whether the learner passed or failed.
- Do not calculate a score.
- The application calculates pass/fail separately using a passing score of 80%.
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

  const submittedQuestionIds = new Set(
    answers.map((answer) => answer.questionId),
  );

  const returnedQuestionIds = new Set<string>();

  for (const item of validatedFeedback.data.questionFeedback) {
    if (!submittedQuestionIds.has(item.questionId)) {
      throw new Error(
        `Quiz feedback generator returned unknown questionId: ${item.questionId}`,
      );
    }

    if (returnedQuestionIds.has(item.questionId)) {
      throw new Error(
        `Quiz feedback generator returned duplicate questionId: ${item.questionId}`,
      );
    }

    returnedQuestionIds.add(item.questionId);
  }

  return validatedFeedback.data;
}

function generatePrompt({ answers, context, quiz }: QuizSubmission): string {
  const answerDetails = answers.map((answer) => {
    const question = quiz.questions.find(
      (item) => item.id === answer.questionId,
    );

    const selectedOption = question?.options.find(
      (option) => option.id === answer.selectedOptionId,
    );

    return {
      chosenAnswer: selectedOption?.text ?? answer.selectedOptionId,
      questionId: answer.questionId,
      questionPrompt: question?.prompt ?? answer.questionId,
    };
  });

  return `
Evaluate the following quiz submission.

Return JSON in exactly this shape:
{
  "overallFeedback": "string",
  "questionFeedback": [
    {
      "questionId": "string",
      "chosenAnswer": "string",
      "isCorrect": true,
      "feedback": "string"
    }
  ]
}

Important:
- Return each questionId exactly as provided in User Answers.
- Do not replace questionId with question text.
- Return exactly one questionFeedback item for each submitted answer.
- Do not include a passed field.
- Do not calculate a score.
- The application will calculate score and pass/fail using 80% as the passing threshold.

Lesson title:
${context.title}

Lesson content:
${context.content}

Quiz:
${JSON.stringify(quiz, null, 2)}

User Answers:
${JSON.stringify(answerDetails, null, 2)}
`;
}
