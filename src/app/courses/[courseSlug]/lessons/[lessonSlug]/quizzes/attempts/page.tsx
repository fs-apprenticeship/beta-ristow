import { redirect } from "next/navigation";

import requireCurrentAccount from "@/features/identity/actions/require-current-account";
import getCourse from "@/features/learning/get-course";
import getLesson from "@/features/learning/get-lesson";
import onboard from "@/features/onboarding/onboard";
import QuizAttemptListView from "@/features/quiz/components/quiz-attempt-list-view";
import getQuizAttempts from "@/features/quiz/data/get-quiz-attempts";

export const dynamic = "force-dynamic";

export default async function QuizAttemptsPage({
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
    const currentPath = `/courses/${course.slug}/lessons/${lessonSlug}/quizzes/attempts`;

    redirect(
      `/courses/${course.slug}/onboarding?returnTo=${encodeURIComponent(
        currentPath,
      )}`,
    );
  }

  const lesson = await getLesson(course.id, lessonSlug);
  const attempts = await getQuizAttempts(lesson.id, learnerId);

  return (
    <main className="px-4 py-8">
      <QuizAttemptListView attempts={attempts} />
    </main>
  );
}
