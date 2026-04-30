import { getOrGenerateLessonArticle } from "@/features/article/generate-article";
import requireCurrentAccount from "@/features/identity/actions/require-current-account";
import getCourse from "@/features/learning/get-course";
import getLesson from "@/features/learning/get-lesson";

import { LessonArticleBody } from "./lesson-article-body";

export const dynamic = "force-dynamic";

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ courseSlug: string; lessonSlug: string }>;
}) {
  const { courseSlug, lessonSlug } = await params;
  await requireCurrentAccount();

  const course = await getCourse(courseSlug);
  const lesson = await getLesson(course.id, lessonSlug);
  const article = await getOrGenerateLessonArticle(lesson.id, course.id);

  return (
    <main className="container">
      <header
        style={{
          padding: "var(--pico-spacing) 0 calc(var(--pico-spacing) * 3)",
          textAlign: "center",
        }}
      >
        <h1>{lesson.title}</h1>
        <p>
          <small>{course.title}</small>
        </p>
      </header>

      <div style={{ marginBottom: "calc(var(--pico-spacing) * 4)" }}>
        <LessonArticleBody article={article} />
      </div>
    </main>
  );
}
