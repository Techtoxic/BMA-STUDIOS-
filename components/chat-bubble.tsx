"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { X, Send, Camera, Loader2, ChevronDown, MessageCircle, ExternalLink } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

type HandoverState = "idle" | "asking_contact" | "connecting" | "connected";

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
  const [handoverState, setHandoverState] = useState<HandoverState>("idle");
  const [chatUrl, setChatUrl] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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

  async function triggerHandover(
    userName: string,
    userPhone: string,
    userEmail: string,
    aiHistory: Message[]
  ) {
    setHandoverState("connecting");

    // Show connecting message
    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: "⏳ Connecting you to a live agent now…",
      },
    ]);

    try {
      const res = await fetch("/api/chat/handover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userName,
          userPhone,
          userEmail,
          aiHistory: aiHistory.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!res.ok) throw new Error("Handover failed");

      const data = await res.json();
      const { sessionId, userToken, chatUrl: url } = data;

      // Build secure URL with token in hash (not sent to server)
      const fullUrl = `${url}#token=${userToken}`;
      setChatUrl(fullUrl);
      setHandoverState("connected");

      setMessages((prev) => {
        // Remove the "connecting" spinner message
        const filtered = prev.filter((m) => m.content !== "⏳ Connecting you to a live agent now…");
        return [
          ...filtered,
          {
            role: "assistant",
            content:
              "✅ **You've been connected!** A team member has been notified and will attend to you shortly.\n\nTap the button below to open your live chat — please keep that page open.",
          },
        ];
      });
    } catch {
      setHandoverState("idle");
      setMessages((prev) => {
        const filtered = prev.filter((m) => m.content !== "⏳ Connecting you to a live agent now…");
        return [
          ...filtered,
          {
            role: "assistant",
            content:
              "Sorry, I couldn't connect you right now. Please call us directly at **+254 725 297393**.",
          },
        ];
      });
    }
  }

  async function sendMessage(text: string) {
    if (!text.trim() || loading) return;

    const userMsg: Message = { role: "user", content: text };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    // Placeholder for streaming
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!res.ok) throw new Error("Request failed");

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) throw new Error("No reader");

      let fullResponse = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        fullResponse += chunk;
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            ...updated[updated.length - 1],
            content: fullResponse,
          };
          return updated;
        });
      }

      // Detect handover JSON from AI
      const trimmed = fullResponse.trim();
      try {
        const parsed = JSON.parse(trimmed);

        if (parsed.action === "handover") {
          // AI wants to collect contact info
          setHandoverState("asking_contact");
          setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = {
              ...updated[updated.length - 1],
              content: parsed.message,
            };
            return updated;
          });
        } else if (parsed.action === "handover_ready") {
          // AI has collected contact info — trigger handover
          const name = parsed.name ?? "Guest";
          const phone = parsed.phone ?? "";
          const email = parsed.email ?? "";

          setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = {
              ...updated[updated.length - 1],
              content: parsed.message,
            };
            return updated;
          });

          // Use messages up to and including user's last message as history
          await triggerHandover(name, phone, email, nextMessages);
        }
      } catch {
        // Not JSON — normal AI response, nothing to do
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
    return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={i} className="text-white font-semibold">{part.slice(2, -2)}</strong>;
      }
      // Render newlines
      return part.split("\n").map((line, j) => (
        <span key={`${i}-${j}`}>
          {line}
          {j < part.split("\n").length - 1 && <br />}
        </span>
      ));
    });
  }

  return (
    <>
      {/* Chat Window */}
      <div
        className={`fixed bottom-24 right-5 z-50 w-[340px] sm:w-[380px] flex flex-col rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 origin-bottom-right ${
          open
            ? "opacity-100 scale-100 pointer-events-auto"
            : "opacity-0 scale-90 pointer-events-none"
        }`}
        style={{
          maxHeight: "520px",
          background: "#000000",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        {/* Header */}
        <div
          style={{ background: "#000000", borderBottom: "1px solid rgba(255,255,255,0.08)" }}
          className="flex items-center justify-between px-4 py-3"
        >
          <div className="flex items-center gap-2.5">
            <div
              className="h-8 w-8 rounded-full flex items-center justify-center"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
            >
              <Camera className="h-4 w-4 text-white" strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-xs font-bold text-white leading-tight">BMA Photo Studio</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                <p className="text-[10px] text-white/40">Online · Nyeri, Kenya</p>
              </div>
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="text-white/30 hover:text-white/70 transition-colors"
          >
            <ChevronDown className="h-5 w-5" />
          </button>
        </div>

        {/* Messages */}
        <div
          className="flex-1 overflow-y-auto px-4 py-3 space-y-3"
          style={{ maxHeight: "320px", scrollbarWidth: "none" }}
        >
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              {msg.role === "assistant" && (
                <div
                  className="h-6 w-6 rounded-full flex items-center justify-center mr-2 mt-0.5 flex-shrink-0"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
                >
                  <Camera className="h-3 w-3 text-white/60" />
                </div>
              )}
              <div
                className={`max-w-[78%] rounded-2xl px-3 py-2 text-xs leading-relaxed ${
                  msg.role === "user"
                    ? "text-white rounded-br-sm"
                    : "text-white/75 rounded-bl-sm"
                }`}
                style={
                  msg.role === "user"
                    ? { background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.1)" }
                    : { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }
                }
              >
                {msg.content === "" && loading && i === messages.length - 1 ? (
                  <Loader2 className="h-3 w-3 animate-spin text-white/40" />
                ) : (
                  renderContent(msg.content)
                )}
              </div>
            </div>
          ))}

          {/* Live chat link button */}
          {handoverState === "connected" && chatUrl && (
            <div className="flex justify-start pl-8">
              <a
                href={chatUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs text-white/80 hover:text-white transition-all"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.15)",
                }}
              >
                <ExternalLink className="h-3 w-3" />
                Open Live Chat
              </a>
            </div>
          )}

          {/* Suggestions */}
          {messages.length === 1 && handoverState === "idle" && (
            <div className="space-y-1.5 pt-1">
              {SUGGESTED.map((s) => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  className="w-full text-left text-[11px] px-3 py-1.5 rounded-xl text-white/50 hover:text-white/80 transition-all duration-150"
                  style={{ border: "1px solid rgba(255,255,255,0.08)", background: "transparent" }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.05)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input — hidden once connected to live chat */}
        {handoverState !== "connected" && (
          <div
            className="px-3 pb-3 pt-2"
            style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-xl transition-colors"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
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
                placeholder={
                  handoverState === "asking_contact"
                    ? "Enter your name & number…"
                    : handoverState === "connecting"
                    ? "Connecting…"
                    : "Ask anything about BMA…"
                }
                disabled={loading || handoverState === "connecting"}
                className="flex-1 bg-transparent text-xs text-white placeholder:text-white/25 outline-none disabled:opacity-50"
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || loading || handoverState === "connecting"}
                className="text-white/50 disabled:opacity-20 hover:text-white transition-colors"
              >
                {loading || handoverState === "connecting" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </button>
            </div>
            <p className="text-center text-[9px] text-white/15 mt-1.5">
              Powered by Cerebras · BMA Studios
            </p>
          </div>
        )}

        {/* Connected footer */}
        {handoverState === "connected" && (
          <div
            className="px-4 py-2"
            style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
          >
            <p className="text-center text-[10px] text-green-400/60">
              ✅ Handed over to live agent · BMA Studios
            </p>
          </div>
        )}
      </div>

      {/* Floating Button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-5 right-5 z-50 h-14 w-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-105"
        style={{
          background: open ? "#111111" : "#000000",
          border: "1px solid rgba(255,255,255,0.12)",
        }}
        aria-label="Open chat"
      >
        {open ? (
          <X className="h-5 w-5 text-white" />
        ) : (
          <>
            <MessageCircle className="h-6 w-6 text-white" strokeWidth={1.5} />
            <span
              className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-green-400"
              style={{ border: "2px solid #000" }}
            />
          </>
        )}
      </button>
    </>
  );
}
