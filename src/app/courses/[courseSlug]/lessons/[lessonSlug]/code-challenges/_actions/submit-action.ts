"use server";
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

  const submission = await saveSubmission({
    challengeId,
    userCode,
  });

  return submission;
}
