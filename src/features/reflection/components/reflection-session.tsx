"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import submitReflectionForm from "../actions/submit-reflection-form";
import {
  GeneratedReflection,
  ReflectionAnswer,
  ReflectionAnswers,
  ReflectionContext,
  ReflectionFeedback,
  ReflectionSessionStatus,
} from "../types";
import ReflectionFeedbackView from "./reflection-feedback-view";
import ReflectionFormView from "./reflection-form-view";

type ReflectionSessionProps = {
  context: ReflectionContext;
  reflectionQuestions: GeneratedReflection;
};

export default function ReflectionSession({
  context,
  reflectionQuestions,
}: ReflectionSessionProps) {
  const router = useRouter();
  const [status, setStatus] = useState<ReflectionSessionStatus>("answering");
  const [feedback, setFeedback] = useState<null | ReflectionFeedback>(null);
  const [submittedAnswers, setSubmittedAnswers] = useState<
    null | ReflectionAnswer[]
  >(null);

  const handleSubmit = async ({ answers }: ReflectionAnswers) => {
    setSubmittedAnswers(answers);
    setStatus("submitting");
    try {
      setSubmittedAnswers(answers);
      const result = await submitReflectionForm({
        answers,
        context,
        reflectionQuestions,
      });
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
        onBackToHome={() => {
          router.push("/");
        }}
        onBackToReflection={() => {
          setStatus("answering");
          setSubmittedAnswers(null);
          setFeedback(null);
        }}
      />
    );
  }

  return (
    <ReflectionFormView
      context={context}
      onSubmit={handleSubmit}
      reflectionQuestions={reflectionQuestions}
      status={status}
    />
  );
}
