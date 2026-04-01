"use client";

import { useState } from "react";

export function SubmitButton({
  className = "",
  onSubmit,
  pendingText = "Submitting...",
}: {
  className?: string;
  onSubmit: () => Promise<void>;
  pendingText?: string;
}) {
  const [submitting, setSubmitting] = useState(false);

  const handleClick = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      await onSubmit();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <button
      className={`button success block ${className}`}
      disabled={submitting}
      onClick={handleClick}
    >
      {submitting ? pendingText : "Submit"}
    </button>
  );
}
