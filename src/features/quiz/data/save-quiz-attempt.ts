"use server";

import "server-only";

import getClient from "@/lib/prisma/get-client";

import type { QuizFeedback, QuizSubmission } from "../types";

import resolveSubmittedAnswerToDbIds from "../mappers/resolve-submitted-answer-to-db-ids";

type SaveQuizAttemptInput = {
  feedback: QuizFeedback;
  learnerId: string;
  lessonId: string;
  score: number;
  submission: QuizSubmission;
  totalQuestions: number;
};

export default async function saveQuizAttempt({
  feedback,
  learnerId,
  lessonId,
  score,
  submission,
  totalQuestions,
}: SaveQuizAttemptInput) {
  const prisma = getClient();
  const quizId = submission.quiz.id;

  const persistedQuiz = await prisma.quiz.findUnique({
    include: {
      questions: {
        include: {
          options: {
            orderBy: { position: "asc" },
          },
        },
        orderBy: { position: "asc" },
      },
    },
    where: { id: quizId },
  });

  if (!persistedQuiz) {
    throw new Error("Quiz not found.");
  }

  return prisma.$transaction(async (tx) => {
    const attempt = await tx.quizAttempt.create({
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

    const attemptAnswers = submission.answers.map((answer) => {
      const resolved = resolveSubmittedAnswerToDbIds(persistedQuiz, answer);

      const questionFeedback = feedback.questionFeedback.find(
        (item) => item.questionId === answer.questionId,
      );

      return {
        attemptId: attempt.id,
        feedback: questionFeedback?.feedback ?? null,
        isCorrect: questionFeedback?.isCorrect ?? false,
        questionId: resolved.questionId,
        selectedOptionId: resolved.selectedOptionId,
      };
    });

    await tx.quizAttemptAnswer.createMany({
      data: attemptAnswers,
    });

    return attempt;
  });
}
