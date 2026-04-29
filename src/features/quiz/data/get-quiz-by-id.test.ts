import { beforeEach, describe, expect, it, vi } from "vitest";

import getQuizById from "./get-quiz-by-id";

const { findUniqueMock } = vi.hoisted(() => {
  return {
    findUniqueMock: vi.fn(),
  };
});

vi.mock("@/lib/prisma/get-client", () => {
  return {
    default: () => ({
      quiz: {
        findUnique: findUniqueMock,
      },
    }),
  };
});

describe("getQuizById", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("retrieves a persisted quiz by id with ordered questions and options", async () => {
    const persistedQuiz = {
      createdAt: new Date("2026-04-27T12:00:00.000Z"),
      id: "quiz-123",
      lessonId: "lesson-123",
      questions: [],
      title: "Core Java Quiz",
      updatedAt: new Date("2026-04-27T12:00:00.000Z"),
    };

    findUniqueMock.mockResolvedValue(persistedQuiz);

    const result = await getQuizById("quiz-123");

    expect(findUniqueMock).toHaveBeenCalledTimes(1);
    expect(findUniqueMock).toHaveBeenCalledWith({
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
      where: { id: "quiz-123" },
    });

    expect(result).toEqual(persistedQuiz);
  });

  it("returns null when the quiz does not exist", async () => {
    findUniqueMock.mockResolvedValue(null);

    const result = await getQuizById("missing-quiz");

    expect(result).toBeNull();
  });
});
