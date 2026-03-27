"use client";

import React from "react";
import { useFormStatus } from "react-dom";

type GenerateButtonProps = {
  children: React.ReactNode;
  className?: string;
  pendingText?: string;
};

export function GenerateButton({
  children,
  className = "",
  pendingText = "Generating...",
}: GenerateButtonProps) {
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
