import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { AccountFactory } from "@/test/factories/account-factory";
import { CourseFactory } from "@/test/factories/course-factory";
import { LessonFactory } from "@/test/factories/lesson-factory";
import { OnboardingQuestionFactory } from "@/test/factories/onboarding-question-factory";

import LessonPage from "./page";

const { redirectMock, requireCurrentAccountMock, setCookieMock } = vi.hoisted(
  () => ({
    redirectMock: vi.fn(),
    requireCurrentAccountMock: vi.fn(),
    setCookieMock: vi.fn(),
  }),
);

vi.mock("@/lib/cookie-store", () => ({
  setCookie: setCookieMock,
}));

vi.mock("next/navigation", () => ({
  redirect: (url: string) => {
    redirectMock(url);
    throw new Error("NEXT_REDIRECT");
  },
}));

vi.mock("@/features/identity/actions/require-current-account", () => ({
  default: requireCurrentAccountMock,
}));

describe("Lesson page", () => {
  afterEach(() => {
    redirectMock.mockClear();
    requireCurrentAccountMock.mockClear();
    setCookieMock.mockReset();
  });

  it("redirects to onboarding when the learner still has a question to answer", async () => {
    const learner = await AccountFactory.create();
    requireCurrentAccountMock.mockResolvedValue(learner);
    const course = await CourseFactory.create();
    const lesson = await LessonFactory.create({
      course: { connect: { id: course.id } },
    });

    await OnboardingQuestionFactory.create({
      course: { connect: { id: course.id } },
      learner: { connect: { id: learner.id } },
    });

    const pagePromise = LessonPage({
      params: Promise.resolve({
        courseSlug: course.slug,
        lessonSlug: lesson.slug,
      }),
    });

    await expect(pagePromise).rejects.toThrow("NEXT_REDIRECT");
    expect(setCookieMock).toHaveBeenCalledWith(
      "afterOnboardingPath",
      `/courses/${course.slug}/lessons/${lesson.slug}`,
    );
    expect(redirectMock).toHaveBeenCalledWith(
      `/courses/${course.slug}/onboarding`,
    );
  });

  it("renders the course and lesson titles", async () => {
    const learner = await AccountFactory.create();
    requireCurrentAccountMock.mockResolvedValue(learner);
    const course = await CourseFactory.create();
    const lesson = await LessonFactory.create({
      course: { connect: { id: course.id } },
    });

    await OnboardingQuestionFactory.create({
      answer: "Done",
      course: { connect: { id: course.id } },
      learner: { connect: { id: learner.id } },
    });

    const page = await LessonPage({
      params: Promise.resolve({
        courseSlug: course.slug,
        lessonSlug: lesson.slug,
      }),
    });

    render(page);

    expect(
      screen.getByRole("heading", { level: 1, name: course.title }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: lesson.title }),
    ).toBeInTheDocument();
  });
});
