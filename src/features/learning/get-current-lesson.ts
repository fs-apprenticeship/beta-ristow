import type { Course } from "@/lib/prisma/types";

import getClient from "@/lib/prisma/get-client";

// NOTE: this is a placeholder until lesson ordering & learner progress are
// implemented; i.e. this will probably accept a learnerId as well.
//
export default async function getCurrentLesson(course: Course) {
  const prisma = getClient();

  return prisma.lesson.findFirstOrThrow({
    orderBy: { createdAt: "asc" },
    where: { courseId: course.id },
  });
}
