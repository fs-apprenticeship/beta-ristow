import getClient from "@/lib/prisma/get-client";

const prisma = getClient();

export default async function answerQuestion({
  answer,
  id,
  learnerId,
}: {
  answer: string;
  id: string;
  learnerId: string;
}) {
  const updateResult = await prisma.onboardingQuestion.updateMany({
    data: { answer },
    where: { id, learnerId },
  });

  if (updateResult.count === 0) {
    throw new Error("Learner onboarding question not found.");
  }
}
