"use server";

import { redirect } from "next/navigation";

import requireCurrentAccount from "@/features/identity/actions/require-current-account";
import getCourse from "@/features/learning/get-course";
import getLesson from "@/features/learning/get-lesson";
import onboard from "@/features/onboarding/onboard";
import buildQuizContext from "@/features/quiz/build-quiz-context";
import saveQuiz from "@/features/quiz/data/save-quiz";
import generateQuiz from "@/features/quiz/generate-quiz";

export default async function generateDefaultQuizAction(
  courseSlug: string,
  lessonSlug: string,
) {
  const course = await getCourse(courseSlug);
  const { id: learnerId } = await requireCurrentAccount();
  const { nextQuestion } = await onboard(course.id, learnerId);

  if (nextQuestion) {
    const currentPath = `/courses/${course.slug}/lessons/${lessonSlug}/intro`;
    redirect(
      `/courses/${course.slug}/onboarding?returnTo=${encodeURIComponent(currentPath)}`,
    );
  }

  const lesson = await getLesson(course.id, lessonSlug);
  const context = buildQuizContext(lesson, {
    extraInstructions: `Course: ${courseSlug}, Lesson: ${lessonSlug}`,
    questionCount: 10,
    quizTitle: lesson.title,
  });

  const generatedQuiz = await generateQuiz(context);
  const savedQuiz = await saveQuiz({
    lessonId: lesson.id,
    quiz: generatedQuiz,
  });

  if (!savedQuiz) {
    throw new Error("Failed to save quiz.");
  }

  redirect(
    `/courses/${course.slug}/lessons/${lessonSlug}/quizzes/${savedQuiz.id}`,
  );
}
