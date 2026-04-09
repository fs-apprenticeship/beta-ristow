"use client";

import React, { useCallback, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";

import CodeBlock from "./codeblock";

interface Conversation {
  content: string;
  role: string;
}

// export default function Home({
//   params,
// }: {
//   params: { courseSlug: string; lessonSlug: string };
// }) {

export default function Home({
  params,
}: {
  params: Promise<{ courseSlug: string; lessonSlug: string }>;
}) {
  const { courseSlug, lessonSlug } = React.use(params);
  const [value, setValue] = React.useState<string>("");
  const [conversation, setConversation] = React.useState<Conversation[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-grow the textarea - moved up and wrapped in useCallback
  const autoGrow = useCallback(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`; // max ~200px
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
    const response = await fetch(
      `/api/courses/${courseSlug}/lessons/${lessonSlug}/chat`,
      {
        body: JSON.stringify({ messages: chatHistory }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      },
    );

    const data = await response.json();

    setValue("");
    setConversation([
      ...chatHistory,
      { content: data.result.choices[0].message.content, role: "assistant" },
    ]);

    // Reset textarea height after sending
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }, 10);
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

  // Run autoGrow when value changes
  useEffect(() => {
    autoGrow();
  }, [value, autoGrow]);

  return (
    <>
      <style>{`
      .chat-page {
        min-height: 100vh;
      }
      .chat-header {
        text-align: center;
        padding: var(--pico-spacing) 0 calc(var(--pico-spacing) * 3);
      }
      .chat-header h1 {
        font-size: 2.5rem;
        font-weight: 700;
        margin-bottom: var(--pico-spacing);
      }
      .chat-header p {
        opacity: 0.7;
        font-size: 1.1rem;
      }
      .chat-area {
        min-height: 500px;
        margin-bottom: calc(var(--pico-spacing) * 4);
        padding: var(--pico-spacing);
        border-radius: var(--pico-border-radius);
        gap: var(--pico-spacing);
        box-shadow: inset 0 2px 4px rgba(0,0,0,0.05);
      }
      .chat-empty {
        text-align: center;
        opacity: 0.6;
        padding: calc(var(--pico-spacing) * 6) 0;
        font-size: 1.1rem;
      }
      .chat-row {
        display: flex;
        width: 100%;
        margin-bottom: calc(var(--pico-spacing) * 1.5);
      }
      .chat-row.user { justify-content: flex-end; }
      .chat-row.assistant { justify-content: flex-start; }
      .chat-bubble {
        max-width: 65%;
        padding: var(--pico-spacing) calc(var(--pico-spacing) * 1.25);
        border-radius: var(--pico-border-radius);
        line-height: 1.6;
        font-size: 0.97rem;
        margin: 0;
        border: 1px solid var(--pico-muted-border-color);
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
      }

      .chat-bubble pre {
        background-color: var(--pico-code-background-color);
        border-radius: var(--pico-border-radius);
        padding: var(--pico-spacing);
        font-size: 0.85rem;
        overflow-x: auto;
      }

      .chat-bubble code {
        background-color: var(--pico-code-background-color);
        padding: 2px 6px;
        border-radius: calc(var(--pico-border-radius) / 2);
      }

      .chat-user {
        background-color: var(--pico-secondary-background);
        color: var(--pico-secondary-inverse);
        border-bottom-left-radius: 4px;
      }
      .chat-assistant {
        background-color: var(--pico--card-background-color);
        color: var(--pico-color);
        border-bottom-right-radius: 4px;
      }
      .bubble-label {
        display: block;
        font-size: 0.65rem;
        font-weight: 700;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        opacity: 0.75;
        margin-bottom: calc(var(--pico-spacing) * 0.5);
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
        padding: 0.75rem;
        border: 1px solid var(--pico-muted-border-color);
        border-radius: var(--pico-border-radius);
        background: var(--pico-background-color);
        color: var(--pico-color);
        font-size: 0.97rem;
        line-height: 1.5;
        resize: none;
        min-height: 52px;
        max-height: 200px;
        overflow-y: auto;
        font-family: inherit;
      }
      .chat-input-row textarea:focus {
        border-color: var(--pico-color);
        box-shadow: 0 0 0 2px rgba(0,0,0,0.05);
        outline: none;
      }
      .chat-input-row button {
        margin: 0;
        width: auto;
        padding: 0.75em 1.4em;
        border-radius: var(--pico-border-radius);
        background-color: var(--pico-color);
        color: var(--pico-background-color);
        border: none;
        cursor: pointer;
        transition: background 0.2s ease;
        height: fit-content;
        align-self: flex-end;
      }
      .chat-hint {
        text-align: center;
        font-size: 0.75rem;
        opacity: 0.5;
        margin-top: calc(var(--pico-spacing) * 0.5);
      }
      `}</style>

      <main className="container chat-page">
        <section className="chat-header">
          <h1>Hi there, I am AVA</h1>
          <p>Ask me anything</p>
        </section>

        <div className="chat-area">
          {conversation.length === 0 && (
            <p className="chat-empty">Your conversation will appear here...</p>
          )}
          {conversation.map((item, index) => {
            const isUser = item.role === "user";
            return (
              <div
                className={`chat-row ${isUser ? "user" : "assistant"}`}
                key={index}
              >
                <article
                  className={`chat-bubble ${isUser ? "chat-user" : "chat-assistant"}`}
                >
                  <span className="bubble-label">{isUser ? "YOU" : "AVA"}</span>
                  <div
                    style={{
                      margin: 0,
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                    }}
                  >
                    <ReactMarkdown
                      components={{
                        code: CodeBlock,
                      }}
                    >
                      {item.content}
                    </ReactMarkdown>
                  </div>
                </article>
              </div>
            );
          })}
        </div>

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
          <p className="chat-hint">
            You can paste multi-line code directly. AVA will see the formatting.
          </p>
        </div>
      </main>
    </>
  );
}
