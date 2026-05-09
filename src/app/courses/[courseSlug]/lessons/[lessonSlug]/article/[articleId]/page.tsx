import { notFound } from "next/navigation";

import { getLessonArticleById } from "@/features/article/get-lesson-article";
import requireCurrentAccount from "@/features/identity/actions/require-current-account";
import getCourse from "@/features/learning/get-course";
import getLesson from "@/features/learning/get-lesson";

import { LessonArticleBody } from "./lesson-article-body";

export const dynamic = "force-dynamic";

export default async function ArticlePage({
  params,
}: {
  params: Promise<{
    articleId: string;
    courseSlug: string;
    lessonSlug: string;
  }>;
}) {
  const { articleId, courseSlug, lessonSlug } = await params;
  await requireCurrentAccount();

  const course = await getCourse(courseSlug);
  const lesson = await getLesson(course.id, lessonSlug);
  const article = await getLessonArticleById(articleId);

  if (!article) notFound();

  return (
    <main className="container">
      <header
        style={{
          padding: "var(--pico-spacing) 0 calc(var(--pico-spacing) * 3)",
          textAlign: "center",
        }}
      >
        <h1>{article.title}</h1>
        <p>
          <small>{lesson.title}</small>
        </p>
      </header>

      <div style={{ marginBottom: "calc(var(--pico-spacing) * 4)" }}>
        <LessonArticleBody article={article} />
      </div>
    </main>
  );
}
