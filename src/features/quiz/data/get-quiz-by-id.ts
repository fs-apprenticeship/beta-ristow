import getClient from "@/lib/prisma/get-client";

const prisma = getClient();

export default async function getQuizById(quizId: string) {
  return await prisma?.quiz.findUnique({
    include: {
      lesson: {
        include: {
          lessonArticle: true,
        },
      },
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
}