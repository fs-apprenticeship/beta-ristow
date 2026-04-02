"use client";

import { useState } from "react";

type RunButtonProps = {
  className?: string;
  onRun: () => Promise<void>;
  pendingText?: string;
};

export function RunButton({
  className = "",
  onRun,
  pendingText = "Running...",
}: RunButtonProps) {
  const [running, setRunning] = useState(false);

  const handleClick = async () => {
    if (running) return;
    setRunning(true);
    try {
      await onRun();
    } finally {
      setRunning(false);
    }
  };

  return (
    <button
      className={`button primary block ${className}`}
      disabled={running}
      onClick={handleClick}
    >
      {running ? pendingText : "Run"}
    </button>
  );
}
