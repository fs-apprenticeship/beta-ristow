"use client";

import { useState } from "react";

import type {
  GeneratedReflection,
  ReflectionAnswer,
  ReflectionAnswers,
  ReflectionContext,
  ReflectionSessionStatus,
} from "../types";

type ReflectionSessionProps = {
  context: ReflectionContext;
  onSubmit: (answers: ReflectionAnswers) => void;
  reflectionQuestions: GeneratedReflection;
  status: ReflectionSessionStatus;
};

export default function ReflectionSession({
  onSubmit,
  reflectionQuestions,
  status,
}: ReflectionSessionProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const totalQuestions = reflectionQuestions.questions.length;

  const answeredQuestions = reflectionQuestions.questions.filter((question) =>
    answers[question.id]?.trim(),
  ).length;

  const isComplete = answeredQuestions === totalQuestions;
  const isSubmitting = status === "submitting";

  const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    const reflectionAnswers: ReflectionAnswer[] =
      reflectionQuestions.questions.map((question) => ({
        answer: answers[question.id]?.trim() ?? "",
        questionId: question.id,
      }));

    onSubmit({ answers: reflectionAnswers });
  };

  return (
    <form onSubmit={handleSubmit}>
      <p>
        <strong>
          Answered {answeredQuestions} of {totalQuestions}
        </strong>
      </p>

      {reflectionQuestions.questions.map((question, index) => (
        <fieldset key={question.id}>
          <legend>Question {index + 1}</legend>
          <label htmlFor={question.id}>
            <strong>{question.prompt}</strong>
          </label>
          <textarea
            id={question.id}
            onChange={(e) =>
              setAnswers((prev) => ({ ...prev, [question.id]: e.target.value }))
            }
            value={answers[question.id] ?? ""}
          />
        </fieldset>
      ))}

      {status === "error" && (
        <p>
          <strong>
            Something went wrong while submitting the reflection answers.
          </strong>
        </p>
      )}

      <button disabled={!isComplete || isSubmitting} type="submit">
        {isSubmitting ? "Submitting..." : "Submit Reflection Answers"}
      </button>
    </form>
  );
}
