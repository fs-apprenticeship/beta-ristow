import { redirect } from "next/navigation";

import getLessonArticle from "@/features/article/get-lesson-article";
import requireCurrentAccount from "@/features/identity/actions/require-current-account";
import getCourse from "@/features/learning/get-course";
import getLesson from "@/features/learning/get-lesson";
import onboard from "@/features/onboarding/onboard";

import LessonArticle from "./article/lesson-article";

export const dynamic = "force-dynamic";

export default async function LessonPage({
  params,
}: {
  params: Promise<{
    courseSlug: string;
    lessonSlug: string;
  }>;
}) {
  const { courseSlug, lessonSlug } = await params;
  const course = await getCourse(courseSlug);
  const { id: learnerId } = await requireCurrentAccount();
  const { nextQuestion } = await onboard(course.id, learnerId);

  if (nextQuestion) {
    const currentPath = `/courses/${course.slug}/lessons/${lessonSlug}`;
    redirect(
      `/courses/${course.slug}/onboarding?returnTo=${encodeURIComponent(currentPath)}`,
    );
  }

  const lesson = await getLesson(course.id, lessonSlug);
  const storedArticle = await getLessonArticle(lesson.id);

  return (
    <main>
      <h1>{course.title}</h1>
      <h2>{lesson.title}</h2>
      <LessonArticle
        courseSlug={course.slug}
        initialArticle={storedArticle}
        lessonSlug={lesson.slug}
      />
    </main>
  );
}
