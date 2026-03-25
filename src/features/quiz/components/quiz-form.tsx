"use client";

import { useMemo, useState } from "react";

import type { GeneratedQuiz, UserAnswer } from "../types";

type QuizFormProps = {
  quiz: GeneratedQuiz;
};

export default function QuizForm({ quiz }: QuizFormProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, string>
  >({});

  const totalQuestions = quiz.questions.length;

  const answeredQuestions = useMemo(() => {
    return quiz.questions.filter((question) => selectedAnswers[question.id])
      .length;
  }, [quiz.questions, selectedAnswers]);

  const isComplete = answeredQuestions === totalQuestions;

  function handleOptionChange(questionId: string, optionId: string) {
    setSelectedAnswers((current) => ({
      ...current,
      [questionId]: optionId,
    }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const answers: UserAnswer[] = quiz.questions.map((question) => ({
      questionId: question.id,
      selectedOptionId: selectedAnswers[question.id],
    }));

    console.log("Submitting quiz answers:", answers);
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

      <button disabled={!isComplete} type="submit">
        Submit Quiz
      </button>
    </form>
  );
}
