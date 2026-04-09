"use client";

import { useState } from "react";

import { evaluateChallengeAction } from "../_actions/evaluate-challenge-action";
import { submitChallengeAction } from "../_actions/submit-action";
import CodeEditor from "./code-editor";
import EvaluationPanel from "./evaluation-panel";
import { RunButton } from "./run-button";
import { SubmitButton } from "./submit-button";

interface Evaluation {
  correct: boolean;
  expectedOutput?: string[];
  feedback?: string;
  output?: string[];
  stdout?: string[];
  testExamples?: string[];
}

interface Props {
  challengeId: string;
  starterCode: string;
}

export default function ChallengePageClient({
  challengeId,
  starterCode,
}: Props) {
  const [userCode, setUserCode] = useState(starterCode);
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [activeTab, setActiveTab] = useState(0)

  const handleRun = async () => {
    setEvaluation(null);
    const result = await evaluateChallengeAction(challengeId, userCode);
    setEvaluation(result);
  };

  return (
    <div className="container" style={{ marginTop: "2rem", padding: "1rem", width: "100%" }}>
      {/* Code Editor */}
      <CodeEditor code={userCode} onChange={setUserCode} />

      {/* Run Button */}
      <div style={{ marginTop: "1rem" }}>
        <RunButton onRun={handleRun} pendingText="Running..." />
      </div>

      {/* Evaluation and Feedback */}
      {evaluation && (
        <EvaluationPanel
          activeTab={activeTab}
          evaluation={evaluation}
          setActiveTab={setActiveTab}
        />
      )}

      <div style={{ marginTop: "1rem" }}>
        <SubmitButton
          onSubmit={async () => {
            await handleRun();
            await submitChallengeAction(challengeId, userCode);
          }}
          pendingText="Submitting..."
        />
      </div>
    </div>
  );
}
