import { redirect } from "next/navigation";

import requireCurrentAccount from "@/features/identity/actions/require-current-account";
import getCourse from "@/features/learning/get-course";
import getCurrentLesson from "@/features/learning/get-current-lesson";
import onboard from "@/features/onboarding/onboard";
import { deleteCookie } from "@/lib/cookie-store";

import { submitAnswer } from "./_actions/submit-answer";
import { StreamingDescription } from "./_components/streaming-description";

export default async function OnboardingPage({
  params,
}: {
  params: Promise<{
    courseSlug: string;
  }>;
}) {
  const { courseSlug } = await params;
  const course = await getCourse(courseSlug);

  const { id: learnerId } = await requireCurrentAccount();
  const { nextQuestion, questionCount } = await onboard(course.id, learnerId);
  const formAction = submitAnswer.bind(null, course.slug);

  if (!nextQuestion) {
    const afterOnboardingPath = await deleteCookie("afterOnboardingPath");

    if (afterOnboardingPath) {
      redirect(afterOnboardingPath);
    }

    const lesson = await getCurrentLesson(course);
    redirect(`/courses/${course.slug}/lessons/${lesson.slug}`);
  }

  return (
    <main>
      <h2>{course.title}</h2>
      <progress max={questionCount} value={nextQuestion.position} />
      <form action={formAction}>
        <label htmlFor="answer">{nextQuestion.question}</label>
        <p id="question-description">
          {nextQuestion.isGenerated ? (
            <StreamingDescription questionId={nextQuestion.id} />
          ) : (
            nextQuestion.description
          )}
        </p>
        <input name="id" type="hidden" value={nextQuestion.id} />
        <textarea
          aria-describedby="question-description"
          id="answer"
          name="answer"
          placeholder="Type your response here."
          required
          rows={6}
        />
        <button type="submit">Continue</button>
      </form>
    </main>
  );
}
