import type { QuizContext } from "./types";

type BuildQuizContextOptions = {
  extraInstructions?: string;
  questionCount?: number;
  quizTitle?: string;
};

type LessonForQuizContext = {
  description: string;
  outcomes: string;
  title: string;
};

export default function buildQuizContext(
  lesson: LessonForQuizContext,
  options: BuildQuizContextOptions = {},
): QuizContext {
  return {
    content: [
      `Lesson Title: ${lesson.title}`,
      `Description: ${lesson.description}`,
      `Outcomes: ${lesson.outcomes}`,
    ].join("\n\n"),
    extraInstructions: options.extraInstructions,
    questionCount: options.questionCount ?? 15,
    quizTitle: options.quizTitle,
    title: lesson.title,
  };
}
