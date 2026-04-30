"use server";

import "server-only";

import getClient from "@/lib/prisma/get-client";

import type { QuizAttemptDetail } from "../types";

export default async function getQuizAttemptById(
  attemptId: string,
  learnerId: string,
): Promise<null | QuizAttemptDetail> {
  const prisma = getClient();

  const attempt = await prisma.quizAttempt.findFirst({
    include: {
      answers: {
        include: {
          question: {
            select: {
              position: true,
              prompt: true,
            },
          },
          selectedOption: {
            select: {
              text: true,
            },
          },
        },
        orderBy: {
          question: {
            position: "asc",
          },
        },
      },
      quiz: {
        select: {
          title: true,
        },
      },
    },
    where: {
      id: attemptId,
      learnerId,
    },
  });

  if (!attempt) {
    return null;
  }

  return {
    answers: attempt.answers.map((answer) => ({
      feedback: answer.feedback,
      id: answer.id,
      isCorrect: answer.isCorrect,
      questionPrompt: answer.question.prompt,
      selectedOptionText: answer.selectedOption.text,
    })),
    createdAt: attempt.createdAt,
    id: attempt.id,
    overallFeedback: attempt.overallFeedback,
    passed: attempt.passed,
    quizTitle: attempt.quiz.title,
    score: attempt.score,
    totalQuestions: attempt.totalQuestions,
  };
}
