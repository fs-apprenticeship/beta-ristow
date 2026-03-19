"use client";

import { useEffect, useState } from "react";

import requestStream from "@/lib/stream/request-stream";

export function StreamingDescription({ questionId }: { questionId: string }) {
  const [text, setText] = useState("");

  useEffect(() => {
    const stopStreaming = requestStream(
      `/api/onboarding-questions/${questionId}/description`,
      (chunk) => setText((currentText) => currentText + chunk),
    );

    return stopStreaming;
  }, [questionId]);

  return <>{text}</>;
}
