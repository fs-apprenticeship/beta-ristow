"use client";

import React, { useRef } from "react";
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
  params: { courseSlug: string; lessonSlug: string };
}) {
  const [value, setValue] = React.useState<string>("");
  const [conversation, setConversation] = React.useState<Conversation[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInput = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value);
    },
    [],
  );

  const sendMessage = async (message: string) => {
    const chatHistory = [...conversation, { content: message, role: "user" }];
    setValue("");
    setConversation([...chatHistory, { content: "", role: "assistant" }]);

    let assistantMessage = "";
    let buffer = "";

    const abort = requestStream(
      `/api/courses/${params.courseSlug}/lessons/${params.lessonSlug}/chat`,
      async (chunk: string) => {
        buffer += chunk;
        const lines = buffer.split("\n");

        // Keep the last incomplete line in the buffer
        buffer = lines[lines.length - 1];

        for (let i = 0; i < lines.length - 1; i++) {
          const line = lines[i];
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && value.trim()) {
      sendMessage(value.trim());
    }
  };

  const handleSend = () => {
    if (value.trim()) {
      sendMessage(value.trim());
    }
  };

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
        box-shadow: inset 0 2px 4px rgba(0,0,0,0.05); /* soft inner shadow */
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
        align-items: center;
      }
      .chat-input-row input {
        flex: 1;
        margin: 0;
      }

      .chat-input-row input:focus {
        border-color: var(--pico-color);
        box-shadow: 0 0 0 2px rgba(0,0,0,0.05);
      }

      .chat-input-row button {
        margin: 0;
        width: auto;
        padding: 0.5em 1.2em;
        border-radius: var(--pico-border-radius);
        background-color: var(--pico-color);
        color: var(--pico-background-color);
        border: none;
        cursor: pointer;
        transition: background 0.2s ease;
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
            <input
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              placeholder="Enter a message"
              ref={inputRef}
              type="text"
              value={value}
            />
            <button onClick={handleSend}>Send</button>
          </div>
          <p className="chat-hint">Press Enter to send</p>
        </div>
      </main>
    </>
  );
}
