import Link from "next/link";

import { setLessonContentVisibility } from "@/features/article/generate-article";
import requireCurrentAccount from "@/features/identity/actions/require-current-account";
import getCourse from "@/features/learning/get-course";
import getLesson from "@/features/learning/get-lesson";

export const dynamic = "force-dynamic";

export default async function IntroPage({
  params,
}: {
  params: Promise<{ courseSlug: string; lessonSlug: string }>;
}) {
  const { courseSlug, lessonSlug } = await params;
  await requireCurrentAccount();

  const course = await getCourse(courseSlug);
  const lesson = await getLesson(course.id, lessonSlug);

  const articlePath = `/courses/${courseSlug}/lessons/${lessonSlug}/article`;

  const visibility = await setLessonContentVisibility({
    description: lesson.description,
    outcomes: lesson.outcomes,
    title: lesson.title,
  });

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

      {/* articles link */}
      <h3 style={{ marginBottom: "var(--pico-spacing)" }}>Articles</h3>
      <Link href={articlePath} style={{ textDecoration: "none" }}>
        <article style={{ cursor: "pointer", marginBottom: 0 }}>
          <h3 style={{ margin: 0 }}>{lesson.title}</h3>
        </article>
      </Link>

      {/* options visibility: code-challenge, quiz and chat */}
      <h3 style={{ marginBottom: "var(--pico-spacing)" }}>Other options</h3>
      <p>quiz: {String(visibility.quiz)}</p>
      <p>code-challenges: {String(visibility.codeChallenge)}</p>
    </main>
  );
}
