import { notFound, redirect } from "next/navigation";

import requireCurrentAccount from "@/features/identity/actions/require-current-account";
import getCourse from "@/features/learning/get-course";
import getLesson from "@/features/learning/get-lesson";
import onboard from "@/features/onboarding/onboard";
import getPersistedQuiz from "@/features/quiz/actions/get-persisted-quiz";
import buildQuizContext from "@/features/quiz/build-quiz-context";
import QuizSession from "@/features/quiz/components/quiz-session";

export const dynamic = "force-dynamic";

export default async function PersistedQuizPage({
  params,
}: {
  params: Promise<{
    courseSlug: string;
    lessonSlug: string;
    quizId: string;
  }>;
}) {
  const { courseSlug, lessonSlug, quizId } = await params;

  const course = await getCourse(courseSlug);
  const { id: learnerId } = await requireCurrentAccount();
  const { nextQuestion } = await onboard(course.id, learnerId);

  if (nextQuestion) {
    const currentPath = `/courses/${course.slug}/lessons/${lessonSlug}/quizzes/${quizId}`;

    redirect(
      `/courses/${course.slug}/onboarding?returnTo=${encodeURIComponent(
        currentPath,
      )}`,
    );
  }

  const lesson = await getLesson(course.id, lessonSlug);
  const persistedQuiz = await getPersistedQuiz(quizId);

  if (!persistedQuiz) {
    notFound();
  }

  const context = buildQuizContext(lesson);

  return (
    <main>
      <QuizSession
        context={context}
        courseSlug={courseSlug}
        learnerId={learnerId}
        lessonId={lesson.id}
        lessonSlug={lessonSlug}
        quiz={persistedQuiz.quiz}
      />
    </main>
  );
}
