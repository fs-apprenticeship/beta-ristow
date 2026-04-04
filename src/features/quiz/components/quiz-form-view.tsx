"use client";

import { useMemo, useState } from "react";

import { GeneratedQuiz, UserAnswer } from "../types";
import { QuizSessionStatus } from "./types";

type QuizFormViewProps = {
  onSubmit: (answers: UserAnswer[]) => void;
  quiz: GeneratedQuiz;
  status: QuizSessionStatus;
};
export default function QuizFormView({
  onSubmit,
  quiz,
  status,
}: QuizFormViewProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, string>
  >({});

  const totalQuestions = quiz.questions.length;

  const answeredQuestions = useMemo(() => {
    return quiz.questions.filter((question) => selectedAnswers[question.id])
      .length;
  }, [quiz.questions, selectedAnswers]);

  const isComplete = answeredQuestions === totalQuestions;
  const isSubmitting = status === "submitting";

  function handleOptionChange(questionId: string, optionId: string) {
    setSelectedAnswers((current) => ({
      ...current,
      [questionId]: optionId,
    }));
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const answers: UserAnswer[] = quiz.questions.map((question) => ({
      questionId: question.id,
      selectedOptionId: selectedAnswers[question.id],
    }));

    onSubmit(answers);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>{quiz.title}</h1>
      <p>
        <strong>
          Answered {answeredQuestions} of {totalQuestions}
        </strong>
      </p>

      {quiz.questions.map((question, index) => (
        <fieldset key={question.id}>
          <legend>
            <strong>
              Question {index + 1}: {question.prompt}
            </strong>
          </legend>

          {question.options.map((option) => {
            const inputId = `${question.id}-${option.id}`;

            return (
              <label htmlFor={inputId} key={option.id}>
                <input
                  checked={selectedAnswers[question.id] === option.id}
                  id={inputId}
                  name={question.id}
                  onChange={() => handleOptionChange(question.id, option.id)}
                  type="radio"
                  value={option.id}
                />
                {option.text}
              </label>
            );
          })}
        </fieldset>
      ))}

      {status === "error" && (
        <p>
          <strong>Something went wrong while submitting the quiz.</strong>
        </p>
      )}

      <button disabled={!isComplete || isSubmitting} type="submit">
        {isSubmitting ? "Submitting..." : "Submit Quiz"}
      </button>
    </form>
  );
}
