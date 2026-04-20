import getLessonArticle from "@/features/article/get-lesson-article";
import requireCurrentAccount from "@/features/identity/actions/require-current-account";
import getCourse from "@/features/learning/get-course";
import getLesson from "@/features/learning/get-lesson";

import LessonArticle from "../article/lesson-article";

export const dynamic = "force-dynamic";

export default async function IntroPage({
  params,
}: {
  params: Promise<{
    courseSlug: string;
    lessonSlug: string;
  }>;
}) {
  const { courseSlug, lessonSlug } = await params;
  await requireCurrentAccount();

  const course = await getCourse(courseSlug);
  const lesson = await getLesson(course.id, lessonSlug);
  const storedArticle = await getLessonArticle(lesson.id);

  return (
    <LessonArticle
      courseSlug={course.slug}
      headerSubtitle={course.title}
      headerTitle={lesson.title}
      initialArticle={storedArticle}
      lessonSlug={lesson.slug}
    />
  );
}
