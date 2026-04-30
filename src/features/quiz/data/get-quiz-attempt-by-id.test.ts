import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import getQuizAttemptById from "./get-quiz-attempt-by-id";

const { findFirstMock } = vi.hoisted(() => {
  return {
    findFirstMock: vi.fn(),
  };
});

vi.mock("@/lib/prisma/get-client", () => {
  return {
    default: () => ({
      quizAttempt: {
        findFirst: findFirstMock,
      },
    }),
  };
});

describe("getQuizAttemptById", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("retrieves a quiz attempt detail for an attempt and learner", async () => {
    const createdAt = new Date("2026-04-27T12:00:00.000Z");

    const attempt = {
      answers: [
        {
          feedback: "Good answer.",
          id: "answer-1",
          isCorrect: true,
          question: {
            position: 0,
            prompt: "What is Python?",
          },
          selectedOption: {
            text: "A programming language",
          },
        },
        {
          feedback: "Review variables.",
          id: "answer-2",
          isCorrect: false,
          question: {
            position: 1,
            prompt: "What stores a value?",
          },
          selectedOption: {
            text: "Loop",
          },
        },
      ],
      createdAt,
      id: "attempt-1",
      overallFeedback: "Nice work overall.",
      passed: true,
      quiz: {
        title: "Python Basics Quiz",
      },
      score: 80,
      totalQuestions: 2,
    };

    findFirstMock.mockResolvedValue(attempt);

    const result = await getQuizAttemptById("attempt-1", "learner-1");

    expect(findFirstMock).toHaveBeenCalledTimes(1);
    expect(findFirstMock).toHaveBeenCalledWith({
      include: {
        answers: {
          include: {
            question: {
              select: {
                position: true,
                prompt: true,
              },
            },
            selectedOption: {
              select: {
                text: true,
              },
            },
          },
          orderBy: {
            question: {
              position: "asc",
            },
          },
        },
        quiz: {
          select: {
            title: true,
          },
        },
      },
      where: {
        id: "attempt-1",
        learnerId: "learner-1",
      },
    });

    expect(result).toEqual({
      answers: [
        {
          feedback: "Good answer.",
          id: "answer-1",
          isCorrect: true,
          questionPrompt: "What is Python?",
          selectedOptionText: "A programming language",
        },
        {
          feedback: "Review variables.",
          id: "answer-2",
          isCorrect: false,
          questionPrompt: "What stores a value?",
          selectedOptionText: "Loop",
        },
      ],
      createdAt,
      id: "attempt-1",
      overallFeedback: "Nice work overall.",
      passed: true,
      quizTitle: "Python Basics Quiz",
      score: 80,
      totalQuestions: 2,
    });
  });

  it("returns null when the attempt is not found", async () => {
    findFirstMock.mockResolvedValue(null);

    const result = await getQuizAttemptById("missing-attempt", "learner-1");

    expect(result).toBeNull();
  });

  it("maps answers with null feedback", async () => {
    const createdAt = new Date("2026-04-27T12:00:00.000Z");

    findFirstMock.mockResolvedValue({
      answers: [
        {
          feedback: null,
          id: "answer-1",
          isCorrect: false,
          question: {
            position: 0,
            prompt: "Question prompt",
          },
          selectedOption: {
            text: "Selected answer",
          },
        },
      ],
      createdAt,
      id: "attempt-1",
      overallFeedback: "Needs review.",
      passed: false,
      quiz: {
        title: "Quiz Title",
      },
      score: 40,
      totalQuestions: 1,
    });

    const result = await getQuizAttemptById("attempt-1", "learner-1");

    expect(result?.answers).toEqual([
      {
        feedback: null,
        id: "answer-1",
        isCorrect: false,
        questionPrompt: "Question prompt",
        selectedOptionText: "Selected answer",
      },
    ]);
  });
});
