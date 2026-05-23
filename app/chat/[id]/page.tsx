'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Camera, Send, Loader2, CheckCircle, Clock, XCircle } from 'lucide-react'

interface Message {
  id: string
  sender: 'user' | 'admin'
  content: string
  created_at: string
}

interface AIMessage {
  role: 'user' | 'assistant'
  content: string
}

interface Session {
  id: string
  status: 'waiting' | 'active' | 'closed'
  user_name: string
  created_at: string
  taken_over_at: string | null
  ai_history: AIMessage[]
}

export default function ChatPage() {
  const params = useParams()
  const router = useRouter()
  const sessionId = params.id as string

  // Token stored in React state only — never localStorage
  const [userToken, setUserToken] = useState<string | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [countdown, setCountdown] = useState<number | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Auto-redirect home when session closes
  useEffect(() => {
    if (session?.status === 'closed' && countdown === null) {
      setCountdown(5)
    }
  }, [session?.status, countdown])

  useEffect(() => {
    if (countdown === null) return
    if (countdown === 0) {
      router.push('/')
      return
    }
    const t = setTimeout(() => setCountdown((c) => (c ?? 1) - 1), 1000)
    return () => clearTimeout(t)
  }, [countdown, router])

  // Extract token from URL hash on first load (hash is not sent to server)
  useEffect(() => {
    // Token passed via URL hash: /chat/xxx#token=yyy
    const hash = window.location.hash
    const match = hash.match(/token=([a-f0-9]{64})/)
    if (match) {
      setUserToken(match[1])
      // Clean hash from URL so token isn't in browser history
      history.replaceState(null, '', window.location.pathname)
    }
  }, [])

  const fetchData = useCallback(async () => {
    if (!userToken) return
    try {
      const res = await fetch(`/api/chat/${sessionId}`, {
        headers: { Authorization: `Bearer ${userToken}` },
      })
      if (!res.ok) {
        if (res.status === 401) setError('Invalid or expired session link.')
        return
      }
      const data = await res.json()
      setSession(data.session)
      setMessages(data.messages)
      setLoading(false)
    } catch {
      setError('Connection error. Please refresh.')
    }
  }, [sessionId, userToken])

  // Initial load + polling every 2.5 seconds
  useEffect(() => {
    if (!userToken) return
    fetchData()
    pollRef.current = setInterval(fetchData, 2500)
    return () => {
      if (pollRef.current) clearInterval(pollRef.current)
    }
  }, [fetchData, userToken])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, session])

  async function sendMessage() {
    if (!input.trim() || sending || !userToken) return
    if (session?.status !== 'active') return

    setSending(true)
    const content = input.trim()
    setInput('')

    try {
      const res = await fetch(`/api/chat/${sessionId}/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({ content }),
      })
      if (!res.ok) {
        const err = await res.json()
        setInput(content) // restore input on error
        setError(err.error ?? 'Failed to send message')
      } else {
        // Immediately fetch to show the message
        await fetchData()
      }
    } catch {
      setInput(content)
      setError('Network error. Try again.')
    } finally {
      setSending(false)
      inputRef.current?.focus()
    }
  }

  function formatTime(ts: string) {
    return new Date(ts).toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' })
  }

  if (!userToken) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div
          className="rounded-2xl p-8 text-center max-w-sm w-full"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <XCircle className="h-10 w-10 text-red-400 mx-auto mb-3" />
          <p className="text-white font-semibold mb-1">Invalid Link</p>
          <p className="text-white/40 text-sm">
            This link appears to be incomplete. Please use the exact link provided by our assistant.
          </p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-white/30 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div
          className="rounded-2xl p-8 text-center max-w-sm w-full"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <XCircle className="h-10 w-10 text-red-400 mx-auto mb-3" />
          <p className="text-white/70 text-sm">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center" style={{ maxHeight: '100dvh' }}>
      <div className="w-full max-w-2xl flex flex-col flex-1" style={{ maxHeight: '100dvh' }}>
      {/* Header */}
      <div
        className="px-4 py-3 flex items-center gap-3 flex-shrink-0"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', background: '#000' }}
      >
        <div
          className="h-9 w-9 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          <Camera className="h-4 w-4 text-white" strokeWidth={1.5} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm font-semibold">BMA Photo Studio</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            {session?.status === 'waiting' && (
              <>
                <Clock className="h-3 w-3 text-yellow-400" />
                <p className="text-[11px] text-yellow-400">Waiting for agent…</p>
              </>
            )}
            {session?.status === 'active' && (
              <>
                <div className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                <p className="text-[11px] text-green-400">Agent connected</p>
              </>
            )}
            {session?.status === 'closed' && (
              <>
                <XCircle className="h-3 w-3 text-white/30" />
                <p className="text-[11px] text-white/30">Session ended</p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4" style={{ scrollbarWidth: 'none' }}>
        {/* AI history (greyed out — context) */}
        {session?.ai_history && session.ai_history.length > 0 && (
          <div className="space-y-2">
            <p className="text-center text-[10px] text-white/20 uppercase tracking-widest mb-3">
              — AI conversation history —
            </p>
            {session.ai_history.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className="max-w-[78%] rounded-2xl px-3 py-2 text-xs leading-relaxed opacity-40"
                  style={{
                    background:
                      msg.role === 'user'
                        ? 'rgba(255,255,255,0.06)'
                        : 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    color: 'rgba(255,255,255,0.6)',
                  }}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            <div className="border-t border-white/5 pt-3 mt-3">
              <p className="text-center text-[10px] text-white/20 uppercase tracking-widest">
                — Live chat —
              </p>
            </div>
          </div>
        )}

        {/* Waiting spinner */}
        {session?.status === 'waiting' && (
          <div className="flex flex-col items-center justify-center py-8 gap-3">
            <Loader2 className="h-8 w-8 text-white/20 animate-spin" />
            <p className="text-white/30 text-sm">Connecting you to an agent…</p>
            <p className="text-white/20 text-xs">This usually takes a minute or two</p>
          </div>
        )}

        {/* Agent joined banner */}
        {session?.status === 'active' && messages.length === 0 && (
          <div className="flex items-center justify-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-400" />
            <p className="text-green-400 text-xs">Agent has joined. Say hello!</p>
          </div>
        )}

        {/* Live messages */}
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div>
              <div
                className="max-w-xs rounded-2xl px-3 py-2 text-xs leading-relaxed"
                style={
                  msg.sender === 'user'
                    ? {
                        background: 'rgba(255,255,255,0.12)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: 'white',
                        borderBottomRightRadius: '4px',
                      }
                    : {
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        color: 'rgba(255,255,255,0.8)',
                        borderBottomLeftRadius: '4px',
                      }
                }
              >
                {msg.content}
              </div>
              <p
                className={`text-[9px] mt-0.5 text-white/20 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}
              >
                {formatTime(msg.created_at)}
              </p>
            </div>
          </div>
        ))}

        {/* Session closed — countdown redirect */}
        {session?.status === 'closed' && (
          <div
            className="rounded-xl p-6 text-center"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <CheckCircle className="h-6 w-6 text-white/20 mx-auto mb-2" />
            <p className="text-white/50 text-sm font-medium mb-1">Chat has ended</p>
            <p className="text-white/30 text-xs mb-3">
              Thank you for chatting with BMA Photo Studio!
            </p>
            <p className="text-white/20 text-[10px]">
              Redirecting you home in {countdown}s…
            </p>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      {session?.status === 'active' && (
        <div
          className="px-3 pb-4 pt-2 flex-shrink-0"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: '#000' }}
        >
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-xl"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  sendMessage()
                }
              }}
              placeholder="Type a message…"
              disabled={sending}
              className="flex-1 bg-transparent text-xs text-white placeholder:text-white/25 outline-none disabled:opacity-50"
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || sending}
              className="text-white/50 disabled:opacity-20 hover:text-white transition-colors"
            >
              {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </button>
          </div>
          {error && <p className="text-red-400 text-[10px] mt-1 px-1">{error}</p>}
        </div>
      )}

      {session?.status === 'waiting' && (
        <div
          className="px-4 pb-4 pt-2 flex-shrink-0"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: '#000' }}
        >
          <p className="text-center text-white/20 text-xs py-2">
            Waiting for an agent to connect before you can chat…
          </p>
        </div>
      )}
    </div>
    </div>
  )
}
