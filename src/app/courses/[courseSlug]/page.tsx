import { redirect } from "next/navigation";

import requireCurrentAccount from "@/features/identity/actions/require-current-account";
import getAllLessons from "@/features/learning/get-all-lessons";
import getCourse from "@/features/learning/get-course";
import onboard from "@/features/onboarding/onboard";

export const dynamic = "force-dynamic";

export default async function CoursePage({
  params,
}: {
  params: Promise<{ courseSlug: string }>;
}) {
  const { courseSlug } = await params;
  const course = await getCourse(courseSlug);
  const { id: learnerId } = await requireCurrentAccount();
  const { nextQuestion } = await onboard(course.id, learnerId);

  if (nextQuestion) {
    redirect(`/courses/${course.slug}/onboarding`);
  }

  const lessons = await getAllLessons(course.id);

  return (
    <main>
      <h1>{course.title}</h1>
      <h2>Lessons</h2>
      <ul>
        {lessons.map((lesson) => (
          <li key={lesson.id}>
            <a href={`/courses/${courseSlug}/lessons/${lesson.slug}/intro`}>
              {lesson.title}
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
}
