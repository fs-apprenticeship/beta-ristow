import { redirect } from "next/navigation";

import requireCurrentAccount from "@/features/identity/actions/require-current-account";
import getCourse from "@/features/learning/get-course";
import getLesson from "@/features/learning/get-lesson";
import onboard from "@/features/onboarding/onboard";
import QuizGenerationForm from "@/features/quiz/components/quiz-generation-form";

import generateQuizAction from "../_actions/generate-quiz-action";

export const dynamic = "force-dynamic";

export default async function GenerateQuizPage({
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
    const currentPath = `/courses/${course.slug}/lessons/${lessonSlug}/quizzes/generate`;

    redirect(
      `/courses/${course.slug}/onboarding?returnTo=${encodeURIComponent(
        currentPath,
      )}`,
    );
  }

  const lesson = await getLesson(course.id, lessonSlug);

  const action = generateQuizAction.bind(null, {
    courseSlug: course.slug,
    lessonSlug,
  });

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-8">
      <QuizGenerationForm action={action} lessonTitle={lesson.title} />
    </main>
  );
}
