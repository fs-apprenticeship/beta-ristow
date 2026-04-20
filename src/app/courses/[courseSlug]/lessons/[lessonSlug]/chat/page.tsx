"use client";

import React, { useCallback, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";

import requestStream from "@/lib/stream/request-stream";

import CodeBlock from "./codeblock";

interface Conversation {
  content: string;
  role: string;
}

export default function Home({
  params,
}: {
  params: Promise<{ courseSlug: string; lessonSlug: string }>;
}) {
  const { courseSlug, lessonSlug } = React.use(params);
  const [value, setValue] = React.useState<string>("");
  const [conversation, setConversation] = React.useState<Conversation[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const lastUserMessageRef = useRef<HTMLDivElement>(null);

  const autoGrow = useCallback(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  }, []);

  const handleInput = React.useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setValue(e.target.value);
      autoGrow();
    },
    [autoGrow],
  );

  const sendMessage = async (message: string) => {
    const chatHistory = [...conversation, { content: message, role: "user" }];
    setValue("");
    setConversation([...chatHistory, { content: "", role: "assistant" }]);

    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }, 10);

    let assistantMessage = "";
    let buffer = "";

    requestStream(
      `/api/courses/${courseSlug}/lessons/${lessonSlug}/chat`,
      async (chunk: string) => {
        buffer += chunk;
        const lines = buffer.split("\n");

        // Keep the last incomplete line in the buffer
        buffer = lines[lines.length - 1];

        for (let i = 0; i < lines.length - 1; i++) {
          const line = lines.at(i) ?? "";
          if (line.startsWith("data: ")) {
            // Extract the text delta from the "data: ${text}" format
            const raw = line.slice(6).trim();
            if (!raw) continue;
            try {
              const textDelta = JSON.parse(raw); // decode the JSON string
              assistantMessage += textDelta;

              setConversation((prev) => [
                ...prev.slice(0, -1),
                { content: assistantMessage, role: "assistant" },
              ]);
            } catch (error) {
              console.error("Failed to parse text delta:", error);
            }
          }
        }
      },
      {
        body: JSON.stringify({ messages: chatHistory }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      },
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && value.trim()) {
      e.preventDefault();
      sendMessage(value.trim());
    }
  };

  const handleSend = () => {
    if (value.trim()) {
      sendMessage(value.trim());
    }
  };

  useEffect(() => {
    autoGrow();
  }, [value, autoGrow]);

  useEffect(() => {
    if (lastUserMessageRef.current && chatContainerRef.current) {
      const container = chatContainerRef.current;
      const element = lastUserMessageRef.current;
      const scrollTarget = element.offsetTop - container.offsetTop;
      if (typeof container.scrollTo === "function") {
        container.scrollTo({ behavior: "smooth", top: scrollTarget });
      }
    }
  }, [conversation]);

  return (
    <>
      <main className="container">
        {/* Header */}
        <header
          style={{
            padding: "var(--pico-spacing) 0 calc(var(--pico-spacing) * 3)",
            textAlign: "center",
          }}
        >
          <h1>Hi there, I am AVA</h1>
          <p>
            <small>Ask me anything</small>
          </p>
        </header>

        {/* Chat area */}
        <div className="chat-area" ref={chatContainerRef}>
          {conversation.length === 0 && (
            <p
              style={{
                opacity: 0.6,
                padding: "calc(var(--pico-spacing) * 6) 0",
                textAlign: "center",
              }}
            >
              <small>Your conversation will appear here...</small>
            </p>
          )}

          {conversation.map((item, index) => {
            const isUser = item.role === "user";
            const isLastUser =
              isUser &&
              index ===
                [...conversation].map((c) => c.role).lastIndexOf("user");

            const body = (
              <ReactMarkdown components={{ code: CodeBlock }}>
                {item.content}
              </ReactMarkdown>
            );

            return isUser ? (
              <div
                className="grid"
                key={index}
                style={{ justifyItems: "end", marginBottom: "8px" }}
              >
                <article
                  ref={isLastUser ? lastUserMessageRef : null}
                  style={{ maxWidth: "70%" }}
                >
                  <span className="bubble-label">You</span>
                  {body}
                </article>
              </div>
            ) : (
              <div
                className="grid"
                key={index}
                style={{ justifyItems: "start", marginBottom: "8px" }}
              >
                <article style={{ maxWidth: "70%" }}>
                  <span className="bubble-label">AVA</span>
                  {body}
                </article>
              </div>
            );
          })}
        </div>

        {/* Input area */}
        <div className="chat-input-area">
          <div className="chat-input-row">
            <textarea
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              placeholder={
                "Type your message here...\nPress Enter to send • Shift + Enter for new line"
              }
              ref={textareaRef}
              value={value}
            />
            <button onClick={handleSend}>Send</button>
          </div>
          <p
            style={{
              marginTop: "calc(var(--pico-spacing) * 0.5)",
              textAlign: "center",
            }}
          >
            <small>
              You can paste multi-line code directly. AVA will see the
              formatting.
            </small>
          </p>
        </div>
      </main>
    </>
  );
}
