import { redirect } from "next/navigation";

import requireCurrentAccount from "@/features/identity/actions/require-current-account";
import getCourse from "@/features/learning/get-course";
import getLesson from "@/features/learning/get-lesson";
import onboard from "@/features/onboarding/onboard";
import buildQuizContext from "@/features/quiz/build-quiz-context";
import QuizSession from "@/features/quiz/components/quiz-session";
import saveQuiz from "@/features/quiz/data/save-quiz";
import generateQuiz from "@/features/quiz/generate-quiz";
import mapQuizToUIQuiz from "@/features/quiz/mappers/map-quiz-to-ui-quiz";

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
  const generatedQuiz = await generateQuiz(context);

  const savedQuiz = await saveQuiz({
    lessonId: lesson.id,
    quiz: generatedQuiz,
  });

  if (!savedQuiz) {
    throw new Error("Failed to save quiz.");
  }

  const quiz = mapQuizToUIQuiz(savedQuiz);

  return (
    <main>
      <QuizSession
        context={context}
        learnerId={learnerId}
        lessonId={lesson.id}
        quiz={quiz}
      />
    </main>
  );
}
