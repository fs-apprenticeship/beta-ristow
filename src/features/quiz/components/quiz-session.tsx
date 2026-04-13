"use client";

import { useState } from "react";

import type { Quiz, QuizContext, QuizFeedback, UserAnswer } from "../types";
import type { QuizSessionStatus } from "./types";

import submitQuiz from "../actions/submit-quiz";
import QuizFeedbackView from "./quiz-feedback-view";
import QuizFormView from "./quiz-form-view";

type QuizSessionProps = {
  context: QuizContext;
  learnerId: string;
  lessonId: string;
  quiz: Quiz;
};

export default function QuizSession({
  context,
  learnerId,
  lessonId,
  quiz,
}: QuizSessionProps) {
  const [status, setStatus] = useState<QuizSessionStatus>("answering");
  const [feedback, setFeedback] = useState<null | QuizFeedback>(null);
  const [submittedAnswers, setSubmittedAnswers] = useState<null | UserAnswer[]>(
    null,
  );

  const handleSubmit = async (answers: UserAnswer[]) => {
    setSubmittedAnswers(answers);
    setStatus("submitting");

    try {
      const result = await submitQuiz({
        learnerId,
        lessonId,
        submission: {
          answers,
          context,
          quiz,
        },
      });

      setFeedback(result);
      setStatus("submitted");
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  };

  if (status === "submitted" && submittedAnswers && feedback) {
    return (
      <QuizFeedbackView
        feedback={feedback}
        onBackToQuiz={() => setStatus("answering")}
        quizTitle={quiz.title}
      />
    );
  }

  return <QuizFormView onSubmit={handleSubmit} quiz={quiz} status={status} />;
}
