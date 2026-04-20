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

  it("retrieves quizzes for a lesson with ordered questions and options", async () => {
    const quizzes = [
      {
        id: "quiz-1",
        lessonId: "lesson-123",
        questions: [],
        title: "Core Java Quiz",
      },
      {
        id: "quiz-2",
        lessonId: "lesson-123",
        questions: [],
        title: "JUnit Quiz",
      },
    ];

    findManyMock.mockResolvedValue(quizzes);

    const result = await getQuizzes("lesson-123");

    expect(findManyMock).toHaveBeenCalledTimes(1);
    expect(findManyMock).toHaveBeenCalledWith({
      include: {
        questions: {
          include: {
            options: {
              orderBy: { position: "asc" },
            },
          },
          orderBy: { position: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
      where: { lessonId: "lesson-123" },
    });

    expect(result).toBe(quizzes);
  });
});
