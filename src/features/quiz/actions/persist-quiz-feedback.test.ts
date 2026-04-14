import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import type { QuizFeedback, QuizSubmission } from "../types";

import persistQuizFeedback from "./persist-quiz-feedback";

const {
  getClientMock,
  quizAttemptAnswerCreateManyMock,
  quizAttemptCreateMock,
} = vi.hoisted(() => {
  const quizAttemptCreateMock = vi.fn();
  const quizAttemptAnswerCreateManyMock = vi.fn();

  const getClientMock = vi.fn(() => ({
    quizAttempt: {
      create: quizAttemptCreateMock,
    },
    quizAttemptAnswer: {
      createMany: quizAttemptAnswerCreateManyMock,
    },
  }));

  return {
    getClientMock,
    quizAttemptAnswerCreateManyMock,
    quizAttemptCreateMock,
  };
});

vi.mock("@/lib/prisma/get-client", () => ({
  default: getClientMock,
}));

describe("persistQuizFeedback", () => {
  const submission: QuizSubmission = {
    answers: [
      { questionId: "question-1", selectedOptionId: "option-a" },
      { questionId: "question-2", selectedOptionId: "option-b" },
    ],
    context: {
      content: "Lesson content about functions.",
      questionCount: 2,
      title: "First Functions",
    },
    quiz: {
      id: "quiz-1",
      questions: [
        {
          id: "question-1",
          options: [
            { id: "option-a", text: "Reusable code" },
            { id: "option-b", text: "Store data" },
          ],
          prompt: "What is the purpose of functions?",
        },
        {
          id: "question-2",
          options: [
            { id: "option-a", text: "Comments" },
            { id: "option-b", text: "Parameters" },
          ],
          prompt: "What can be passed into functions?",
        },
      ],
      title: "First Functions Quiz",
    },
  };

  const feedback: QuizFeedback = {
    overallFeedback: "Good work overall.",
    passed: true,
    questionFeedback: [
      {
        chosenAnswer: "Reusable code",
        feedback: "Correct.",
        isCorrect: true,
        questionId: "question-1",
      },
      {
        chosenAnswer: "Parameters",
        feedback: "Correct.",
        isCorrect: true,
        questionId: "question-2",
      },
    ],
  };

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("creates a quiz attempt and persists per-question feedback", async () => {
    quizAttemptCreateMock.mockResolvedValue({
      id: "attempt-1",
    });

    quizAttemptAnswerCreateManyMock.mockResolvedValue({
      count: 2,
    });

    const result = await persistQuizFeedback({
      feedback,
      learnerId: "learner-1",
      lessonId: "lesson-1",
      score: 100,
      submission,
      totalQuestions: 2,
    });

    expect(getClientMock).toHaveBeenCalledOnce();

    expect(quizAttemptCreateMock).toHaveBeenCalledWith({
      data: {
        learnerId: "learner-1",
        lessonId: "lesson-1",
        overallFeedback: "Good work overall.",
        passed: true,
        quizId: "quiz-1",
        score: 100,
        totalQuestions: 2,
      },
    });

    expect(quizAttemptAnswerCreateManyMock).toHaveBeenCalledWith({
      data: [
        {
          attemptId: "attempt-1",
          feedback: "Correct.",
          isCorrect: true,
          questionId: "question-1",
          selectedOptionId: "option-a",
        },
        {
          attemptId: "attempt-1",
          feedback: "Correct.",
          isCorrect: true,
          questionId: "question-2",
          selectedOptionId: "option-b",
        },
      ],
    });

    expect(result).toEqual({
      id: "attempt-1",
    });
  });

  it("falls back to null/false when matching question feedback is missing", async () => {
    quizAttemptCreateMock.mockResolvedValue({
      id: "attempt-2",
    });

    quizAttemptAnswerCreateManyMock.mockResolvedValue({
      count: 2,
    });

    const partialFeedback: QuizFeedback = {
      overallFeedback: "Partial feedback.",
      passed: false,
      questionFeedback: [
        {
          chosenAnswer: "Reusable code",
          feedback: "Correct.",
          isCorrect: true,
          questionId: "question-1",
        },
      ],
    };

    await persistQuizFeedback({
      feedback: partialFeedback,
      learnerId: "learner-2",
      lessonId: "lesson-2",
      score: 50,
      submission,
      totalQuestions: 2,
    });

    expect(quizAttemptAnswerCreateManyMock).toHaveBeenCalledWith({
      data: [
        {
          attemptId: "attempt-2",
          feedback: "Correct.",
          isCorrect: true,
          questionId: "question-1",
          selectedOptionId: "option-a",
        },
        {
          attemptId: "attempt-2",
          feedback: null,
          isCorrect: false,
          questionId: "question-2",
          selectedOptionId: "option-b",
        },
      ],
    });
  });
});
