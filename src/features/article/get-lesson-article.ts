import getClient from "@/lib/prisma/get-client";

export type LessonArticleContent = {
  conclusion: string;
  id: string;
  intro: string;
  sections: { content: string; heading: string }[];
  title: null | string;
};

export async function getLessonArticleById(
  id: string,
): Promise<LessonArticleContent | null> {
  const prisma = getClient();

  const article = await prisma.lessonArticle.findUnique({
    select: { content: true, id: true, title: true },
    where: { id },
  });

  if (!article) return null;

  return {
    ...(JSON.parse(JSON.stringify(article.content)) as Omit<
      LessonArticleContent,
      "id" | "title"
    >),
    id: article.id,
    title: article.title ?? null,
  };
}

export default async function getLessonArticles(
  lessonId: string,
): Promise<LessonArticleContent[]> {
  const prisma = getClient();

  const articles = await prisma.lessonArticle.findMany({
    orderBy: { createdAt: "asc" },
    select: { content: true, id: true, title: true },
    where: { lessonId },
  });

  return articles.map((a) => ({
    ...(JSON.parse(JSON.stringify(a.content)) as Omit<
      LessonArticleContent,
      "id" | "title"
    >),
    id: a.id,
    title: a.title ?? null,
  }));
}
