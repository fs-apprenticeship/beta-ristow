import { describe, expect, it } from "vitest";

import getClient from "@/lib/prisma/get-client";
import { AccountFactory } from "@/test/factories/account-factory";
import { OnboardingQuestionFactory } from "@/test/factories/onboarding-question-factory";

import answerQuestion from "./answer-question";

describe("answerQuestion", () => {
  it("stores the learner's answer for the matching question", async () => {
    const learner = await AccountFactory.create();
    const question = await OnboardingQuestionFactory.create({
      learner: { connect: { id: learner.id } },
    });

    await answerQuestion({
      answer: "I want to build a steady writing habit.",
      id: question.id,
      learnerId: learner.id,
    });

    const prisma = getClient();
    const updatedQuestion = await prisma.onboardingQuestion.findUnique({
      where: { id: question.id },
    });

    expect(updatedQuestion?.answer).toBe(
      "I want to build a steady writing habit.",
    );
  });

  it("rejects answers for a different learner's question", async () => {
    const learner = await AccountFactory.create();
    const otherLearner = await AccountFactory.create();
    const question = await OnboardingQuestionFactory.create({
      learner: { connect: { id: otherLearner.id } },
    });

    await expect(
      answerQuestion({
        answer: "This should not be saved.",
        id: question.id,
        learnerId: learner.id,
      }),
    ).rejects.toThrow("Learner onboarding question not found.");
  });
});
