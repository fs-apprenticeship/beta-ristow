import requireCurrentAccount from "@/features/identity/actions/require-current-account";
import generateArticle from "@/features/learning/generate-article";
import getCourse from "@/features/learning/get-course";
import getLesson from "@/features/learning/get-lesson";
import createStreamResponse from "@/lib/stream/create-stream-response";

type Params = Promise<{ courseSlug: string; lessonSlug: string }>;

export async function GET(request: Request, { params }: { params: Params }) {
  const [{ courseSlug, lessonSlug }] = await Promise.all([
    params,
    requireCurrentAccount(),
  ]);

  const course = await getCourse(courseSlug);
  const lesson = await getLesson(course.id, lessonSlug);

  return createStreamResponse(generateArticle(lesson.id, course.id));
}
