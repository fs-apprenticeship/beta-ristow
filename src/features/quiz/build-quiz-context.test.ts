import { describe, expect, it } from "vitest";

import buildQuizContext from "./build-quiz-context";

describe("buildQuizContext", () => {
  it("builds quiz context from lesson fields", () => {
    const lesson = {
      description: "Introduction to variables and data types.",
      outcomes: "Understand variables, types, and assignments.",
      title: "Java Basics",
    };

    const result = buildQuizContext(lesson);

    expect(result.title).toBe("Java Basics");
    expect(result.content).toContain("Lesson Title: Java Basics");
    expect(result.content).toContain(
      "Description: Introduction to variables and data types.",
    );
    expect(result.content).toContain(
      "Outcomes: Understand variables, types, and assignments.",
    );
    expect(result.questionCount).toBe(15);
  });
});
