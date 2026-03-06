import getCourse from "@/features/learning/get-course";
import getLesson from "@/features/learning/get-lesson";

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
  const lesson = await getLesson(course.id, lessonSlug);

  return (
    <main>
      <h1>{course.title}</h1>
      <h2>{lesson.title}</h2>
    </main>
  );
}
