"use client";

import { useState } from "react";

import type { GeneratedReflection, ReflectionAnswer } from "../types";

type ReflectionFormProps = {
  reflection: GeneratedReflection;
};

export default function ReflectionForm({ reflection }: ReflectionFormProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const totalQuestions = reflection.questions.length;

  const answeredQuestions = reflection.questions.filter((question) =>
    answers[question.id]?.trim(),
  ).length;

  const isComplete = answeredQuestions === totalQuestions;

  function handleSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    const reflectionAnswers: ReflectionAnswer[] = reflection.questions.map(
      (question) => ({
        answer: answers[question.id]?.trim() ?? "",
        questionId: question.id,
      }),
    );

    console.log("Submitting reflection answers:", reflectionAnswers);
    // next step:
    // call server action
  }

  return (
    <form onSubmit={handleSubmit}>
      <p>
        <strong>
          Answered {answeredQuestions} of {totalQuestions}
        </strong>
      </p>

      {reflection.questions.map((question, index) => (
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

      <button disabled={!isComplete} type="submit">
        Submit Reflection
      </button>
    </form>
  );
}
