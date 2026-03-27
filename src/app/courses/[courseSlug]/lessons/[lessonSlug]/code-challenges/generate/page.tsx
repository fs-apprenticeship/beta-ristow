import { generateChallengeAction } from "../_actions/generage-challenge-action";
import { SubmitButton } from "../_components/submit-button";

export default async function GenerateChallengePage({
  params,
}: {
  params: Promise<{
    courseSlug: string;
    lessonSlug: string;
  }>;
}) {
  const { courseSlug, lessonSlug } = await params;

  const formAction = generateChallengeAction.bind(null, courseSlug, lessonSlug);

  return (
    <main className="container">
      <h1>Generate New Challenge</h1>

      <form action={formAction}>
        <label>
          Title
          <input
            name="title"
            placeholder="Array Sorting Challenge"
            required
            type="text"
          />
        </label>

        <label>
          Topics
          <input
            name="topics"
            placeholder="arrays, loops"
            required
            type="text"
          />
        </label>

        <SubmitButton pendingText="Generating...">
          Generate Challenge
        </SubmitButton>
      </form>
    </main>
  );
}
