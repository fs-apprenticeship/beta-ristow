import getClient from "@/lib/prisma/get-client";

export default async function getCourse(courseSlug: string) {
  const prisma = getClient();

  return prisma.course.findUniqueOrThrow({
    where: { slug: courseSlug },
  });
}
