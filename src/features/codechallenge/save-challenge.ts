import getClient from "@/lib/prisma/get-client";

<<<<<<< HEAD
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
=======
export async function saveChallengeToDB(challengeData: any) {
    const prisma = getClient();

    return await prisma.challenge.create({
        data: {
            prompt: challengeData.prompt,
            starterCode: challengeData.starterCode,
            solution: challengeData.solution,
            difficulty: challengeData.difficulty,
            language: challengeData.language,
        },
    });
>>>>>>> de2fd36 (feat(codeChallenge): add generateChallenge API and saveChallenge logic)
}
