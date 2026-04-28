"use client";

import { useEffect, useState } from "react";

import { evaluateChallengeAction } from "../_actions/evaluate-challenge-action";
import { getChallengeSubmissionsAction } from "../_actions/get-challenge-submissions-action";
import { submitChallengeAction } from "../_actions/submit-action";
import CodeEditor from "./code-editor";
import EvaluationPanel from "./evaluation-panel";
import { RunButton } from "./run-button";
import SubmissionList from "./submission-list";
import { SubmitButton } from "./submit-button";

interface Evaluation {
  results: {
    output: string;
    stdout: string;
    passed: boolean;
  }[];
}

interface Props {
  challengeId: string;
  starterCode: string;
  testCases: {
    input: string;
    expectedOutput: string;
  }[];
}

interface Submission {
  correct: boolean;
  createdAt: string;
  feedback: string;
  id: string;
  userCode: string;
}

export default function ChallengePageClient({
  challengeId,
  starterCode,
  testCases,
}: Props) {
  const [userCode, setUserCode] = useState(starterCode);
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  useEffect(() => {
    const load = async () => {
      const data = await getChallengeSubmissionsAction(challengeId);

      setSubmissions(data);

      console.log("submissions:", data);
    };
    load();
  }, [challengeId]);

  const handleRun = async () => {
    setEvaluation(null);
    const result = await evaluateChallengeAction(challengeId, userCode);
    setEvaluation(result);
  };

  return (
    <div
      className="container"
      style={{ marginTop: "2rem", padding: "1rem", width: "100%" }}
    >
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
          testCases={testCases}
          setActiveTab={setActiveTab}
        />
      )}

      <div style={{ marginTop: "1rem" }}>
        <SubmitButton
          onSubmit={async () => {
            // await handleRun();
            await submitChallengeAction(challengeId, userCode);

            const updated = await getChallengeSubmissionsAction(challengeId);

            setSubmissions(updated);
          }}
          pendingText="Submitting..."
        />
      </div>

      <SubmissionList submissions={submissions} />
    </div>
  );
}
