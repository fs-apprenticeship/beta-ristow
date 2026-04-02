"use server";

import { redirect } from "next/navigation";

import { generateChallenge } from "@/features/codechallenge/generate-challenge";
import { saveChallengeToDB } from "@/features/codechallenge/save-challenge";

export async function generateChallengeAction(
  courseSlug: string,
  lessonSlug: string,
  formData: FormData,
) {
  const title = formData.get("title")?.toString().trim();
  const topics = formData.get("topics")?.toString().trim();

  if (!title || !topics) {
    throw new Error("Title and topics are required");
  }

  const challengeData = await generateChallenge(title, topics);
  const savedChallenge = await saveChallengeToDB(challengeData);

  redirect(
    `/courses/${courseSlug}/lessons/${lessonSlug}/code-challenges/${savedChallenge.id}`,
  );
}
