"use client";

import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

type Props = {
  children?: React.ReactNode;
  className?: string;
  inline?: boolean;
};

export default function CodeBlock({ children, className, inline }: Props) {
  const [copied, setCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || "");
  const code = String(children).replace(/\n$/, "");

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  if (!inline && match) {
    return (
      <div style={{ position: "relative" }}>
        <button
          onClick={handleCopy}
          style={{
            cursor: "pointer",
            fontSize: "12px",
            padding: "4px 8px",
            position: "absolute",
            right: 10,
            top: 10,
          }}
        >
          {copied ? "Copied!" : "Copy"}
        </button>

        <SyntaxHighlighter language={match[1]}>{code}</SyntaxHighlighter>
      </div>
    );
  }

  return <code className={className}>{children}</code>;
}
