import React, { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { Button, showErrorToast } from "../components/ui/index.js";
import { sendAIChatMessage } from "../services/api.js";

const WELCOME_MESSAGE = {
  role: "assistant",
  content:
    "Hi! I'm ArtisanAI 👋 Ask me about handmade products, gifts, materials, or the artisans behind Artisanect's catalog — I'm happy to help you find something special.",
};

const SUGGESTED_PROMPTS = [
  "Suggest a housewarming gift under ₹1000",
  "What's the difference between stoneware and terracotta?",
  "How do I care for a handwoven textile?",
];

/**
 * TypingIndicator
 * Three-dot animated bubble shown while ArtisanAI is composing a reply.
 */
function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 bg-white dark:bg-ink-light border border-ink/10 dark:border-paper/10 rounded-2xl rounded-bl-sm px-4 py-3 w-fit">
      <span className="w-1.5 h-1.5 rounded-full bg-ink/40 dark:bg-paper/40 animate-bounce [animation-delay:-0.3s]" />
      <span className="w-1.5 h-1.5 rounded-full bg-ink/40 dark:bg-paper/40 animate-bounce [animation-delay:-0.15s]" />
      <span className="w-1.5 h-1.5 rounded-full bg-ink/40 dark:bg-paper/40 animate-bounce" />
    </div>
  );
}

/**
 * ChatBubble
 * Renders a single message, styled differently for the user vs. ArtisanAI.
 *
 * @param {{ role: "user"|"assistant", content: string }} props
 */
function ChatBubble({ role, content }) {
  const isUser = role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] sm:max-w-[70%] px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
          isUser
            ? "bg-clay text-paper rounded-2xl rounded-br-sm"
            : "bg-white dark:bg-ink-light text-ink dark:text-paper border border-ink/10 dark:border-paper/10 rounded-2xl rounded-bl-sm"
        }`}
      >
        {content}
      </div>
    </div>
  );
}

/**
 * AIChat
 * /ai-chat — ArtisanAI, a chatbot scoped to handmade products, artisans,
 * shopping, gifts, home decor, materials, and craftsmanship. Keeps the
 * full conversation in local component state for the duration of the
 * session (no persistence) and sends prior turns with each request so
 * Gemini has conversational context.
 *
 * @returns {JSX.Element}
 */
function AIChat() {
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isSending]);

  async function sendMessage(text) {
    const trimmed = text.trim();
    if (!trimmed || isSending) return;

    const history = messages.map(({ role, content }) => ({ role, content }));
    const nextMessages = [...messages, { role: "user", content: trimmed }];
    setMessages(nextMessages);
    setInput("");
    setIsSending(true);

    try {
      const reply = await sendAIChatMessage(trimmed, history);
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (err) {
      showErrorToast(err.message || "ArtisanAI couldn't respond right now.");
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I couldn't process that just now. Please try again in a moment.",
        },
      ]);
    } finally {
      setIsSending(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    sendMessage(input);
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-paper dark:bg-ink transition-colors duration-300">
        <section className="max-w-3xl mx-auto px-5 sm:px-8 py-10 sm:py-14 flex flex-col h-[calc(100vh-4rem)]">
          <div className="mb-4">
            <span className="text-xs font-semibold uppercase tracking-widest text-clay">
              AI Assistant
            </span>
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-ink dark:text-paper mt-1">
              ArtisanAI Chat
            </h1>
            <p className="text-sm text-ink/60 dark:text-paper/60 mt-1">
              Ask about handmade products, gifts, artisans, materials, and craftsmanship.
            </p>
          </div>

          <div
            ref={scrollRef}
            className="flex-1 min-h-0 overflow-y-auto bg-paper-dark/40 dark:bg-ink-light/20 border border-ink/10 dark:border-paper/10 rounded-xl p-4 sm:p-6 flex flex-col gap-4"
          >
            {messages.map((m, i) => (
              <ChatBubble key={i} role={m.role} content={m.content} />
            ))}
            {isSending && <TypingIndicator />}
          </div>

          {messages.length <= 1 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {SUGGESTED_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => sendMessage(prompt)}
                  disabled={isSending}
                  className="text-xs font-medium text-ink/70 dark:text-paper/70 border border-ink/15 dark:border-paper/20 rounded-full px-3.5 py-1.5 hover:border-clay hover:text-clay transition-colors disabled:opacity-50"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex items-end gap-3 mt-4">
            <textarea
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage(input);
                }
              }}
              placeholder="Ask ArtisanAI about handmade products, gifts, or materials..."
              disabled={isSending}
              className="flex-1 resize-none rounded-md border border-ink/15 dark:border-paper/20 px-4 py-2.5 text-sm bg-white dark:bg-ink-light text-ink dark:text-paper placeholder:text-ink/40 dark:placeholder:text-paper/40 focus:outline-none focus:ring-2 focus:ring-clay/50 disabled:opacity-60"
            />
            <Button type="submit" variant="primary" disabled={isSending || !input.trim()}>
              Send
            </Button>
          </form>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default AIChat;
