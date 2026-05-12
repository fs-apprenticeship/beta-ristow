import { generateLessonArticle } from "@/features/article/generate-article";
import getLessonArticles from "@/features/article/get-lesson-article";
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

  const articles = await getLessonArticles(lesson.id);

  return new Response(JSON.stringify(articles), {
    headers: {
      "Cache-Control": "no-store",
      "Content-Type": "application/json",
    },
  });
}

export async function POST(_request: Request, { params }: { params: Params }) {
  const [{ courseSlug, lessonSlug }] = await Promise.all([
    params,
    requireCurrentAccount(),
  ]);

  const course = await getCourse(courseSlug);
  const lesson = await getLesson(course.id, lessonSlug);

  // TEMPORARY LIMIT OF 3 ARTICLES PER LESSON -> Server returns 403 to limit more generations
  const articles = await getLessonArticles(lesson.id);
  if (articles.length >= 3) {
    return new Response("Article limit reached", { status: 403 });
  }

  const article = await generateLessonArticle(lesson.id, course.id);

  return new Response(JSON.stringify(article), {
    headers: { "Content-Type": "application/json" },
    status: 201,
  });
}
