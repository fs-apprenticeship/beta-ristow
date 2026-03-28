import { afterEach, describe, expect, it, vi } from "vitest";

import type { QuizSubmission } from "./types";

import generateQuizFeedback from "./generate-quiz-feedback";

const { generateTextMock, parseJsonResponseMock } = vi.hoisted(() => ({
  generateTextMock: vi.fn(),
  parseJsonResponseMock: vi.fn(),
}));

vi.mock("@/lib/openai/generate-text", () => ({
  default: generateTextMock,
}));

vi.mock("@/lib/openai/parse-json-response", () => ({
  default: parseJsonResponseMock,
}));

describe("generateQuizFeedback", () => {
  const submission: QuizSubmission = {
    answers: [
      { questionId: "q1", selectedOptionId: "a" },
      { questionId: "q2", selectedOptionId: "b" },
    ],
    context: {
      content: "This lesson covers variables, data types, and assignments.",
      questionCount: 2,
      title: "Java Basics",
    },
    quiz: {
      questions: [
        {
          id: "q1",
          options: [
            { id: "a", text: "A stored value" },
            { id: "b", text: "A loop" },
            { id: "c", text: "A class" },
            { id: "d", text: "A method" },
          ],
          prompt: "What is a variable?",
        },
        {
          id: "q2",
          options: [
            { id: "a", text: "String" },
            { id: "b", text: "int" },
            { id: "c", text: "Array" },
            { id: "d", text: "Object" },
          ],
          prompt: "Which is a primitive type in Java?",
        },
      ],
      title: "Java Basics Quiz",
    },
  };

  afterEach(() => {
    generateTextMock.mockReset();
    parseJsonResponseMock.mockReset();
  });

  it("calls the text generator and parser, then returns valid quiz feedback", async () => {
    const rawModelText = "some raw feedback response";

    const parsedFeedback = {
      overallFeedback: "Great job. You understood the main concepts well.",
      passed: true,
      questionFeedback: [
        {
          feedback: "Correct. A variable stores a value.",
          isCorrect: true,
          questionId: "q1",
        },
        {
          feedback: "Correct. int is a primitive type in Java.",
          isCorrect: true,
          questionId: "q2",
        },
      ],
    };

    generateTextMock.mockResolvedValue(rawModelText);
    parseJsonResponseMock.mockReturnValue(parsedFeedback);

    const result = await generateQuizFeedback(submission);

    expect(generateTextMock).toHaveBeenCalledOnce();
    expect(parseJsonResponseMock).toHaveBeenCalledWith(rawModelText);

    expect(result.overallFeedback).toBe(
      "Great job. You understood the main concepts well.",
    );
    expect(result.passed).toBe(true);
    expect(result.questionFeedback).toHaveLength(2);
    expect(result.questionFeedback[0]?.questionId).toBe("q1");
  });

  it("throws when the parsed feedback shape is invalid", async () => {
    generateTextMock.mockResolvedValue("raw feedback text");
    parseJsonResponseMock.mockReturnValue({
      overallFeedback: "Needs improvement.",
      passed: false,
      questionFeedback: [
        {
          // missing feedback field
          isCorrect: false,
          questionId: "q1",
        },
      ],
    });

    await expect(generateQuizFeedback(submission)).rejects.toThrow(
      "Quiz feedback generator returned an invalid shape.",
    );
  });
});
