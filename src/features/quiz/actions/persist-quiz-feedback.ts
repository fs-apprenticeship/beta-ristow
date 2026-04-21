"use server";

import "server-only";

import getClient from "@/lib/prisma/get-client";

import type { QuizFeedback, QuizSubmission } from "../types";

type PersistQuizFeedbackInput = {
  feedback: QuizFeedback;
  learnerId: string;
  lessonId: string;
  score: number;
  submission: QuizSubmission;
  totalQuestions: number;
};

export default async function persistQuizFeedback({
  feedback,
  learnerId,
  lessonId,
  score,
  submission,
  totalQuestions,
}: PersistQuizFeedbackInput) {
  const prisma = getClient();

  const quizId = submission.quiz.id;

  const attempt = await prisma.quizAttempt.create({
    data: {
      learnerId,
      lessonId,
      overallFeedback: feedback.overallFeedback,
      passed: feedback.passed ?? false,
      quizId,
      score,
      totalQuestions,
    },
  });

  await prisma.quizAttemptAnswer.createMany({
    data: submission.answers.map((answer) => {
      const questionFeedback = feedback.questionFeedback.find(
        (item) => item.questionId === answer.questionId,
      );

      return {
        attemptId: attempt.id,
        feedback: questionFeedback?.feedback ?? null,
        isCorrect: questionFeedback?.isCorrect ?? false,
        questionId: answer.questionId,
        selectedOptionId: answer.selectedOptionId,
      };
    }),
  });

  return attempt;
}
