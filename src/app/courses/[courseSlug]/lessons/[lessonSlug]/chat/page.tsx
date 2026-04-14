"use client";

import React, { useCallback, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";

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
    setConversation(chatHistory);

    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }, 10);

    const response = await fetch(
      `/api/courses/${courseSlug}/lessons/${lessonSlug}/chat`,
      {
        body: JSON.stringify({ messages: chatHistory }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      },
    );

    const data = await response.json();

    setConversation([
      ...chatHistory,
      { content: data.result.choices[0].message.content, role: "assistant" },
    ]);
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
      <style>{`
        .chat-area {
          overflow-y: auto;
          max-height: calc(100vh - 260px);
          margin-bottom: calc(var(--pico-spacing) * 4);
        }
        .chat-row {
          display: flex;
          width: 100%;
          margin-bottom: var(--pico-spacing);
        }
        .chat-row.user { justify-content: flex-end; }
        .chat-row.assistant { justify-content: flex-start; }
        .chat-bubble {
          max-width: 65%;
          margin: 0;
        }
        .chat-input-area {
          position: sticky;
          bottom: 0;
          background: var(--pico-background-color);
          padding: var(--pico-spacing);
          border-top: 1px solid var(--pico-muted-border-color);
          box-shadow: 0 -2px 6px rgba(0,0,0,0.05);
        }
        .chat-input-row {
          display: flex;
          gap: var(--pico-spacing);
          align-items: flex-end;
        }
        .chat-input-row textarea {
          flex: 1;
          margin: 0;
          resize: none;
          min-height: 52px;
          max-height: 200px;
          overflow-y: auto;
          font-family: inherit;
        }
        .chat-input-row button {
          margin: 0;
          width: auto;
          height: fit-content;
          align-self: flex-end;
        }
        .bubble-label {
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          opacity: 0.75;
          display: block;
          margin-bottom: calc(var(--pico-spacing) * 0.5);
        }
      `}</style>

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

            return (
              <div
                className={`chat-row ${isUser ? "user" : "assistant"}`}
                key={index}
                ref={isLastUser ? lastUserMessageRef : null}
              >
                <article className="chat-bubble">
                  <span className="bubble-label">{isUser ? "You" : "AVA"}</span>
                  <div
                    style={{
                      margin: 0,
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                    }}
                  >
                    <ReactMarkdown components={{ code: CodeBlock }}>
                      {item.content}
                    </ReactMarkdown>
                  </div>
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
