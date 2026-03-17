import { redirect } from "next/navigation";

import requireCurrentAccount from "@/features/identity/actions/require-current-account";
import getCourse from "@/features/learning/get-course";
import getLesson from "@/features/learning/get-lesson";
import onboard from "@/features/onboarding/onboard";
import { setCookie } from "@/lib/cookie-store";

export const dynamic = "force-dynamic";

export default async function LessonPage({
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
    const currentPath = `/courses/${course.slug}/lessons/${lessonSlug}`;

    await setCookie("afterOnboardingPath", currentPath);
    redirect(`/courses/${course.slug}/onboarding`);
  }

  const lesson = await getLesson(course.id, lessonSlug);

  return (
    <main>
      <h1>{course.title}</h1>
      <h2>{lesson.title}</h2>
    </main>
  );
}
