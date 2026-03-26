import getClient from "@/lib/prisma/get-client";

import { ChallengeData } from "./types";

export async function saveChallengeToDB(challengeData: ChallengeData) {
  const prisma = getClient();

  return await prisma.challenge.create({
    data: {
      difficulty: challengeData.difficulty,
      language: challengeData.language,
      prompt: challengeData.prompt,
      solution: challengeData.solution,
      starterCode: challengeData.starterCode,
    },
  });
}
