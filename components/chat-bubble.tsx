"use client";

import { useState, useRef, useEffect } from "react";
import { X, Send, Camera, Loader2, ChevronDown } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTED = [
  "What services do you offer?",
  "How much does wedding photography cost?",
  "Where are you located?",
  "How do I book a session?",
];

export function ChatBubble() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasGreeted, setHasGreeted] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Show greeting on first open
  useEffect(() => {
    if (open && !hasGreeted) {
      setHasGreeted(true);
      setMessages([
        {
          role: "assistant",
          content:
            "👋 Hi there! Welcome to **BMA Photo Studio**. I'm here to help with any questions about our services, pricing, location, or bookings. What can I help you with today?",
        },
      ]);
    }
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open, hasGreeted]);

  async function sendMessage(text: string) {
    if (!text.trim() || loading) return;

    const userMsg: Message = { role: "user", content: text };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    // Add empty assistant message to stream into
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!res.ok) throw new Error("Request failed");

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) throw new Error("No reader");

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            ...updated[updated.length - 1],
            content: updated[updated.length - 1].content + chunk,
          };
          return updated;
        });
      }
    } catch {
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          ...updated[updated.length - 1],
          content:
            "Sorry, I'm having trouble connecting right now. Please call us at **+254 725 297393** or WhatsApp us directly!",
        };
        return updated;
      });
    } finally {
      setLoading(false);
    }
  }

  function renderContent(text: string) {
    // Simple markdown: bold
    return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={i}>{part.slice(2, -2)}</strong>;
      }
      return <span key={i}>{part}</span>;
    });
  }

  return (
    <>
      {/* Chat Window */}
      <div
        className={`fixed bottom-24 right-5 z-50 w-[340px] sm:w-[380px] flex flex-col rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-[#0a0a0a] transition-all duration-300 origin-bottom-right ${
          open
            ? "opacity-100 scale-100 pointer-events-auto"
            : "opacity-0 scale-90 pointer-events-none"
        }`}
        style={{ maxHeight: "520px" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-amber-500 to-amber-400">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-full bg-black/20 flex items-center justify-center">
              <Camera className="h-4 w-4 text-white" strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-xs font-bold text-black leading-tight">BMA Photo Studio</p>
              <div className="flex items-center gap-1">
                <div className="h-1.5 w-1.5 rounded-full bg-green-700 animate-pulse" />
                <p className="text-[10px] text-black/70">Online · Nyeri, Kenya</p>
              </div>
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="text-black/60 hover:text-black transition-colors"
          >
            <ChevronDown className="h-5 w-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3" style={{ maxHeight: "320px" }}>
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "assistant" && (
                <div className="h-6 w-6 rounded-full bg-amber-400/10 border border-amber-400/20 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                  <Camera className="h-3 w-3 text-amber-400" />
                </div>
              )}
              <div
                className={`max-w-[78%] rounded-2xl px-3 py-2 text-xs leading-relaxed ${
                  msg.role === "user"
                    ? "bg-amber-400 text-black rounded-br-sm font-medium"
                    : "bg-white/5 text-white/90 rounded-bl-sm border border-white/5"
                }`}
              >
                {msg.content === "" && loading && i === messages.length - 1 ? (
                  <Loader2 className="h-3 w-3 animate-spin text-amber-400" />
                ) : (
                  renderContent(msg.content)
                )}
              </div>
            </div>
          ))}

          {/* Suggestions (show only if only greeting shown) */}
          {messages.length === 1 && (
            <div className="space-y-1.5 pt-1">
              {SUGGESTED.map((s) => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  className="w-full text-left text-[11px] px-3 py-1.5 rounded-xl border border-amber-400/20 text-amber-400/80 hover:border-amber-400/60 hover:text-amber-400 hover:bg-amber-400/5 transition-all duration-150"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="px-3 pb-3 pt-2 border-t border-white/5">
          <div className="flex items-center gap-2 bg-white/5 rounded-xl px-3 py-2 border border-white/10 focus-within:border-amber-400/40 transition-colors">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage(input);
                }
              }}
              placeholder="Ask anything about BMA…"
              disabled={loading}
              className="flex-1 bg-transparent text-xs text-white placeholder:text-white/30 outline-none disabled:opacity-50"
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || loading}
              className="text-amber-400 disabled:opacity-30 hover:text-amber-300 transition-colors"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </button>
          </div>
          <p className="text-center text-[9px] text-white/20 mt-1.5">Powered by Cerebras · BMA Studios</p>
        </div>
      </div>

      {/* Floating Button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className={`fixed bottom-5 right-5 z-50 h-14 w-14 rounded-full shadow-xl flex items-center justify-center transition-all duration-300 ${
          open
            ? "bg-zinc-800 border border-white/10 rotate-0"
            : "bg-amber-400 hover:bg-amber-300 hover:scale-105"
        }`}
        aria-label="Open chat"
      >
        {open ? (
          <X className="h-5 w-5 text-white" />
        ) : (
          <>
            <Camera className="h-6 w-6 text-black" strokeWidth={1.5} />
            {/* Ping indicator */}
            <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-green-400 border-2 border-[#0a0a0a]" />
          </>
        )}
      </button>
    </>
  );
}
