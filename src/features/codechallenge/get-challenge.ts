import getClient from "@/lib/prisma/get-client";

export interface ChallengeTestCase {
  expectedOutput: string;
  id: string;
  input: string;
  isHidden: boolean;
  position: number;
}

export interface ChallengeWithTests {
  difficulty: string;
  id: string;
  language: string;
  prompt: string;
  solution: null | string;
  starterCode: null | string;
  testCases: ChallengeTestCase[];
}

export async function getChallenge(
  challengeId: string,
): Promise<ChallengeWithTests> {
  const prisma = getClient();

  return prisma.challenge.findUniqueOrThrow({
    include: {
      testCases: {
        orderBy: { position: "asc" },
      },
    },
    where: { id: challengeId },
  });
}
