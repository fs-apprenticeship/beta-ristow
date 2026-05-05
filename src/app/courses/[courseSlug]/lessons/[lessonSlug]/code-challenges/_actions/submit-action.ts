"use server";

import { aiReviewSubmission } from "@/features/codechallenge/ai-review-submission";
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

  const review = await aiReviewSubmission({
    challengeId,
    userCode,
  });

  const submission = await saveSubmission({
    challengeId,
    correct: review.correct,
    feedback: review.feedback,
    userCode,
  });

  return submission;
}
