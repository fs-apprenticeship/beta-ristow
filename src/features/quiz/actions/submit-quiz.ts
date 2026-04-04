"use server";

import getClient from "@/lib/prisma/get-client";

import type { QuizFeedback, QuizSubmission } from "../types";

import generateQuizFeedback from "../generate-quiz-feedback";

type SubmitQuizInput = {
  learnerId: string;
  lessonId: string;
  submission: QuizSubmission;
};

export default async function submitQuiz({
  learnerId,
  lessonId,
  submission,
}: SubmitQuizInput): Promise<QuizFeedback> {
  const prisma = getClient();

  const feedback = await generateQuizFeedback(submission);

  const answeredCorrectly = feedback.questionFeedback.filter(
    (item) => item.isCorrect === true,
  ).length;

  const totalQuestions = submission.quiz.questions.length;

  const score = Math.round((answeredCorrectly / totalQuestions) * 100);

  const persistedFeedback = {
    ...feedback,
    score,
    totalQuestions,
  };

  await prisma.quizAttempt.create({
    data: {
      learnerId,
      lessonId,
      overallFeedback: feedback.overallFeedback,
      passed: feedback.passed ?? false,
      payload: {
        answers: submission.answers,
        feedback: persistedFeedback,
        quiz: submission.quiz,
      },
      score,
      totalQuestions,
    },
  });

  return persistedFeedback;
}
