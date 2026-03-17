import { OnboardingQuestionOrigin } from "@/lib/prisma/enums";
import getClient from "@/lib/prisma/get-client";

const { GENERATED, TEMPLATE } = OnboardingQuestionOrigin;

const prisma = getClient();

const createOnboardingQuestions = async (
  courseId: string,
  learnerId: string,
) => {
  const templates = await prisma.onboardingQuestionTemplate.findMany({
    orderBy: { position: "asc" },
    where: { courseId },
  });

  const templateQuestions = templates.map((template) =>
    prisma.onboardingQuestion.create({
      data: {
        courseId,
        description: template.description,
        learnerId,
        origin: TEMPLATE,
        position: template.position,
        question: template.question,
        templateId: template.id,
      },
    }),
  );

  const generatedQuestion = await prisma.onboardingQuestion.create({
    data: {
      courseId,
      description: "",
      learnerId,
      origin: GENERATED,
      position: templateQuestions.length + 1,
      question: "Is this a good summary? Correct the record…",
    },
  });

  return [...(await Promise.all(templateQuestions)), generatedQuestion];
};

export default async function onboard(courseId: string, learnerId: string) {
  const existing = await prisma.onboardingQuestion.findMany({
    orderBy: { position: "asc" },
    where: { courseId, learnerId },
  });

  const questions =
    existing.length > 0
      ? existing
      : await createOnboardingQuestions(courseId, learnerId);

  const nextQuestion = questions.find(({ answer }) => answer === null);

  return {
    nextQuestion: nextQuestion
      ? {
          description: nextQuestion.description,
          id: nextQuestion.id,
          isGenerated: nextQuestion.origin === GENERATED,
          position: nextQuestion.position,
          question: nextQuestion.question,
        }
      : null,
    questionCount: questions.length,
  };
}
