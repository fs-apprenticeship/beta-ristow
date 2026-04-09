/* eslint-disable security/detect-object-injection */

"use client";

interface Evaluation {
  correct: boolean;
  expectedOutput?: string[];
  feedback?: string;
  output?: string[];
  stdout?: string[];
  testExamples?: string[];
}

interface Props {
    activeTab: number;
    evaluation: Evaluation;
    setActiveTab: (index: number) => void;
}

export default function EvaluationPanel({
    activeTab,
    evaluation,
    setActiveTab
}: Props) {

    // Check if a test failed
  const normalize = (s: string) => s.trim().replace(/\r\n/g, "\n");

  const isTestFailing = (index: number) => {
    if (!evaluation || !evaluation.output || !evaluation.expectedOutput) return false;
    return normalize(evaluation.output[index] || "") !== normalize(evaluation.expectedOutput[index] || "");
  };

    return (
        <section
            style={{
                border: "1px solid #ccc",
                marginTop: "1rem",
                borderRadius: "0.5rem",
                padding: "1rem",
            }}
        >
            <p>
                <strong>Correct:</strong> {evaluation.correct ? "✅ Yes" : "❌ No"}
            </p>

            {/* Tabs */}
            <div
                style={{
                borderBottom: "2px solid #ddd",
                display: "flex",
                marginTop: "1rem",
                }}
            >
                {["Test 1", "Test 2", "Test 3"].map((tab, index) => (
                    <button
                        key={index}
                        onClick={() => setActiveTab(index)}
                        style={{
                            background: "none",
                            border: "none",
                            borderBottom:
                                activeTab === index
                                ? `3px solid ${isTestFailing(index) ? "red" : "blue"}`
                                : "3px solid transparent",
                            color:
                                activeTab === index
                                ? isTestFailing(index)
                                    ? "red"
                                    : "blue"
                                : "#666",
                            fontWeight: 500,
                            marginRight: "0.25rem",
                            padding: "0.5rem 1rem",
                            cursor: "pointer",
                        }}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Content */}
            {evaluation.testExamples && evaluation.testExamples[activeTab] && (
                <div
                    style={{
                        border: "1px solid",
                        borderColor: isTestFailing(activeTab) ? "red" : "#ccc",
                        backgroundColor: isTestFailing(activeTab)
                        ? "#ffe5e5"
                        : "#f9f9f9",
                        padding: "1rem",
                        borderRadius: "0.5rem",
                        marginTop: "1rem",
                    }}
                >
                <p>
                    <strong>Input Used:</strong>
                    <pre style={{ whiteSpace: "pre-wrap" }}>
                        {evaluation.testExamples[activeTab]}
                    </pre>
                </p>

                {evaluation.stdout?.[activeTab] && (
                    <p>
                        <strong>StdOut:</strong>
                        <pre style={{ whiteSpace: "pre-wrap" }}>
                            {evaluation.stdout[activeTab]}
                        </pre>
                    </p>
                )}

                {evaluation.output?.[activeTab] && (
                    <p>
                        <strong>Output:</strong>
                        <pre style={{ whiteSpace: "pre-wrap" }}>
                            {evaluation.output[activeTab]}
                        </pre>
                    </p>
                )}

                {evaluation.expectedOutput?.[activeTab] && (
                    <p>
                        <strong>Expected Output:</strong>
                        <pre style={{ whiteSpace: "pre-wrap" }}>
                            {evaluation.expectedOutput[activeTab]}
                        </pre>
                    </p>
                )}
                </div>
            )}
            </section>
    )

}