import getClient from "@/lib/prisma/get-client";

export interface Challenge {
  difficulty: string;
  id: string;
  language: string;
  prompt: string;
  solution?: null | string;
  starterCode?: null | string;
}

export async function getChallenge(challengeId: string): Promise<Challenge> {
  const prisma = getClient();

  const challenge = await prisma.challenge.findUnique({
    where: { id: challengeId },
  });

  if (!challenge) throw new Error("Challenge not found");

  return challenge;
}
