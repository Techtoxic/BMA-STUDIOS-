'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Link from 'next/link'
import {
  Camera,
  Send,
  Loader2,
  CheckCircle,
  Clock,
  XCircle,
  ArrowLeft,
  UserCheck,
  PhoneCall,
} from 'lucide-react'

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
  user_email: string | null
  user_phone: string | null
  created_at: string
  taken_over_at: string | null
  ai_history: AIMessage[]
}

export function AdminChatView({ sessionId }: { sessionId: string }) {
  const [session, setSession] = useState<Session | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [takingOver, setTakingOver] = useState(false)
  const [closing, setClosing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/chat/${sessionId}`)
      if (!res.ok) return
      const data = await res.json()
      setSession(data.session)
      setMessages(data.messages)
      setLoading(false)
    } catch {
      setError('Connection error')
    }
  }, [sessionId])

  useEffect(() => {
    fetchData()
    pollRef.current = setInterval(fetchData, 2500)
    return () => {
      if (pollRef.current) clearInterval(pollRef.current)
    }
  }, [fetchData])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function takeOver() {
    setTakingOver(true)
    setError(null)
    try {
      const res = await fetch(`/api/admin/chat/${sessionId}/takeover`, { method: 'POST' })
      if (!res.ok) {
        const err = await res.json()
        setError(err.error ?? 'Failed to take over')
      } else {
        await fetchData()
        setTimeout(() => inputRef.current?.focus(), 100)
      }
    } catch {
      setError('Network error')
    } finally {
      setTakingOver(false)
    }
  }

  async function closeSession() {
    if (!confirm('Close this chat session?')) return
    setClosing(true)
    try {
      await fetch(`/api/admin/chat/${sessionId}/close`, { method: 'POST' })
      await fetchData()
    } catch {
      setError('Failed to close session')
    } finally {
      setClosing(false)
    }
  }

  async function sendMessage() {
    if (!input.trim() || sending) return
    setSending(true)
    const content = input.trim()
    setInput('')
    setError(null)

    try {
      const res = await fetch(`/api/admin/chat/${sessionId}/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      })
      if (!res.ok) {
        const err = await res.json()
        setInput(content)
        setError(err.error ?? 'Failed to send')
      } else {
        await fetchData()
      }
    } catch {
      setInput(content)
      setError('Network error')
    } finally {
      setSending(false)
      inputRef.current?.focus()
    }
  }

  function formatTime(ts: string) {
    return new Date(ts).toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-white/30 animate-spin" />
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="text-center">
          <XCircle className="h-10 w-10 text-red-400 mx-auto mb-3" />
          <p className="text-white/50">Session not found</p>
          <Link href="/admin/chat" className="text-white/30 text-sm mt-2 block hover:text-white/60">
            ← Back to chats
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black flex flex-col text-white" style={{ maxHeight: '100dvh' }}>
      {/* Header */}
      <div
        className="px-4 py-3 flex items-center gap-3 flex-shrink-0"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', background: '#000' }}
      >
        <Link href="/admin/chat" className="text-white/30 hover:text-white/70 transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div
          className="h-9 w-9 rounded-full flex items-center justify-center flex-shrink-0 text-white/40 text-sm font-semibold uppercase"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          {(session.user_name ?? '?').charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm font-semibold">{session.user_name ?? 'Anonymous'}</p>
          <div className="flex items-center gap-3">
            {session.user_phone && (
              <a
                href={`tel:${session.user_phone}`}
                className="flex items-center gap-1 text-[10px] text-white/30 hover:text-white/60 transition-colors"
              >
                <PhoneCall className="h-2.5 w-2.5" />
                {session.user_phone}
              </a>
            )}
            {session.user_email && (
              <p className="text-[10px] text-white/30 truncate">{session.user_email}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {session.status === 'waiting' && (
            <span className="flex items-center gap-1 text-yellow-400 text-[10px]">
              <Clock className="h-3 w-3" /> Waiting
            </span>
          )}
          {session.status === 'active' && (
            <span className="flex items-center gap-1 text-green-400 text-[10px]">
              <div className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" /> Active
            </span>
          )}
          {session.status === 'closed' && (
            <span className="flex items-center gap-1 text-white/30 text-[10px]">
              <XCircle className="h-3 w-3" /> Closed
            </span>
          )}
          {session.status !== 'closed' && (
            <button
              onClick={closeSession}
              disabled={closing}
              className="text-[10px] text-red-400/50 hover:text-red-400 transition-colors px-2 py-1 rounded-lg"
              style={{ border: '1px solid rgba(255,80,80,0.2)' }}
            >
              {closing ? <Loader2 className="h-3 w-3 animate-spin" /> : 'End'}
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4" style={{ scrollbarWidth: 'none' }}>
        {/* AI History */}
        {session.ai_history && session.ai_history.length > 0 && (
          <div className="space-y-2">
            <p className="text-center text-[10px] text-white/20 uppercase tracking-widest mb-2">
              — AI conversation history —
            </p>
            {session.ai_history.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className="max-w-[78%] rounded-2xl px-3 py-2 text-xs leading-relaxed opacity-35"
                  style={{
                    background:
                      msg.role === 'user'
                        ? 'rgba(255,255,255,0.06)'
                        : 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    color: 'rgba(255,255,255,0.7)',
                  }}
                >
                  <span className="block text-[9px] text-white/20 mb-0.5">
                    {msg.role === 'user' ? '👤 Client' : '🤖 AI'}
                  </span>
                  {msg.content}
                </div>
              </div>
            ))}
            <div className="border-t border-white/5 pt-3">
              <p className="text-center text-[10px] text-white/20 uppercase tracking-widest">
                — Live chat —
              </p>
            </div>
          </div>
        )}

        {/* Take over CTA */}
        {session.status === 'waiting' && (
          <div
            className="rounded-2xl p-6 text-center"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <UserCheck className="h-8 w-8 text-white/20 mx-auto mb-3" />
            <p className="text-white/60 text-sm mb-1">Client is waiting for you</p>
            <p className="text-white/30 text-xs mb-4">
              Tap "Take Over" to start the live chat. They&apos;ll be notified instantly.
            </p>
            <button
              onClick={takeOver}
              disabled={takingOver}
              className="px-6 py-2 rounded-xl text-sm font-medium transition-all"
              style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}
            >
              {takingOver ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" /> Connecting…
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <UserCheck className="h-4 w-4" /> Take Over Chat
                </span>
              )}
            </button>
          </div>
        )}

        {/* Agent joined confirmation */}
        {session.status === 'active' && messages.length === 0 && (
          <div className="flex items-center justify-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-400" />
            <p className="text-green-400 text-xs">You&apos;ve joined. Say hello to the client!</p>
          </div>
        )}

        {/* Live messages */}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
          >
            <div>
              <p
                className={`text-[9px] mb-0.5 text-white/20 ${
                  msg.sender === 'admin' ? 'text-right' : 'text-left'
                }`}
              >
                {msg.sender === 'admin' ? 'You' : session.user_name}
              </p>
              <div
                className="max-w-xs rounded-2xl px-3 py-2 text-xs leading-relaxed"
                style={
                  msg.sender === 'admin'
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
                className={`text-[9px] mt-0.5 text-white/20 ${
                  msg.sender === 'admin' ? 'text-right' : 'text-left'
                }`}
              >
                {formatTime(msg.created_at)}
              </p>
            </div>
          </div>
        ))}

        {session.status === 'closed' && (
          <div
            className="rounded-xl p-4 text-center"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}
          >
            <p className="text-white/20 text-xs">Session ended</p>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      {session.status === 'active' && (
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
              placeholder="Reply to client…"
              disabled={sending}
              className="flex-1 bg-transparent text-xs text-white placeholder:text-white/25 outline-none disabled:opacity-50"
              autoFocus
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
    </div>
  )
}
