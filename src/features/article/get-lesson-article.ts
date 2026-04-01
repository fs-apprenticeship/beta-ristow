import getClient from "@/lib/prisma/get-client";

export type LessonArticleContent = {
  conclusion: string;
  intro: string;
  sections: { content: string; heading: string }[];
};

export default async function getLessonArticle(
  lessonId: string,
): Promise<LessonArticleContent | null> {
  const prisma = getClient();

  const lesson = await prisma.lesson.findUnique({
    select: { lessonArticle: { select: { content: true } } },
    where: { id: lessonId },
  });

  const raw = lesson?.lessonArticle?.content;
  if (raw === undefined || raw === null) return null;
  return JSON.parse(JSON.stringify(raw)) as LessonArticleContent;
}
