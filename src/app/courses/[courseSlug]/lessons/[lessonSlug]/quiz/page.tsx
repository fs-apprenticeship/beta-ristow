import { redirect } from "next/navigation";

import requireCurrentAccount from "@/features/identity/actions/require-current-account";
import getCourse from "@/features/learning/get-course";
import getLesson from "@/features/learning/get-lesson";
import onboard from "@/features/onboarding/onboard";
import buildQuizContext from "@/features/quiz/build-quiz-context";
import QuizForm from "@/features/quiz/components/quiz-form";
import generateQuiz from "@/features/quiz/generate-quiz";

export const dynamic = "force-dynamic";

export default async function LessonQuizPage({
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
    const currentPath = `/courses/${course.slug}/lessons/${lessonSlug}/quiz`;
    redirect(
      `/courses/${course.slug}/onboarding?returnTo=${encodeURIComponent(currentPath)}`,
    );
  }

  const lesson = await getLesson(course.id, lessonSlug);
  const context = buildQuizContext(lesson);
  const quiz = await generateQuiz(context);

  return (
    <main>
      <h1>{quiz.title}</h1>
      <QuizForm quiz={quiz} />
    </main>
  );
}
