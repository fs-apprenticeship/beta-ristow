import { afterEach, describe, expect, it, vi } from "vitest";

import type { QuizContext } from "./types";

import generateQuiz from "./generate-quiz";

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

describe("generateQuiz", () => {
  const context: QuizContext = {
    content: "This lesson covers variables, data types, and assignments.",
    questionCount: 2,
    title: "Java Basics",
  };

  afterEach(() => {
    generateTextMock.mockReset();
    parseJsonResponseMock.mockReset();
  });

  it("calls the text generator and parser, then returns a valid quiz", async () => {
    const rawModelText = "some raw model response";

    const parsedQuiz = {
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
    };

    generateTextMock.mockResolvedValue(rawModelText);
    parseJsonResponseMock.mockReturnValue(parsedQuiz);

    const result = await generateQuiz(context);

    expect(generateTextMock).toHaveBeenCalledOnce();
    expect(parseJsonResponseMock).toHaveBeenCalledWith(rawModelText);

    expect(result.title).toBe("Java Basics Quiz");
    expect(result.questions).toHaveLength(2);
    expect(result.questions[0]?.id).toBe("q1");
    expect(result.questions[0]?.options).toHaveLength(4);
  });

  it("throws when the parsed quiz shape is invalid", async () => {
    generateTextMock.mockResolvedValue("raw text");
    parseJsonResponseMock.mockReturnValue({
      questions: [
        {
          id: "q1",
          options: [
            { id: "a", text: "Only one" },
            { id: "b", text: "Only two" },
          ],
          prompt: "Broken question",
        },
      ],
      title: "Bad Quiz",
    });

    await expect(generateQuiz(context)).rejects.toThrow(
      "Quiz generator returned an invalid quiz shape.",
    );
  });
});
