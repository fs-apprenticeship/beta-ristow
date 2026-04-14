import { describe, expect, it } from "vitest";

import mapQuizToUIQuiz from "./map-quiz-to-ui-quiz";

describe("mapQuizToUIQuiz", () => {
  it("maps persisted quiz data to quiz shape with persisted ids", () => {
    const quiz = createPersistedQuiz();

    expect(mapQuizToUIQuiz(quiz)).toEqual({
      id: "quiz-db-id",
      questions: [
        {
          id: "question-1-db-id",
          options: [
            { id: "option-1-db-id", text: "A programming language" },
            { id: "option-2-db-id", text: "A database" },
            { id: "option-3-db-id", text: "An operating system" },
            { id: "option-4-db-id", text: "A browser" },
          ],
          prompt: "What is Java?",
        },
        {
          id: "question-2-db-id",
          options: [
            { id: "option-5-db-id", text: "class" },
            { id: "option-6-db-id", text: "new" },
            { id: "option-7-db-id", text: "void" },
            { id: "option-8-db-id", text: "this" },
          ],
          prompt: "Which keyword creates an object in Java?",
        },
      ],
      title: "Core Java Quiz",
    });
  });

  it("preserves persisted ids for quiz, questions, and options", () => {
    const quiz = createPersistedQuiz();

    const result = mapQuizToUIQuiz(quiz);

    expect(result.id).toBe("quiz-db-id");
    expect(result.questions[0].id).toBe("question-1-db-id");
    expect(result.questions[0].options[0].id).toBe("option-1-db-id");
  });
});

const createPersistedQuiz = () => {
  return {
    createdAt: new Date("2024-10-10T05:05:20Z"),
    id: "quiz-db-id",
    lessonId: "lesson-db-id",
    questions: [
      {
        createdAt: new Date("2024-10-10T05:05:20Z"),
        id: "question-1-db-id",
        options: [
          {
            createdAt: new Date("2024-10-10T05:05:20Z"),
            id: "option-1-db-id",
            position: 0,
            questionId: "question-1-db-id",
            text: "A programming language",
            updatedAt: new Date("2024-10-10T06:07:20Z"),
          },
          {
            createdAt: new Date("2024-10-10T05:05:20Z"),
            id: "option-2-db-id",
            position: 1,
            questionId: "question-1-db-id",
            text: "A database",
            updatedAt: new Date("2024-10-10T06:07:20Z"),
          },
          {
            createdAt: new Date("2024-10-10T05:05:20Z"),
            id: "option-3-db-id",
            position: 2,
            questionId: "question-1-db-id",
            text: "An operating system",
            updatedAt: new Date("2024-10-10T06:07:20Z"),
          },
          {
            createdAt: new Date("2024-10-10T05:05:20Z"),
            id: "option-4-db-id",
            position: 3,
            questionId: "question-1-db-id",
            text: "A browser",
            updatedAt: new Date("2024-10-10T06:07:20Z"),
          },
        ],
        position: 0,
        prompt: "What is Java?",
        quizId: "quiz-db-id",
        updatedAt: new Date("2024-10-10T06:07:20Z"),
      },
      {
        createdAt: new Date("2024-10-10T05:05:20Z"),
        id: "question-2-db-id",
        options: [
          {
            createdAt: new Date("2024-10-10T05:05:20Z"),
            id: "option-5-db-id",
            position: 0,
            questionId: "question-2-db-id",
            text: "class",
            updatedAt: new Date("2024-10-10T06:07:20Z"),
          },
          {
            createdAt: new Date("2024-10-10T05:05:20Z"),
            id: "option-6-db-id",
            position: 1,
            questionId: "question-2-db-id",
            text: "new",
            updatedAt: new Date("2024-10-10T06:07:20Z"),
          },
          {
            createdAt: new Date("2024-10-10T05:05:20Z"),
            id: "option-7-db-id",
            position: 2,
            questionId: "question-2-db-id",
            text: "void",
            updatedAt: new Date("2024-10-10T06:07:20Z"),
          },
          {
            createdAt: new Date("2024-10-10T05:05:20Z"),
            id: "option-8-db-id",
            position: 3,
            questionId: "question-2-db-id",
            text: "this",
            updatedAt: new Date("2024-10-10T06:07:20Z"),
          },
        ],
        position: 1,
        prompt: "Which keyword creates an object in Java?",
        quizId: "quiz-db-id",
        updatedAt: new Date("2024-10-10T06:07:20Z"),
      },
    ],
    title: "Core Java Quiz",
    updatedAt: new Date("2024-10-10T06:07:20Z"),
  };
};
