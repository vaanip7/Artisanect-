import React, { useEffect, useRef, useState } from "react";
import { sendChatMessage } from "../services/api.js";

/**
 * AIChat — floating "Kala" assistant widget.
 * Lives in App.jsx so it's available on every page.
 * Uses POST /api/ai/chat with full conversation history.
 */
function AIChat() {
  const [isOpen,   setIsOpen]   = useState(false);
  const [history,  setHistory]  = useState([]);   // [{ role:"user"|"model", parts: string }]
  const [input,    setInput]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const bottomRef  = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    if (isOpen) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, isOpen]);

  // Greeting when first opened
  useEffect(() => {
    if (isOpen && history.length === 0) {
      setHistory([{
        role:  "model",
        parts: "Namaste! 🙏 I'm Kala, your Artisanect assistant. I can help you find the perfect handmade product, answer questions about delivery, or just tell you about our artisans. What are you looking for today?",
      }]);
    }
  }, [isOpen]);

  async function handleSend(e) {
    e.preventDefault();
    const msg = input.trim();
    if (!msg || loading) return;

    const userTurn = { role: "user", parts: msg };
    const newHistory = [...history, userTurn];
    setHistory(newHistory);
    setInput("");
    setLoading(true);

    try {
      // Send full history so Gemini maintains context across turns
      const historyForApi = newHistory.slice(0, -1); // all but the latest user msg
      const reply = await sendChatMessage(msg, historyForApi);
      setHistory(prev => [...prev, { role: "model", parts: reply }]);
    } catch {
      setHistory(prev => [...prev, {
        role:  "model",
        parts: "Sorry, I'm having trouble connecting right now. Please try again in a moment.",
      }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Chat window */}
      {isOpen && (
        <div className="fixed bottom-24 right-5 sm:right-8 z-50 w-[calc(100vw-2.5rem)] max-w-sm shadow-2xl rounded-2xl overflow-hidden border border-ink/10 dark:border-paper/10 flex flex-col"
          style={{ height: "420px" }}>

          {/* Header */}
          <div className="bg-clay px-4 py-3 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-paper/20 flex items-center justify-center text-paper font-display font-bold text-sm">K</div>
              <div>
                <p className="text-paper font-semibold text-sm leading-none">Kala</p>
                <p className="text-paper/70 text-[10px]">Artisanect AI Assistant</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-paper/70 hover:text-paper transition-colors p-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto bg-paper dark:bg-ink p-4 flex flex-col gap-3">
            {history.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-clay text-paper rounded-br-sm"
                    : "bg-white dark:bg-ink-light text-ink dark:text-paper border border-ink/8 dark:border-paper/10 rounded-bl-sm"
                }`}>
                  {msg.parts}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-ink-light border border-ink/8 dark:border-paper/10 rounded-2xl rounded-bl-sm px-4 py-3">
                  <div className="flex gap-1 items-center h-4">
                    <span className="w-1.5 h-1.5 bg-clay/60 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                    <span className="w-1.5 h-1.5 bg-clay/60 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                    <span className="w-1.5 h-1.5 bg-clay/60 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSend}
            className="flex gap-2 px-3 py-3 bg-white dark:bg-ink-light border-t border-ink/8 dark:border-paper/10 flex-shrink-0">
            <input value={input} onChange={e => setInput(e.target.value)}
              placeholder="Ask me anything…"
              className="flex-1 rounded-lg bg-paper dark:bg-ink border border-ink/10 dark:border-paper/15 text-sm text-ink dark:text-paper px-3 py-2 placeholder:text-ink/35 dark:placeholder:text-paper/35 focus:outline-none focus:border-clay transition-colors" />
            <button type="submit" disabled={loading || !input.trim()}
              className="bg-clay hover:bg-clay-dark disabled:opacity-40 text-paper rounded-lg px-4 py-2 text-sm font-semibold transition-colors flex-shrink-0">
              Send
            </button>
          </form>
        </div>
      )}

      {/* Floating trigger button */}
      <button onClick={() => setIsOpen(p => !p)}
        className="fixed bottom-6 right-5 sm:right-8 z-50 w-14 h-14 bg-clay hover:bg-clay-dark text-paper rounded-full shadow-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95"
        aria-label="Open AI assistant">
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-5l-4 4-1-4z"/>
          </svg>
        )}
      </button>
    </>
  );
}

export default AIChat;
