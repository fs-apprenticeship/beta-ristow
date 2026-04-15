import getCurrentUserId from "@/lib/clerk/get-current-user-id";
import getClient from "@/lib/prisma/get-client";

interface SaveSubmissionInput {
  challengeId: string;
  correct: boolean;
  feedback: string;
  userCode: string;
}

export async function saveSubmission({
  challengeId,
  correct,
  feedback,
  userCode,
}: SaveSubmissionInput) {
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

  const submission = await prisma.challengeSubmission.create({
    data: {
      accountId: account.id,
      challengeId,
      correct: correct,
      feedback: feedback ?? "",
      userCode,
    },
  });

  return submission;
}