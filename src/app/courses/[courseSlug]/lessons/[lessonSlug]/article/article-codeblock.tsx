"use client";

import {
  type ReactNode,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  oneDark,
  oneLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";

const CODE_LANGUAGE_FROM_CLASS = /language-(\w+)/;
const COPY_FEEDBACK_MS = 1500;
const PREFERS_DARK_QUERY = "(prefers-color-scheme: dark)";

type Props = {
  children?: ReactNode;
  className?: string;
  inline?: boolean;
};

export default function ArticleCodeBlock({
  children,
  className,
  inline,
}: Props) {
  const [copied, setCopied] = useState(false);
  const copyResetTimerRef = useRef<null | ReturnType<typeof setTimeout>>(null);
  const code = String(children).replace(/\n$/, "");
  const prefersDark = useSyncExternalStore(
    (onChange) => {
      const mediaQuery = window.matchMedia(PREFERS_DARK_QUERY);
      mediaQuery.addEventListener("change", onChange);
      return () => mediaQuery.removeEventListener("change", onChange);
    },
    () => window.matchMedia(PREFERS_DARK_QUERY).matches,
    () => false,
  );

  useEffect(() => {
    return () => {
      if (copyResetTimerRef.current) {
        clearTimeout(copyResetTimerRef.current);
      }
    };
  }, []);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    if (copyResetTimerRef.current) {
      clearTimeout(copyResetTimerRef.current);
    }
    setCopied(true);
    copyResetTimerRef.current = setTimeout(() => {
      setCopied(false);
      copyResetTimerRef.current = null;
    }, COPY_FEEDBACK_MS);
  };

  const isCompact = Boolean(inline) || !code.includes("\n");
  if (isCompact) {
    return <code className={className}>{code}</code>;
  }

  const languageMatch = CODE_LANGUAGE_FROM_CLASS.exec(className ?? "");
  const language = languageMatch?.[1] ?? "text";
  const prismTheme = prefersDark ? oneDark : oneLight;

  return (
    <div
      style={{
        marginBottom: "var(--pico-spacing)",
        position: "relative",
      }}
    >
      <button
        onClick={handleCopy}
        style={{
          cursor: "pointer",
          fontSize: "12px",
          padding: "4px 8px",
          position: "absolute",
          right: 10,
          top: 10,
          zIndex: 1,
        }}
        type="button"
      >
        {copied ? "Copied!" : "Copy"}
      </button>

      <SyntaxHighlighter
        customStyle={{
          borderRadius: "var(--pico-border-radius)",
          fontSize: "0.85rem",
          margin: 0,
          padding: "calc(var(--pico-spacing) * 1.25)",
          paddingTop: "calc(var(--pico-spacing) * 2.25)",
        }}
        language={language}
        style={prismTheme}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
