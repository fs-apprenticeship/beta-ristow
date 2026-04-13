"use server";

import type { QuizFeedback, QuizSubmission } from "../types";

import generateQuizFeedback from "../generate-quiz-feedback";
import persistQuizFeedback from "./persist-quiz-feedback";

type SubmitQuizInput = {
  learnerId: string;
  lessonId: string;
  submission: QuizSubmission;
};

export default async function submitQuiz({
  learnerId,
  lessonId,
  submission,
}: SubmitQuizInput): Promise<
  QuizFeedback & { score: number; totalQuestions: number }
> {
  const feedback = await generateQuizFeedback(submission);

  const answeredCorrectly = feedback.questionFeedback.filter(
    (item) => item.isCorrect === true,
  ).length;

  const totalQuestions = submission.quiz.questions.length;

  const score = Math.round((answeredCorrectly / totalQuestions) * 100);

  const result = {
    ...feedback,
    score,
    totalQuestions,
  };

  await persistQuizFeedback({
    feedback,
    learnerId,
    lessonId,
    score,
    submission,
    totalQuestions,
  });

  return result;
}
