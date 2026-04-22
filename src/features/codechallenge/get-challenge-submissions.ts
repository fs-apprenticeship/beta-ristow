import getCurrentUserId from "@/lib/clerk/get-current-user-id";
import getClient from "@/lib/prisma/get-client";

export interface ChallengeSubmission {
  correct: boolean;
  createdAt: Date;
  feedback: string;
  id: string;
  userCode: string;
}

export async function getChallengeSubmissions(
  challengeId: string,
): Promise<ChallengeSubmission[]> {
  const prisma = getClient();

  const clerkUserId = await getCurrentUserId();

  if (!clerkUserId) {
    throw new Error("Unauthorized!");
  }

  const account = await prisma.account.findUniqueOrThrow({
    where: {
      clerkUserId,
    },
  });

  const submissions = await prisma.challengeSubmission.findMany({
    orderBy: {
      createdAt: "desc",
    },
    where: {
      accountId: account.id,
      challengeId,
    },
  });

  return submissions;
}
