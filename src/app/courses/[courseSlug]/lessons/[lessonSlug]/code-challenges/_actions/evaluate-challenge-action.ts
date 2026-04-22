"use server";

import { evaluateChallenge } from "@/features/codechallenge/evaluate-challenge";

import { getChallengeByIdAction } from "./get-challenge-action";

export async function evaluateChallengeAction(
  challengeId: string,
  userCode: string,
) {
  // Handle missing code
  if (!userCode) {
    return { correct: false, feedback: "Missing user code." };
  }

  // Fetch challenge
  let challenge;
  try {
    challenge = await getChallengeByIdAction(challengeId);
  } catch {
    return { correct: false, feedback: "Challenge not found" };
  }

  // Evaluate code
  try {
    const result = await evaluateChallenge(
      challenge.prompt,
      userCode,
      challenge.language,
    );
    return result;
  } catch (err) {
    console.error("Challenge evaluation error:", err);
    return { correct: false, feedback: "Server error during evaluation." };
  }
}
