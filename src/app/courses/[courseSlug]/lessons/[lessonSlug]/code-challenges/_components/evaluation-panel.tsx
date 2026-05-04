/* eslint-disable security/detect-object-injection */

"use client";

interface Evaluation {
  results: {
    output: string;
    passed: boolean;
    stdout: string;
  }[];
}

interface Props {
  activeTab: number;
  evaluation: Evaluation;
  setActiveTab: (index: number) => void;
  testCases: TestCase[];
}

interface TestCase {
  expectedOutput: string;
  input: string;
}

export default function EvaluationPanel({
  activeTab,
  evaluation,
  setActiveTab,
  testCases,
}: Props) {
  const results = evaluation.results;

  // Safety guard
  if (!results.length) return null;

  if (results.length !== testCases.length) {
    console.warn("Mismatch between results and testCases");
  }

  const safeIndex = Math.min(activeTab, results.length - 1);

  const activeResult = results[safeIndex];
  const activeTest = testCases[safeIndex];

  const passedCount = results.filter((r) => r.passed).length;
  const total = results.length;
  const allPassed = passedCount === total;

  return (
    <section
      style={{
        border: "1px solid #ccc",
        borderRadius: "0.5rem",
        marginTop: "1rem",
        padding: "1rem",
      }}
    >
      {/* Overall Result */}
      <p>
        <strong>Result:</strong> {allPassed ? "✅ Passed" : "❌ Failed"} (
        {passedCount}/{total})
      </p>

      {/* Tabs */}
      <div
        style={{
          borderBottom: "2px solid #ddd",
          display: "flex",
          marginTop: "1rem",
        }}
      >
        {results.map((result, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            style={{
              background: "none",
              border: "none",
              borderBottom:
                activeTab === index
                  ? `3px solid ${result.passed ? "blue" : "red"}`
                  : "3px solid transparent",
              color:
                activeTab === index ? (result.passed ? "blue" : "red") : "#666",
              cursor: "pointer",
              padding: "0.5rem 1rem",
            }}
          >
            Test {index + 1}
          </button>
        ))}
      </div>

      {/* Active Test Display */}
      {activeResult && activeTest && (
        <div
          style={{
            backgroundColor: activeResult.passed ? "#f9f9f9" : "#ffe5e5",
            border: "1px solid",
            borderColor: activeResult.passed ? "#ccc" : "red",
            borderRadius: "0.5rem",
            marginTop: "1rem",
            padding: "1rem",
          }}
        >
          <p>
            <strong>Input:</strong>
            <pre style={{ whiteSpace: "pre-wrap" }}>{activeTest.input}</pre>
          </p>

          <p>
            <strong>Expected Output:</strong>
            <pre style={{ whiteSpace: "pre-wrap" }}>
              {activeTest.expectedOutput}
            </pre>
          </p>

          <p>
            <strong>Your Output:</strong>
            <pre style={{ whiteSpace: "pre-wrap" }}>{activeResult.output}</pre>
          </p>

          {activeResult.stdout && (
            <p>
              <strong>StdOut:</strong>
              <pre style={{ whiteSpace: "pre-wrap" }}>
                {activeResult.stdout}
              </pre>
            </p>
          )}
        </div>
      )}
    </section>
  );
}
