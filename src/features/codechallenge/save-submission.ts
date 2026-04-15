import getCurrentUserId from "@/lib/clerk/get-current-user-id";
import getClient from "@/lib/prisma/get-client";

interface SaveSubmissionInput {
  challengeId: string;
  userCode: string;
}

export async function saveSubmission({
  challengeId,
  userCode
}: SaveSubmissionInput) {
  const prisma = getClient();

  if (!challengeId) {
    throw new Error("Missing challengeId");
  }

  if (!userCode) {
    throw new Error("Missing userCode");
  }

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
      correct: false,
      feedback: "Pending evaluation",
      userCode,
    },
  });

  return submission;
}
