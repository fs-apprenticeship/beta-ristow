"use client";

import React from "react";
import { useFormStatus } from "react-dom";

type SubmitButtonProps = {
  children: React.ReactNode;
  className?: string;
  pendingText?: string;
};

export function SubmitButton({
  children,
  className = "",
  pendingText = "Submitting...",
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      className={`button primary block ${className}`}
      disabled={pending}
      type="submit"
    >
      {pending ? pendingText : children}
    </button>
  );
}
