import { beforeEach, describe, expect, it, vi } from "vitest";

import getClient from "@/lib/prisma/get-client";
import { OnboardingQuestionFactory } from "@/test/factories/onboarding-question-factory";

const { generateTextStreamMock } = vi.hoisted(() => ({
  generateTextStreamMock: vi.fn(),
}));

vi.mock("@/lib/openai/generate-text-stream", () => ({
  default: generateTextStreamMock,
}));

import generateDescription from "./generate-description";

const prisma = getClient();

describe("generateDescription", () => {
  beforeEach(() => {
    generateTextStreamMock.mockReset();
  });

  it("yields an existing description as one chunk", async () => {
    const question = await OnboardingQuestionFactory.create();
    const chunks: string[] = [];

    for await (const chunk of generateDescription(
      question.id,
      question.learnerId,
    )) {
      chunks.push(chunk);
    }

    expect(chunks).toEqual([question.description]);
    expect(generateTextStreamMock).not.toHaveBeenCalled();
  });

  it("builds a prompt from previous answers, yields generated text, and saves it", async () => {
    const question = await OnboardingQuestionFactory.use("generated").create({
      position: 2,
    });

    await OnboardingQuestionFactory.create({
      answer: "I love snakes",
      course: { connect: { id: question.courseId } },
      learner: { connect: { id: question.learnerId } },
      position: 1,
      question: "Why do you want to learn Python?",
    });

    const chunks: string[] = [];

    generateTextStreamMock.mockImplementation(async function* () {
      yield "You love ";
      yield "snakes";
    });

    for await (const chunk of generateDescription(
      question.id,
      question.learnerId,
    )) {
      chunks.push(chunk);
    }

    expect(generateTextStreamMock).toHaveBeenCalledWith({
      instructions:
        'You are an experienced tutor. Write a short onboarding summary for a learner to review Cover their experience, goals, anything relevant to them as a learner. Use the 2nd person point of view. Do not "welcome" them, do not mention that this is a summary.',
      prompt: expect.stringContaining(
        "Learner answers:\n\n1. Question: Why do you want to learn Python?\nAnswer: I love snakes",
      ),
    });
    expect(chunks).toEqual(["You love ", "snakes"]);

    const updated = await prisma.onboardingQuestion.findUniqueOrThrow({
      where: { id: question.id },
    });

    expect(updated.description).toBe("You love snakes");
  });
});
