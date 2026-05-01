"use server";

import { evaluateChallenge } from "@/features/codechallenge/evaluate-challenge";
import { getChallenge } from "@/features/codechallenge/get-challenge";

export async function evaluateChallengeAction(
  challengeId: string,
  userCode: string,
) {
  if (!userCode) {
    return { results: [] };
  }

  try {
    const challenge = await getChallenge(challengeId);

    if (!challenge) {
      return { results: [] };
    }

    const cleanedTestCases = challenge.testCases.map((tc) => ({
      expectedOutput: tc.expectedOutput,
      input: tc.input,
    }));

    const result = await evaluateChallenge(
      challenge.prompt,
      userCode,
      challenge.language,
      cleanedTestCases,
    );

    return result;
  } catch (err) {
    console.error("Challenge evaluation error:", err);
    return { results: [] };
  }
}
