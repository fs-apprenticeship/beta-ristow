import { notFound } from "next/navigation";

import { getChallengeByIdAction } from "../_actions/get-challenge-action";
import ChallengePageClient from "../_components/challenge-page-client";

interface Params {
  id: string;
}

export default async function ChallengePage({ params }: { params: Params }) {
  const { id } = await params;

  let challenge;
  try {
    challenge = await getChallengeByIdAction(id);
  } catch {
    return notFound();
  }

  return (
    <div className="container">
      {/* Challenge Prompt */}
      <section className="card">
        <h2>Code Challenge</h2>
        <pre
          className="card-body"
          style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
        >
          {challenge.prompt}
        </pre>
      </section>

      {/* Interactive Editor + Run */}
      <ChallengePageClient
        challengeId={challenge.id}
        starterCode={challenge.starterCode ?? ""}
      />
    </div>
  );
}
