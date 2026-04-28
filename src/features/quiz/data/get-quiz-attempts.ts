"use server";

import "server-only";

import getClient from "@/lib/prisma/get-client";

import type { QuizAttemptListItem } from "../types";

export default async function getQuizAttempts(
  lessonId: string,
  learnerId: string,
): Promise<QuizAttemptListItem[]> {
  const prisma = getClient();

  const attempts = await prisma.quizAttempt.findMany({
    include: {
      quiz: {
        select: {
          title: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    where: {
      learnerId,
      lessonId,
    },
  });

  return attempts.map((attempt) => ({
    createdAt: attempt.createdAt,
    id: attempt.id,
    passed: attempt.passed,
    quizTitle: attempt.quiz.title,
    score: attempt.score,
    totalQuestions: attempt.totalQuestions,
  }));
}
