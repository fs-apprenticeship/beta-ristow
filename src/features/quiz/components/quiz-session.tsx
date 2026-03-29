"use client";

import { useState } from "react";

import submitQuiz from "../actions/submit-quiz";
import { GeneratedQuiz, QuizContext, QuizFeedback, UserAnswer } from "../types";
import QuizFeedbackView from "./quiz-feedback-view";
import QuizFormView from "./quiz-form-view";
import { QuizSessionStatus } from "./types";

type QuizSessionProps = {
  context: QuizContext;
  quiz: GeneratedQuiz;
};

export default function QuizSession({ context, quiz }: QuizSessionProps) {
  const [status, setStatus] = useState<QuizSessionStatus>("answering");
  const [feedback, setFeedback] = useState<null | QuizFeedback>(null);
  const [submittedAnswers, setSubmittedAnswers] = useState<null | UserAnswer[]>(
    null,
  );

  const handleSubmit = async (answers: UserAnswer[]) => {
    console.log("Submitting quiz answers:", answers);
    setSubmittedAnswers(answers);

    // next step:
    setStatus("submitting");
    try {
      setSubmittedAnswers(answers);

      // call server-side feedback generation
      const result = await submitQuiz({ answers, context, quiz });
      setFeedback(result);
      setStatus("submitted");
    } catch (error) {
      console.log(error);
      setStatus("error");
    }
  };

  if (status === "submitted" && submittedAnswers && feedback) {
    return (
      <QuizFeedbackView
        answers={submittedAnswers}
        feedback={feedback}
        onBackToQuiz={() => setStatus("answering")}
        quiz={quiz}
      />
    );
  }

  return <QuizFormView onSubmit={handleSubmit} quiz={quiz} status={status} />;
}
