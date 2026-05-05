import { beforeEach, describe, expect, it, vi } from "vitest";

import getQuizzes from "./get-quizzes";

const { findManyMock } = vi.hoisted(() => {
  return {
    findManyMock: vi.fn(),
  };
});

vi.mock("@/lib/prisma/get-client", () => {
  return {
    default: () => ({
      quiz: {
        findMany: findManyMock,
      },
    }),
  };
});

describe("getQuizzes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("retrieves quiz list items for a lesson", async () => {
    const createdAt = new Date("2026-04-27T12:00:00.000Z");

    const quizzes = [
      {
        _count: {
          questions: 5,
        },
        createdAt,
        id: "quiz-1",
        title: "Core Java Quiz",
      },
      {
        _count: {
          questions: 10,
        },
        createdAt,
        id: "quiz-2",
        title: "JUnit Quiz",
      },
    ];

    findManyMock.mockResolvedValue(quizzes);

    const result = await getQuizzes("lesson-123");

    expect(findManyMock).toHaveBeenCalledTimes(1);
    expect(findManyMock).toHaveBeenCalledWith({
      orderBy: { createdAt: "desc" },
      select: {
        _count: {
          select: { questions: true },
        },
        createdAt: true,
        id: true,
        title: true,
      },
      where: { lessonId: "lesson-123" },
    });

    expect(result).toEqual([
      {
        createdAt,
        id: "quiz-1",
        questionCount: 5,
        title: "Core Java Quiz",
      },
      {
        createdAt,
        id: "quiz-2",
        questionCount: 10,
        title: "JUnit Quiz",
      },
    ]);
  });
});
