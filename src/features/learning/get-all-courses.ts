import getClient from "@/lib/prisma/get-client";

export default async function getCourses() {
  const prisma = getClient();

  return prisma.course.findMany({
    orderBy: { createdAt: "asc" },
  });
}
