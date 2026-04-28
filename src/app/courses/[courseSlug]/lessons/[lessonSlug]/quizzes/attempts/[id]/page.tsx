import { notFound, redirect } from "next/navigation";

import requireCurrentAccount from "@/features/identity/actions/require-current-account";
import getCourse from "@/features/learning/get-course";
import getLesson from "@/features/learning/get-lesson";
import onboard from "@/features/onboarding/onboard";
import QuizAttemptDetailView from "@/features/quiz/components/quiz-attempt-detail-view";
import getQuizAttemptById from "@/features/quiz/data/get-quiz-attempt-by-id";

export const dynamic = "force-dynamic";

export default async function QuizAttemptDetailPage({
  params,
}: {
  params: Promise<{
    attemptId: string;
    courseSlug: string;
    lessonSlug: string;
  }>;
}) {
  const { attemptId, courseSlug, lessonSlug } = await params;

  const course = await getCourse(courseSlug);
  const { id: learnerId } = await requireCurrentAccount();
  const { nextQuestion } = await onboard(course.id, learnerId);

  if (nextQuestion) {
    const currentPath = `/courses/${course.slug}/lessons/${lessonSlug}/quizzes/attempts/${attemptId}`;

    redirect(
      `/courses/${course.slug}/onboarding?returnTo=${encodeURIComponent(
        currentPath,
      )}`,
    );
  }

  await getLesson(course.id, lessonSlug);

  const attempt = await getQuizAttemptById(attemptId, learnerId);

  if (!attempt) {
    notFound();
  }

  return (
    <main className="px-4 py-8">
      <QuizAttemptDetailView attempt={attempt} />
    </main>
  );
}
