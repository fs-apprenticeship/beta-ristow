import getClient from "@/lib/prisma/get-client";

const prisma = getClient();

export default async function getQuizzes(lessonId: string) {
  return await prisma?.quiz.findMany({
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
    orderBy: { createdAt: "desc" },
    where: { lessonId },
  });
}
