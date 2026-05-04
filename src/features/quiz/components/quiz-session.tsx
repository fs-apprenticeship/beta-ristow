"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import type { Quiz, QuizContext, UserAnswer } from "../types";
import type { QuizSessionStatus } from "./types";

import submitQuiz from "../actions/submit-quiz";
import QuizFormView from "./quiz-form-view";

type QuizSessionProps = {
  context: QuizContext;
  courseSlug: string;
  learnerId: string;
  lessonId: string;
  lessonSlug: string;
  quiz: Quiz;
};

export default function QuizSession({
  context,
  courseSlug,
  learnerId,
  lessonId,
  lessonSlug,
  quiz,
}: QuizSessionProps) {
  const router = useRouter();

  const [status, setStatus] = useState<QuizSessionStatus>("answering");

  const handleSubmit = async (answers: UserAnswer[]) => {
    setStatus("submitting");

    try {
      const attemptId = await submitQuiz({
        learnerId,
        lessonId,
        submission: {
          answers,
          context,
          quiz,
        },
      });

      router.push(
        `/courses/${courseSlug}/lessons/${lessonSlug}/quizzes/attempts/${attemptId}`,
      );
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  };

  return <QuizFormView onSubmit={handleSubmit} quiz={quiz} status={status} />;
}
