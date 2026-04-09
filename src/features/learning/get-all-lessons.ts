import getClient from "@/lib/prisma/get-client";

export default async function getLessons(courseId: string) {
  const prisma = getClient();

  return prisma.lesson.findMany({
    orderBy: { position: "asc" },
    where: { courseId },
  });
}
