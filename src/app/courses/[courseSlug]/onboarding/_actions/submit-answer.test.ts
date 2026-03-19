import { afterEach, describe, expect, it, vi } from "vitest";
import { ZodError } from "zod";

import onboard from "@/features/onboarding/onboard";
import { AccountFactory } from "@/test/factories/account-factory";
import { CourseFactory } from "@/test/factories/course-factory";
import { OnboardingQuestionFactory } from "@/test/factories/onboarding-question-factory";

const { requireCurrentAccountMock } = vi.hoisted(() => ({
  requireCurrentAccountMock: vi.fn(),
}));

vi.mock("@/features/identity/actions/require-current-account", () => ({
  default: requireCurrentAccountMock,
}));

const redirectMock = vi.fn();

vi.mock("next/navigation", () => ({
  redirect: (url: string) => {
    redirectMock(url);
    throw new Error("NEXT_REDIRECT");
  },
}));

import { submitAnswer } from "./submit-answer";

describe("submitAnswer", () => {
  afterEach(() => {
    requireCurrentAccountMock.mockClear();
    redirectMock.mockClear();
  });

  it("redirects back to onboarding", async () => {
    const learner = await AccountFactory.create();
    requireCurrentAccountMock.mockResolvedValue(learner);
    const course = await CourseFactory.create();
    const question = await OnboardingQuestionFactory.create({
      course: { connect: { id: course.id } },
      learner: { connect: { id: learner.id } },
    });

    const formData = new FormData();
    formData.set("id", question.id);
    formData.set("answer", "I want a clearer weekly routine.");

    await expect(submitAnswer(course.slug, formData)).rejects.toThrow(
      "NEXT_REDIRECT",
    );
    expect(redirectMock).toHaveBeenCalledWith(
      `/courses/${course.slug}/onboarding`,
    );
  });

  it("answers the given question, making way for the next question", async () => {
    const learner = await AccountFactory.create();
    requireCurrentAccountMock.mockResolvedValue(learner);
    const course = await CourseFactory.create();
    const questions = await OnboardingQuestionFactory.createList(2, {
      course: { connect: { id: course.id } },
      learner: { connect: { id: learner.id } },
    });

    const { nextQuestion: firstQuestion } = await onboard(
      course.id,
      learner.id,
    );
    expect(firstQuestion!.id).toEqual(questions[0].id);

    const formData = new FormData();
    formData.set("id", firstQuestion!.id);
    formData.set("answer", "I want a clearer weekly routine.");

    await expect(submitAnswer(course.slug, formData)).rejects.toThrow(
      "NEXT_REDIRECT",
    );

    const { nextQuestion } = await onboard(course.id, learner.id);
    expect(nextQuestion!.id).toEqual(questions[1].id);
  });

  it("rejects invalid form data", async () => {
    const learner = await AccountFactory.build();
    requireCurrentAccountMock.mockResolvedValue(learner);
    const course = await CourseFactory.create();
    await AccountFactory.create();

    const formData = new FormData();
    formData.set("id", "");
    formData.set("answer", "   ");

    await expect(submitAnswer(course.slug, formData)).rejects.toBeInstanceOf(
      ZodError,
    );
  });
});
