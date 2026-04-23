"use server";

import { evaluateChallengeAction } from "./evaluate-challenge-action";
import { saveSubmission } from "@/features/codechallenge/save-submission";

export async function submitChallengeAction(
  challengeId: string,
  userCode: string,
) {
  if (!challengeId) {
    throw new Error("Challenge ID is required");
  }

  if (!userCode) {
    throw new Error("User code is required");
  }

  const evaluation = await evaluateChallenge(challengeId, userCode);

  const submission = await saveSubmission({
    challengeId,
    correct: evaluation.correct,
    feedback: evaluation.feedback,
    userCode,
  });

  return submission;
}
