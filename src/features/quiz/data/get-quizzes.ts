import getClient from "@/lib/prisma/get-client";

import { QuizListItem } from "../types";

const prisma = getClient();

export default async function getQuizzes(
  lessonId: string,
): Promise<QuizListItem[]> {
  const quizzes = await prisma.quiz.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      _count: {
        select: { questions: true },
      },
      createdAt: true,
      id: true,
      title: true,
    },
    where: { lessonId },
  });

  return quizzes.map((quiz) => ({
    createdAt: quiz.createdAt,
    id: quiz.id,
    questionCount: quiz._count.questions,
    title: quiz.title,
  }));
}
