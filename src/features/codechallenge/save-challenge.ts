import getClient from "@/lib/prisma/get-client";

import { ChallengeData } from "./types";

export async function saveChallengeToDB(challengeData: ChallengeData) {
  const prisma = getClient();

  return await prisma.challenge.create({
    data: {
      difficulty: challengeData.difficulty,
      language: challengeData.language ?? "python",
      prompt: challengeData.prompt,
      solution: challengeData.solution ?? null,
      starterCode: challengeData.starterCode ?? null,

      testCases: {
        create: challengeData.testCases.map((tc, index) => ({
          expectedOutput: tc.expectedOutput,
          input: tc.input,
          isHidden: false,
          position: index,
        })),
      },
    },
    include: {
      testCases: true,
    },
  });
}
