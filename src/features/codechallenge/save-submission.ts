import getClient from "@/lib/prisma/get-client";

interface SaveSubmissionInput {
  challengeId: string;
  userCode: string;
}

export async function saveSubmission({
  challengeId,
  userCode,
}: SaveSubmissionInput) {
  const prisma = getClient();
  if (!challengeId) {
    throw new Error("Missing challengeId");
  }

  if (!userCode) {
    throw new Error("Missing userCode");
  }

  const submission = await prisma.challengeSubmission.create({
    data: {
      challengeId,
      correct: false,
      feedback: "Pending evaluation",
      userCode,
    },
  });

  return submission;
}
