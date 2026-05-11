import { redirect } from "next/navigation";

import requireCurrentAccount from "@/features/identity/actions/require-current-account";
import getCourse from "@/features/learning/get-course";
import getLesson from "@/features/learning/get-lesson";
import onboard from "@/features/onboarding/onboard";
import buildReflectionContext from "@/features/reflection/build-reflection-context";
import ReflectionSession from "@/features/reflection/components/reflection-session";
import generateReflection from "@/features/reflection/generate-reflection-questions";

export const dynamic = "force-dynamic";

export default async function LessonReflectionPage({
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
    const currentPath = `/courses/${course.slug}/lessons/${lessonSlug}/reflection`;
    redirect(
      `/courses/${course.slug}/onboarding?returnTo=${encodeURIComponent(currentPath)}`,
    );
  }

  const lesson = await getLesson(course.id, lessonSlug);
  const context = buildReflectionContext(lesson);
  const reflectionQuestions = await generateReflection(context);

  return (
    <main>
      <ReflectionSession
        context={context}
        reflectionQuestions={reflectionQuestions}
      />
    </main>
  );
}
