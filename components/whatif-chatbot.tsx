"use client";

import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";

import Image from "next/image";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const welcomeMessage: Message = {
  role: "assistant",
  content:
    "Hi! 👋 I'm the WhatIf AI Assistant. I can answer questions about WhatIf, explain how it works, and help you explore your decision maps. What would you like to know?",
};

const suggestions = [
  "What is WhatIf?",
  "How does WhatIf work?",
  "What can I do with WhatIf?",
];

export default function WhatIfChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([welcomeMessage]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen) {
      const timer = window.setTimeout(() => {
        inputRef.current?.focus();
      }, 200);

      return () => window.clearTimeout(timer);
    }
  }, [isOpen]);

  function getDecisionContext() {
    try {
      const graph = sessionStorage.getItem("whatif_graph");
      const scenario = sessionStorage.getItem("whatif_scenario");

      if (!graph && !scenario) {
        return "";
      }

      return `
CURRENT USER DECISION CONTEXT:

Scenario:
${scenario || "No scenario information available."}

Decision map:
${graph || "No decision map available."}

Use this context only when it is relevant to the user's question.
Do not invent missing details.
`;
    } catch {
      return "";
    }
  }

  async function sendMessage(messageText?: string) {
    const text = (messageText ?? input).trim();

    if (!text || isLoading) return;

    const updatedMessages: Message[] = [
      ...messages,
      {
        role: "user",
        content: text,
      },
    ];

    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: updatedMessages.slice(-12),
          decisionContext: getDecisionContext(),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error || "Something went wrong. Please try again."
        );
      }

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: data.reply,
        },
      ]);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Unable to connect right now. Please try again.";

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: errorMessage,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendMessage();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void sendMessage();
    }
  }

  function startNewChat() {
    setMessages([welcomeMessage]);
    setInput("");
  }

  return (
    <>
      {/* Floating chatbot launcher */}
      {!isOpen && (
        <button
          type="button"
          className="whatif-chat-launcher"
          onClick={() => setIsOpen(true)}
          aria-label="Open WhatIf AI Assistant"
        >
          <span className="whatif-launcher-logo">
            <Image
              src="/whatif-mark-black.png"
              alt="WhatIf"
              width={34}
              height={34}
              priority
            />
          </span>

          <span className="whatif-launcher-label">
            Ask WhatIf
          </span>
        </button>
      )}

      {/* Chat window */}
      {isOpen && (
        <section
          className="whatif-chat-window"
          aria-label="WhatIf AI Assistant"
        >
          {/* Orange header */}
          <header className="whatif-chat-header">
            <div className="whatif-chat-brand">
              <div className="whatif-chat-brand-logo">
                <Image
                  src="/whatif-mark-black.png"
                  alt="WhatIf icon"
                  width={38}
                  height={38}
                />
              </div>

              <div className="whatif-chat-brand-info">
                <h2>WhatIf Assistant</h2>

                <div className="whatif-chat-status">
                  <span className="whatif-status-dot" />
                  <span>Here to help you explore</span>
                </div>
              </div>
            </div>

            <div className="whatif-chat-header-actions">
              <button
                type="button"
                onClick={startNewChat}
                className="whatif-chat-header-button"
                aria-label="Start a new chat"
                title="New chat"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </button>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="whatif-chat-header-button"
                aria-label="Close chatbot"
                title="Close"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          </header>

          {/* Chat messages */}
          <div className="whatif-chat-messages">
            <div className="whatif-chat-intro">
              <span className="whatif-chat-intro-label">
                YOUR WHATIF GUIDE
              </span>

              <h3>
                Explore what
                <br />
                could be.
              </h3>

              <p>
                Ask me anything about WhatIf or get help understanding
                your decision possibilities.
              </p>
            </div>

            {messages.map((message, index) => (
              <div
                key={`${index}-${message.role}`}
                className={`whatif-message-row ${
                  message.role === "user"
                    ? "whatif-message-user-row"
                    : "whatif-message-assistant-row"
                }`}
              >
                {message.role === "assistant" && (
                  <div className="whatif-message-avatar">
                    <Image
                      src="/whatif-mark-black.png"
                      alt=""
                      width={23}
                      height={23}
                    />
                  </div>
                )}

                <div
                  className={`whatif-message-bubble ${
                    message.role === "user"
                      ? "whatif-user-bubble"
                      : "whatif-assistant-bubble"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}

            {messages.length === 1 && (
              <div className="whatif-chat-suggestions">
                <span>TRY ASKING</span>

                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => void sendMessage(suggestion)}
                    disabled={isLoading}
                  >
                    {suggestion}
                    <span>↗</span>
                  </button>
                ))}
              </div>
            )}

            {isLoading && (
              <div className="whatif-message-row whatif-message-assistant-row">
                <div className="whatif-message-avatar">
                  <Image
                    src="/whatif-mark-black.png"
                    alt=""
                    width={23}
                    height={23}
                  />
                </div>

                <div className="whatif-typing-bubble">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div className="whatif-chat-bottom">
            <form
              className="whatif-chat-form"
              onSubmit={handleSubmit}
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask WhatIf anything..."
                disabled={isLoading}
                maxLength={2000}
                aria-label="Message WhatIf Assistant"
              />

              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                aria-label="Send message"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m22 2-7 20-4-9-9-4Z" />
                  <path d="M22 2 11 13" />
                </svg>
              </button>
            </form>

            <p className="whatif-chat-disclaimer">
              Powered by WhatIf AI · Explore possibilities, not predictions.
            </p>
          </div>
        </section>
      )}
    </>
  );
}