import getClient from "@/lib/prisma/get-client";

export default async function getLesson(courseId: string, lessonSlug: string) {
  const prisma = getClient();

  return prisma.lesson.findUniqueOrThrow({
    where: {
      courseId_slug: {
        courseId,
        slug: lessonSlug,
      },
    },
  });
}
