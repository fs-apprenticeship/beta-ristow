import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";

import { AccountFactory } from "@/test/factories/account-factory";
import { CourseFactory } from "@/test/factories/course-factory";
import { LessonFactory } from "@/test/factories/lesson-factory";
import { OnboardingQuestionFactory } from "@/test/factories/onboarding-question-factory";
import { OnboardingQuestionTemplateFactory } from "@/test/factories/onboarding-question-template-factory";

const { requireCurrentAccount } = vi.hoisted(() => ({
  requireCurrentAccount: vi.fn(),
}));

import OnboardingPage from "./page";

const { deleteCookieMock, redirectMock } = vi.hoisted(() => ({
  deleteCookieMock: vi.fn(),
  redirectMock: vi.fn(),
}));

vi.mock("@/lib/cookie-store", () => ({
  deleteCookie: deleteCookieMock,
}));

vi.mock("next/navigation", () => ({
  redirect: (url: string) => {
    redirectMock(url);
    throw new Error("NEXT_REDIRECT");
  },
}));

vi.mock("@/features/identity/actions/require-current-account", () => ({
  default: requireCurrentAccount,
}));

describe("Onboarding page", () => {
  afterEach(() => {
    deleteCookieMock.mockReset();
    redirectMock.mockClear();
    requireCurrentAccount.mockReset();
  });

  it("redirects to the first lesson when all onboarding questions are answered", async () => {
    const course = await CourseFactory.create();
    const learner = await AccountFactory.create();
    requireCurrentAccount.mockResolvedValue(learner);
    const lesson = await LessonFactory.create({
      course: { connect: { id: course.id } },
    });

    await OnboardingQuestionFactory.use("template").create({
      answer: "Done",
      course: { connect: { id: course.id } },
      learner: { connect: { id: learner.id } },
      position: 1,
      question: "First?",
    });

    const pagePromise = OnboardingPage({
      params: Promise.resolve({ courseSlug: course.slug }),
    });

    await expect(pagePromise).rejects.toThrow("NEXT_REDIRECT");
    expect(redirectMock).toHaveBeenCalledWith(
      `/courses/${course.slug}/lessons/${lesson.slug}`,
    );
  });

  it("renders the onboarding question when one is available", async () => {
    const course = await CourseFactory.create();
    const learner = await AccountFactory.create();
    requireCurrentAccount.mockResolvedValue(learner);
    const questionTemplate = await OnboardingQuestionTemplateFactory.create({
      course: { connect: { id: course.id } },
      position: 1,
    });

    const page = await OnboardingPage({
      params: Promise.resolve({ courseSlug: course.slug }),
    });

    render(page);

    expect(
      screen.getByRole("heading", { level: 2, name: course.title }),
    ).toBeInTheDocument();
    expect(screen.getByText(questionTemplate.question)).toBeInTheDocument();
    expect(screen.getByText(questionTemplate.description)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Type your response here."),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Continue" }),
    ).toBeInTheDocument();
  });

  describe("when no questions are available", () => {
    it("redirects to afterOnboardingPath if set", async () => {
      const learner = await AccountFactory.create();
      requireCurrentAccount.mockResolvedValue(learner);
      const course = await CourseFactory.create();
      const afterOnboardingPath = "/courses/focus/lessons/routines";

      deleteCookieMock.mockResolvedValue(afterOnboardingPath);

      await OnboardingQuestionFactory.create({
        answer: "Done",
        course: { connect: { id: course.id } },
        learner: { connect: { id: learner.id } },
      });

      const pagePromise = OnboardingPage({
        params: Promise.resolve({ courseSlug: course.slug }),
      });

      await expect(pagePromise).rejects.toThrow("NEXT_REDIRECT");
      expect(redirectMock).toHaveBeenCalledWith(afterOnboardingPath);
      expect(deleteCookieMock).toHaveBeenCalledWith("afterOnboardingPath");
    });

    it("redirects to a lesson in the course if afterOnboardingPath is not set", async () => {
      const learner = await AccountFactory.create();
      requireCurrentAccount.mockResolvedValue(learner);
      const course = await CourseFactory.create();
      const lesson = await LessonFactory.create({
        course: { connect: { id: course.id } },
      });

      await OnboardingQuestionFactory.create({
        answer: "Done",
        course: { connect: { id: course.id } },
        learner: { connect: { id: learner.id } },
      });

      const pagePromise = OnboardingPage({
        params: Promise.resolve({ courseSlug: course.slug }),
      });

      await expect(pagePromise).rejects.toThrow("NEXT_REDIRECT");
      expect(deleteCookieMock).toHaveBeenCalledWith("afterOnboardingPath");
      expect(redirectMock).toHaveBeenCalledWith(
        `/courses/${course.slug}/lessons/${lesson.slug}`,
      );
    });
  });

  it("has no axe violations", async () => {
    const course = await CourseFactory.create();
    const learner = await AccountFactory.create();
    requireCurrentAccount.mockResolvedValue(learner);
    await OnboardingQuestionTemplateFactory.create({
      course: { connect: { id: course.id } },
      position: 1,
    });

    const page = await OnboardingPage({
      params: Promise.resolve({ courseSlug: course.slug }),
    });

    const { container } = render(page);

    expect(await axe(container)).toHaveNoViolations();
  });
});
