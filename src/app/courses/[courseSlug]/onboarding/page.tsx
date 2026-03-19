import { redirect } from "next/navigation";

import requireCurrentAccount from "@/features/identity/actions/require-current-account";
import getCourse from "@/features/learning/get-course";
import getCurrentLesson from "@/features/learning/get-current-lesson";
import onboard from "@/features/onboarding/onboard";

import { submitAnswer } from "./_actions/submit-answer";
import { StreamingDescription } from "./_components/streaming-description";

const validateReturnTo = (path: string | undefined) => {
  if (typeof path !== "string") return null;

  const isSitePath = path.startsWith("/") && !path.startsWith("//");

  return isSitePath ? path : null;
};

export default async function OnboardingPage({
  params,
  searchParams,
}: {
  params: Promise<{
    courseSlug: string;
  }>;
  searchParams: Promise<{
    returnTo?: string;
  }>;
}) {
  const { courseSlug } = await params;
  const course = await getCourse(courseSlug);

  const { returnTo: rawReturnTo } = await searchParams;
  const returnTo = validateReturnTo(rawReturnTo);

  const currentPath = returnTo
    ? `/courses/${course.slug}/onboarding?returnTo=${encodeURIComponent(returnTo)}`
    : `/courses/${course.slug}/onboarding`;

  const formAction = submitAnswer.bind(null, currentPath);

  const { id: learnerId } = await requireCurrentAccount();
  const { nextQuestion, questionCount } = await onboard(course.id, learnerId);

  if (!nextQuestion) {
    if (returnTo) redirect(returnTo);

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
