"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import requireCurrentAccount from "@/features/identity/actions/require-current-account";
import getCourse from "@/features/learning/get-course";
import getLesson from "@/features/learning/get-lesson";
import onboard from "@/features/onboarding/onboard";
import buildQuizContext from "@/features/quiz/build-quiz-context";
import saveQuiz from "@/features/quiz/data/save-quiz";
import generateQuiz from "@/features/quiz/generate-quiz";

const GenerateQuizFormSchema = z.object({
  instructions: z.string().trim().max(1000).optional(),
  questionCount: z.coerce.number().int().min(5).max(50),
  title: z.string().trim().max(120).optional(),
});

type GenerateQuizActionParams = {
  courseSlug: string;
  lessonSlug: string;
};

export default async function generateQuizAction(
  params: GenerateQuizActionParams,
  formData: FormData,
) {
  const input = GenerateQuizFormSchema.parse({
    instructions: formData.get("instructions"),
    questionCount: formData.get("questionCount"),
    title: formData.get("title"),
  });

  const course = await getCourse(params.courseSlug);
  const { id: learnerId } = await requireCurrentAccount();
  const { nextQuestion } = await onboard(course.id, learnerId);

  if (nextQuestion) {
    const currentPath = `/courses/${course.slug}/lessons/${params.lessonSlug}/quizzes/generate`;

    redirect(
      `/courses/${course.slug}/onboarding?returnTo=${encodeURIComponent(
        currentPath,
      )}`,
    );
  }

  const lesson = await getLesson(course.id, params.lessonSlug);
  const context = buildQuizContext(lesson, {
    extraInstructions: input.instructions || undefined,
    questionCount: input.questionCount || undefined,
    quizTitle: input.title || undefined,
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
    `/courses/${course.slug}/lessons/${params.lessonSlug}/quizzes/${savedQuiz.id}`,
  );
}
