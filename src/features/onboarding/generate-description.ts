import generateTextStream from "@/lib/openai/generate-text-stream";
import getClient from "@/lib/prisma/get-client";

const prisma = getClient();

export default async function* generateDescription(
  questionId: string,
  learnerId: string,
) {
  const question = await prisma.onboardingQuestion.findUniqueOrThrow({
    where: { id: questionId, learnerId },
  });

  if (question.description.length > 0) {
    yield question.description;
    return;
  }

  let description = "";
  const chunks = generateTextStream({
    instructions: buildInstructions(),
    prompt: await buildPrompt(question),
  });

  for await (const chunk of chunks) {
    description += chunk;
    yield chunk;
  }

  await prisma.onboardingQuestion.update({
    data: { description },
    where: { id: question.id },
  });
}

function buildInstructions() {
  return `
    You are an experienced tutor.
    Write a short onboarding summary for a learner to review
    Cover their experience, goals, anything relevant to them as a learner.
    Use the 2nd person point of view.
    Do not "welcome" them, do not mention that this is a summary.`
    .replace(/\s+/g, " ")
    .trim();
}

async function buildPrompt(question: {
  courseId: string;
  learnerId: string;
  position: number;
}) {
  const answers = await prisma.onboardingQuestion.findMany({
    orderBy: { position: "asc" },
    where: {
      answer: { not: null },
      courseId: question.courseId,
      learnerId: question.learnerId,
      position: { lt: question.position },
    },
  });

  if (answers.length < 1) {
    throw new Error("No onboarding answers are available yet.");
  }

  const formattedAnswers = answers.map(
    ({ answer, position, question }) =>
      `${position}. Question: ${question}\nAnswer: ${answer ?? ""}`,
  );

  return `Learner answers:\n\n${formattedAnswers.join("\n\n")}`;
}
