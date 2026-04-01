import { getOrGenerateLessonArticle } from "@/features/article/generate-article";
import requireCurrentAccount from "@/features/identity/actions/require-current-account";
import getCourse from "@/features/learning/get-course";
import getLesson from "@/features/learning/get-lesson";

type Params = Promise<{ courseSlug: string; lessonSlug: string }>;

export async function GET(_request: Request, { params }: { params: Params }) {
  const [{ courseSlug, lessonSlug }] = await Promise.all([
    params,
    requireCurrentAccount(),
  ]);

  const course = await getCourse(courseSlug);
  const lesson = await getLesson(course.id, lessonSlug);

  const article = await getOrGenerateLessonArticle(lesson.id, course.id);

  return new Response(JSON.stringify(article), {
    headers: { "Content-Type": "application/json" },
  });
}
