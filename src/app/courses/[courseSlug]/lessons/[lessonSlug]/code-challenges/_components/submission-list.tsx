"use client";

import { useState } from "react";

interface Props {
  submissions: Submission[];
}

interface Submission {
  correct: boolean;
  createdAt: string;
  feedback: string;
  id: string;
  userCode: string;
}

export default function SubmissionList({ submissions }: Props) {
  const [selectedId, setSelectedId] = useState<null | string>(
    submissions[0]?.id ?? null,
  );

  const selectedSubmission = submissions.find((sub) => sub.id === selectedId);

  return (
    <div style={{ marginTop: "2rem" }}>
      <h3>Submissions</h3>

      {submissions.length === 0 ? (
        <p>No submissions yet.</p>
      ) : (
        <div style={{ display: "flex", gap: "1rem" }}>
          {/* LEFT SIDE (LIST)*/}
          <div
            style={{
              borderRight: "1px solid #ddd",
              width: "200px",
            }}
          >
            {submissions.map((sub) => {
              const date = new Date(sub.createdAt).toLocaleString();

              return (
                <div
                  key={sub.id}
                  onClick={() => setSelectedId(sub.id)}
                  style={{
                    backgroundColor:
                      sub.id === selectedId ? "#f0f0f0" : "transparent",
                    borderBottom: "1px solid #eee",
                    cursor: "pointer",
                    padding: "0.75rem",
                  }}
                >
                  {date}
                </div>
              );
            })}
          </div>

          {/* RIGHT SIDE (DETAIL VIEW) */}
          <div style={{ flex: 1 }}>
            {selectedSubmission ? (
              <div
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  padding: "1rem",
                }}
              >
                <p>
                  <strong>
                    {selectedSubmission.correct ? "✅ Correct" : "❌ Incorrect"}
                  </strong>
                </p>

                <p>{selectedSubmission.feedback}</p>

                <pre>{selectedSubmission.userCode}</pre>
              </div>
            ) : (
              <p>Select a submission</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
