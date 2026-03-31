"use server";

import { getChallenge } from "@/features/codechallenge/get-challenge";

export async function getChallengeByIdAction(id: string) {
  if (!id) throw new Error("Challenge ID is required");

  const challenge = await getChallenge(id);

  if (!challenge) throw new Error("Challenge not found");

  return challenge;
}
