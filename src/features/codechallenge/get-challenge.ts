import getClient from "@/lib/prisma/get-client";

export interface ChallengeTestCase {
  id: string;
  input: string;
  expectedOutput: string;
  isHidden: boolean;
  position: number;
}

export interface ChallengeWithTests {
  id: string;
  prompt: string;
  starterCode: string | null;
  solution: string | null;
  difficulty: string;
  language: string;
  testCases: ChallengeTestCase[];
}

export async function getChallenge(
  challengeId: string
): Promise<ChallengeWithTests> {
  const prisma = getClient();

  return prisma.challenge.findUniqueOrThrow({
    where: { id: challengeId },
    include: {
      testCases: {
        orderBy: { position: "asc" },
      },
    },
  });
}
