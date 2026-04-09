"use client";

import { useState } from "react";

import { evaluateChallengeAction } from "../_actions/evaluate-challenge-action";
import { submitChallengeAction } from "../_actions/submit-action";
import CodeEditor from "./code-editor";
import { RunButton } from "./run-button";
import EvaluationPanel from "./evaluation-panel";
import { SubmitButton } from "./submit-button";

interface Props {
  challengeId: string;
  starterCode: string;
}

interface Evaluation {
  correct: boolean;
  stdout?: string[];
  output?: string[];
  expectedOutput?: string[];
  testExamples?: string[];
  feedback?: string;
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
    <div className="container" style={{ width: "100%", padding: "1rem", marginTop: "2rem" }}>
      {/* Code Editor */}
      <CodeEditor code={userCode} onChange={setUserCode} />

      {/* Run Button */}
      <div style={{ marginTop: "1rem" }}>
        <RunButton onRun={handleRun} pendingText="Running..." />
      </div>

      {/* Evaluation and Feedback */}
      {evaluation && (
        <EvaluationPanel
          evaluation={evaluation}
          activeTab={activeTab}
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
