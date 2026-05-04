"use server";

import { redirect } from "next/navigation";

import { generateChallenge } from "@/features/codechallenge/generate-challenge";
import { saveChallengeToDB } from "@/features/codechallenge/save-challenge";
import { ChallengeData } from "@/features/codechallenge/types";

const normalizeChallengeData = (data: ChallengeData): ChallengeData => {
  return {
    ...data,
    testCases: data.testCases.map((tc) => ({
      expectedOutput: String(tc.expectedOutput).trim(),
      input: String(tc.input).trim(),
    })),
  };
};

export async function generateChallengeAction(
  courseSlug: string,
  lessonSlug: string,
  formData: FormData,
): Promise<void> {
  const title = formData.get("title")?.toString().trim();
  const topics = formData.get("topics")?.toString().trim();

  if (!title || !topics) {
    throw new Error("Title and topics are required");
  }

  // 1. AI → already Zod-validated
  const rawChallenge = await generateChallenge(title, topics);

  // 2. Normalize (safe cleanup)
  const challengeData = normalizeChallengeData(rawChallenge);

  // 3. Save to DB
  const savedChallenge = await saveChallengeToDB(challengeData);

  redirect(
    `/courses/${courseSlug}/lessons/${lessonSlug}/code-challenges/${savedChallenge.id}`,
  );
}
