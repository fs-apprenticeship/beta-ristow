import { beforeEach, describe, expect, it, vi } from "vitest";

import saveQuiz from "./save-quiz";

const { createMock } = vi.hoisted(() => {
  return {
    createMock: vi.fn(),
  };
});

vi.mock("@/lib/prisma/get-client", () => {
  return {
    default: () => ({
      quiz: {
        create: createMock,
      },
    }),
  };
});

describe("saveQuiz", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates a quiz for the lesson with ordered questions and options", async () => {
    const lessonId = "lesson-123";

    const quiz = {
      questions: [
        {
          id: "q1",
          options: [
            { id: "a", text: "A programming language" },
            { id: "b", text: "A database" },
            { id: "c", text: "An operating system" },
            { id: "d", text: "A browser" },
          ],
          prompt: "What is Java?",
        },
        {
          id: "q2",
          options: [
            { id: "a", text: "class" },
            { id: "b", text: "new" },
            { id: "c", text: "void" },
            { id: "d", text: "this" },
          ],
          prompt: "Which keyword creates an object in Java?",
        },
      ],
      title: "Core Java Quiz",
    };

    const savedQuiz = {
      id: "quiz-db-id",
      lessonId,
      questions: [],
      title: "Core Java Quiz",
    };

    createMock.mockResolvedValue(savedQuiz);

    const result = await saveQuiz({ lessonId, quiz });

    expect(createMock).toHaveBeenCalledTimes(1);
    expect(createMock).toHaveBeenCalledWith({
      data: {
        lessonId,
        questions: {
          create: [
            {
              options: {
                create: [
                  { position: 0, text: "A programming language" },
                  { position: 1, text: "A database" },
                  { position: 2, text: "An operating system" },
                  { position: 3, text: "A browser" },
                ],
              },
              position: 0,
              prompt: "What is Java?",
            },
            {
              options: {
                create: [
                  { position: 0, text: "class" },
                  { position: 1, text: "new" },
                  { position: 2, text: "void" },
                  { position: 3, text: "this" },
                ],
              },
              position: 1,
              prompt: "Which keyword creates an object in Java?",
            },
          ],
        },
        title: "Core Java Quiz",
      },
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
    });

    expect(result).toBe(savedQuiz);
  });

  it("saves an empty questions array when quiz has no questions", async () => {
    const lessonId = "lesson-123";
    const quiz = {
      questions: [],
      title: "Empty Quiz",
    };

    createMock.mockResolvedValue({
      id: "quiz-empty",
      lessonId,
      questions: [],
      title: "Empty Quiz",
    });

    await saveQuiz({ lessonId, quiz });

    expect(createMock).toHaveBeenCalledWith({
      data: {
        lessonId,
        questions: {
          create: [],
        },
        title: "Empty Quiz",
      },
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
    });
  });
});
