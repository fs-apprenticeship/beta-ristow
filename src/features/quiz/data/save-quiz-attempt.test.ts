import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import type { QuizFeedback, QuizSubmission } from "../types";

import saveQuizAttempt from "./save-quiz-attempt";

const {
  getClientMock,
  quizAttemptAnswerCreateManyMock,
  quizAttemptCreateMock,
  quizFindUniqueMock,
  transactionMock,
} = vi.hoisted(() => {
  const quizAttemptCreateMock = vi.fn();
  const quizAttemptAnswerCreateManyMock = vi.fn();
  const quizFindUniqueMock = vi.fn();

  const transactionMock = vi.fn(async (callback) => {
    return callback({
      quizAttempt: {
        create: quizAttemptCreateMock,
      },
      quizAttemptAnswer: {
        createMany: quizAttemptAnswerCreateManyMock,
      },
    });
  });

  const getClientMock = vi.fn(() => ({
    $transaction: transactionMock,
    quiz: {
      findUnique: quizFindUniqueMock,
    },
  }));

  return {
    getClientMock,
    quizAttemptAnswerCreateManyMock,
    quizAttemptCreateMock,
    quizFindUniqueMock,
    transactionMock,
  };
});

vi.mock("@/lib/prisma/get-client", () => ({
  default: getClientMock,
}));

describe("saveQuizAttempt", () => {
  const submission: QuizSubmission = {
    answers: [
      { questionId: "0", selectedOptionId: "0" },
      { questionId: "1", selectedOptionId: "1" },
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
          id: "0",
          options: [
            { id: "0", text: "Reusable code" },
            { id: "1", text: "Store data" },
          ],
          prompt: "What is the purpose of functions?",
        },
        {
          id: "1",
          options: [
            { id: "0", text: "Comments" },
            { id: "1", text: "Parameters" },
          ],
          prompt: "What can be passed into functions?",
        },
      ],
      title: "First Functions Quiz",
    },
  };

  const persistedQuiz = {
    id: "quiz-1",
    questions: [
      {
        id: "question-db-1",
        options: [
          {
            id: "option-db-1",
            position: 0,
            text: "Reusable code",
          },
          {
            id: "option-db-2",
            position: 1,
            text: "Store data",
          },
        ],
        position: 0,
        prompt: "What is the purpose of functions?",
      },
      {
        id: "question-db-2",
        options: [
          {
            id: "option-db-3",
            position: 0,
            text: "Comments",
          },
          {
            id: "option-db-4",
            position: 1,
            text: "Parameters",
          },
        ],
        position: 1,
        prompt: "What can be passed into functions?",
      },
    ],
  };

  const feedback: QuizFeedback = {
    overallFeedback: "Good work overall.",
    questionFeedback: [
      {
        chosenAnswer: "Reusable code",
        feedback: "Correct.",
        isCorrect: true,
        questionId: "0",
      },
      {
        chosenAnswer: "Parameters",
        feedback: "Correct.",
        isCorrect: true,
        questionId: "1",
      },
    ],
  };

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("creates a quiz attempt and persists mapped question and option db ids", async () => {
    quizFindUniqueMock.mockResolvedValue(persistedQuiz);

    quizAttemptCreateMock.mockResolvedValue({
      id: "attempt-1",
    });

    quizAttemptAnswerCreateManyMock.mockResolvedValue({
      count: 2,
    });

    const result = await saveQuizAttempt({
      feedback,
      learnerId: "learner-1",
      lessonId: "lesson-1",
      passed: true,
      score: 100,
      submission,
      totalQuestions: 2,
    });

    expect(getClientMock).toHaveBeenCalledOnce();

    expect(quizFindUniqueMock).toHaveBeenCalledWith({
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
      where: { id: "quiz-1" },
    });

    expect(transactionMock).toHaveBeenCalledOnce();

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
          questionId: "question-db-1",
          selectedOptionId: "option-db-1",
        },
        {
          attemptId: "attempt-1",
          feedback: "Correct.",
          isCorrect: true,
          questionId: "question-db-2",
          selectedOptionId: "option-db-4",
        },
      ],
    });

    expect(result).toEqual({
      id: "attempt-1",
    });
  });

  it("falls back to null and false when matching question feedback is missing", async () => {
    quizFindUniqueMock.mockResolvedValue(persistedQuiz);

    quizAttemptCreateMock.mockResolvedValue({
      id: "attempt-2",
    });

    quizAttemptAnswerCreateManyMock.mockResolvedValue({
      count: 2,
    });

    const partialFeedback: QuizFeedback = {
      overallFeedback: "Partial feedback.",
      questionFeedback: [
        {
          chosenAnswer: "Reusable code",
          feedback: "Correct.",
          isCorrect: true,
          questionId: "0",
        },
      ],
    };

    await saveQuizAttempt({
      feedback: partialFeedback,
      learnerId: "learner-2",
      lessonId: "lesson-2",
      passed: false,
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
          questionId: "question-db-1",
          selectedOptionId: "option-db-1",
        },
        {
          attemptId: "attempt-2",
          feedback: null,
          isCorrect: false,
          questionId: "question-db-2",
          selectedOptionId: "option-db-4",
        },
      ],
    });
  });

  it("throws when the persisted quiz cannot be found", async () => {
    quizFindUniqueMock.mockResolvedValue(null);

    await expect(
      saveQuizAttempt({
        feedback,
        learnerId: "learner-1",
        lessonId: "lesson-1",
        passed: true,
        score: 100,
        submission,
        totalQuestions: 2,
      }),
    ).rejects.toThrow("Quiz not found.");
  });

  it("throws when a submitted question id is not a valid number", async () => {
    quizFindUniqueMock.mockResolvedValue(persistedQuiz);

    const invalidSubmission: QuizSubmission = {
      ...submission,
      answers: [{ questionId: "question-1", selectedOptionId: "0" }],
    };

    quizAttemptCreateMock.mockResolvedValue({
      id: "attempt-3",
    });

    await expect(
      saveQuizAttempt({
        feedback,
        learnerId: "learner-1",
        lessonId: "lesson-1",
        passed: false,
        score: 0,
        submission: invalidSubmission,
        totalQuestions: 1,
      }),
    ).rejects.toThrow(
      "Question not found for submitted question id: question-1",
    );
  });

  it("throws when the selected option id is not a valid number", async () => {
    quizFindUniqueMock.mockResolvedValue(persistedQuiz);

    const invalidSubmission: QuizSubmission = {
      ...submission,
      answers: [{ questionId: "0", selectedOptionId: "option-a" }],
    };

    quizAttemptCreateMock.mockResolvedValue({
      id: "attempt-4",
    });

    await expect(
      saveQuizAttempt({
        feedback,
        learnerId: "learner-1",
        lessonId: "lesson-1",
        passed: false,
        score: 0,
        submission: invalidSubmission,
        totalQuestions: 1,
      }),
    ).rejects.toThrow("Option not found for submitted option id: option-a");
  });
});
