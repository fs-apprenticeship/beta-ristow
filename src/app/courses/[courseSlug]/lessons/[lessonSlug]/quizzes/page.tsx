import Link from "next/link";
import { redirect } from "next/navigation";

import requireCurrentAccount from "@/features/identity/actions/require-current-account";
import getCourse from "@/features/learning/get-course";
import getLesson from "@/features/learning/get-lesson";
import onboard from "@/features/onboarding/onboard";
import QuizListView from "@/features/quiz/components/quiz-list-view";
import getQuizzes from "@/features/quiz/data/get-quizzes";
import { QuizListItem } from "@/features/quiz/types";

export const dynamic = "force-dynamic";

export default async function LessonQuizzesPage({
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

  const quizList: QuizListItem[] = await getQuizzes(lesson.id);

  return (
    <main>
      <div style={{ marginBottom: "1rem" }}>
        <Link href="./quizzes/generate">New Quiz</Link>
      </div>

      <QuizListView quizList={quizList} />
    </main>
  );
}
