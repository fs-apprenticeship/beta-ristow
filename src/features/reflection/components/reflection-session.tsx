"use client";

import { useState } from "react";

import submitReflectionForm from "../actions/submit-reflection-form";
import { GeneratedReflection, ReflectionAnswers, ReflectionContext, ReflectionFeedback , ReflectionSessionStatus } from "../types";
import ReflectionFeedbackView from "./reflection-feedback-view";
import ReflectionFormView from "./reflection-form-view";

type ReflectionSessionProps = {
  context: ReflectionContext;
  reflectionQuestions: GeneratedReflection;
};

export default function ReflectionSession({ context, reflectionQuestions }: ReflectionSessionProps) {
  const [status, setStatus] = useState<ReflectionSessionStatus>("answering");
  const [feedback, setFeedback] = useState<null | ReflectionFeedback>(null);
  const [submittedAnswers, setSubmittedAnswers] = useState<null | ReflectionAnswers>(
    null,
  );

  const handleSubmit = async (answers: ReflectionAnswers) => {
    console.log("Submitting reflection answers:", answers);
    setSubmittedAnswers(answers);

    // next step:
    setStatus("submitting");
    try {
      setSubmittedAnswers(answers);

      // call server-side feedback generation
      const result = await submitReflectionForm({ answers, context, reflectionQuestions });
      setFeedback(result);
      setStatus("submitted");
    } catch (error) {
      console.log(error);
      setStatus("error");
    }
  };

  if (status === "submitted" && submittedAnswers && feedback) {
    return (
      <ReflectionFeedbackView
        feedback={feedback}
        lessonTitle={reflectionQuestions.title}
        onBackToReflection={() => setStatus("answering")}
      />
    );
  }

  return <ReflectionFormView context={context} onSubmit={handleSubmit} reflectionQuestions={reflectionQuestions} status={status} />;
}
