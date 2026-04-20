import getClient from "@/lib/prisma/get-client";

import { GeneratedQuiz } from "../types";

const prisma = getClient();

type SaveQuizInput = {
  lessonId: string;
  quiz: GeneratedQuiz;
};

export default async function saveQuiz({ lessonId, quiz }: SaveQuizInput) {
  return prisma?.quiz.create({
    data: {
      lessonId,
      questions: {
        create: quiz.questions.map((question, questionIndex) => ({
          options: {
            create: question.options.map((option, optionIndex) => ({
              position: optionIndex,
              text: option.text,
            })),
          },
          position: questionIndex,
          prompt: question.prompt,
        })),
      },
      title: quiz.title,
    },
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
  });
}
