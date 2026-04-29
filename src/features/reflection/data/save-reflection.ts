import getClient from "@/lib/prisma/get-client";

import { GeneratedReflection } from "../types";

const prisma = getClient();

type SaveReflectionInput = {
  lessonId: string;
  reflection: GeneratedReflection;
};

export default async function saveReflection({ lessonId, reflection }: SaveReflectionInput) {
  return prisma?.reflection.create({
    data: {
      lessonId,
      questions: {
        create: reflection.questions.map((question, questionIndex) => (
          questionIndex === undefined ? {} : {
          position: questionIndex,
          prompt: question.prompt,
        })),
      },
      title: reflection.title,
    },
  });
}
