"use client";

import { useState } from "react";

import { evaluateChallengeAction } from "../_actions/evaluate-challenge-action";
import CodeEditor from "./code-editor";
import { RunButton } from "./run-button";

interface Props {
  challengeId: string;
  starterCode: string;
}

export default function ChallengePageClient({
  challengeId,
  starterCode,
}: Props) {
  const [userCode, setUserCode] = useState(starterCode);
  const [evaluation, setEvaluation] = useState<null | {
    correct: boolean;
    feedback: string;
  }>(null);

  const handleRun = async () => {
    setEvaluation(null);
    const result = await evaluateChallengeAction(challengeId, userCode);
    setEvaluation(result);
  };

  return (
    <div className="container mt-6 max-w-3xl">
      {/* Code Editor */}
      <CodeEditor code={userCode} onChange={setUserCode} />

      {/* Run Button */}
      <div className="mt-3">
        <RunButton onRun={handleRun} pendingText="Running..." />
      </div>

      {/* Evaluation and Feedback */}
      {evaluation && (
        <section className="card mt-3">
          <div className="card-body-bg-light">
            <p>
              <strong>Result:</strong>{" "}
              {evaluation.correct ? "✅ Correct" : "❌ Incorrect"}
            </p>
            <p>
              <strong>Feedback:</strong> {evaluation.feedback}
            </p>
          </div>
        </section>
      )}
    </div>
  );
}
