import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import getQuizAttempts from "./get-quiz-attempts";

const { findManyMock } = vi.hoisted(() => {
  return {
    findManyMock: vi.fn(),
  };
});

vi.mock("@/lib/prisma/get-client", () => {
  return {
    default: () => ({
      quizAttempt: {
        findMany: findManyMock,
      },
    }),
  };
});

describe("getQuizAttempts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("retrieves quiz attempt list items for a lesson and learner", async () => {
    const createdAt = new Date("2026-04-27T12:00:00.000Z");

    const attempts = [
      {
        createdAt,
        id: "attempt-1",
        passed: true,
        quiz: {
          title: "Core Java Quiz",
        },
        score: 80,
        totalQuestions: 10,
      },
      {
        createdAt,
        id: "attempt-2",
        passed: false,
        quiz: {
          title: "JUnit Quiz",
        },
        score: 50,
        totalQuestions: 10,
      },
    ];

    findManyMock.mockResolvedValue(attempts);

    const result = await getQuizAttempts("lesson-123", "learner-123");

    expect(findManyMock).toHaveBeenCalledTimes(1);
    expect(findManyMock).toHaveBeenCalledWith({
      include: {
        quiz: {
          select: {
            title: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      where: {
        learnerId: "learner-123",
        lessonId: "lesson-123",
      },
    });

    expect(result).toEqual([
      {
        createdAt,
        id: "attempt-1",
        passed: true,
        quizTitle: "Core Java Quiz",
        score: 80,
        totalQuestions: 10,
      },
      {
        createdAt,
        id: "attempt-2",
        passed: false,
        quizTitle: "JUnit Quiz",
        score: 50,
        totalQuestions: 10,
      },
    ]);
  });

  it("returns an empty array when no attempts exist", async () => {
    findManyMock.mockResolvedValue([]);

    const result = await getQuizAttempts("lesson-123", "learner-123");

    expect(result).toEqual([]);
  });

  it("maps nested quiz title correctly", async () => {
    const createdAt = new Date();

    findManyMock.mockResolvedValue([
      {
        createdAt,
        id: "attempt-1",
        passed: true,
        quiz: { title: "Some Quiz" },
        score: 90,
        totalQuestions: 10,
      },
    ]);

    const result = await getQuizAttempts("lesson-1", "learner-1");

    expect(result[0].quizTitle).toBe("Some Quiz");
  });

  it("orders attempts by newest first", async () => {
    findManyMock.mockResolvedValue([]);

    await getQuizAttempts("lesson-123", "learner-123");

    expect(findManyMock).toHaveBeenCalledWith(
      expect.objectContaining({
        orderBy: {
          createdAt: "desc",
        },
      }),
    );
  });
});
