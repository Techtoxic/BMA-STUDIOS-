import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Clock, CheckCircle, XCircle, ChevronRight, MessageCircle } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AdminChatPage() {
  const cookieStore = await cookies()
  const auth = cookieStore.get('admin_auth')
  const secret = process.env.ADMIN_SECRET ?? 'bma_secret_token'
  if (!auth || auth.value !== secret) redirect('/admin/login')

  const { data: sessions } = await supabase
    .from('chat_sessions')
    .select('id, status, user_name, user_email, user_phone, created_at, taken_over_at')
    .order('created_at', { ascending: false })
    .limit(50)

  const waiting = sessions?.filter((s) => s.status === 'waiting') ?? []
  const active = sessions?.filter((s) => s.status === 'active') ?? []
  const closed = sessions?.filter((s) => s.status === 'closed') ?? []

  function timeAgo(ts: string) {
    const diff = Date.now() - new Date(ts).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return 'just now'
    if (mins < 60) return `${mins}m ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h ago`
    return `${Math.floor(hrs / 24)}d ago`
  }

  const StatusBadge = ({ status }: { status: string }) => {
    if (status === 'waiting')
      return (
        <span className="flex items-center gap-1 text-yellow-400 text-[10px] font-medium">
          <Clock className="h-3 w-3" /> Waiting
        </span>
      )
    if (status === 'active')
      return (
        <span className="flex items-center gap-1 text-green-400 text-[10px] font-medium">
          <CheckCircle className="h-3 w-3" /> Active
        </span>
      )
    return (
      <span className="flex items-center gap-1 text-white/30 text-[10px]">
        <XCircle className="h-3 w-3" /> Closed
      </span>
    )
  }

  const SessionCard = ({ s }: { s: (typeof sessions)[0] }) => (
    <Link
      href={`/admin/chat/${s.id}`}
      className="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors hover:bg-white/5"
      style={{ border: '1px solid rgba(255,255,255,0.07)' }}
    >
      <div
        className="h-9 w-9 rounded-full flex items-center justify-center flex-shrink-0 text-white/40 text-sm font-semibold uppercase"
        style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
      >
        {(s.user_name ?? '?').charAt(0)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white text-sm font-medium truncate">{s.user_name ?? 'Anonymous'}</p>
        <p className="text-white/30 text-[11px] truncate">{s.user_phone ?? s.user_email ?? 'No contact'}</p>
      </div>
      <div className="flex flex-col items-end gap-1 flex-shrink-0">
        <StatusBadge status={s.status} />
        <p className="text-white/20 text-[10px]">{timeAgo(s.created_at)}</p>
      </div>
      <ChevronRight className="h-4 w-4 text-white/20 flex-shrink-0" />
    </Link>
  )

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-white/60" strokeWidth={1.5} />
            <h1 className="text-lg font-semibold">Live Chats</h1>
          </div>
          <Link href="/admin" className="text-white/30 hover:text-white/60 text-sm transition-colors">
            ← Dashboard
          </Link>
        </div>

        {/* Waiting */}
        {waiting.length > 0 && (
          <section className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-2 w-2 rounded-full bg-yellow-400 animate-pulse" />
              <h2 className="text-yellow-400 text-xs font-semibold uppercase tracking-wider">
                Waiting ({waiting.length})
              </h2>
            </div>
            <div className="space-y-2">
              {waiting.map((s) => (
                <SessionCard key={s.id} s={s} />
              ))}
            </div>
          </section>
        )}

        {/* Active */}
        {active.length > 0 && (
          <section className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
              <h2 className="text-green-400 text-xs font-semibold uppercase tracking-wider">
                Active ({active.length})
              </h2>
            </div>
            <div className="space-y-2">
              {active.map((s) => (
                <SessionCard key={s.id} s={s} />
              ))}
            </div>
          </section>
        )}

        {/* Closed */}
        {closed.length > 0 && (
          <section>
            <h2 className="text-white/20 text-xs font-semibold uppercase tracking-wider mb-3">
              Closed ({closed.length})
            </h2>
            <div className="space-y-2">
              {closed.map((s) => (
                <SessionCard key={s.id} s={s} />
              ))}
            </div>
          </section>
        )}

        {(!sessions || sessions.length === 0) && (
          <div
            className="rounded-2xl p-12 text-center"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <MessageCircle className="h-10 w-10 text-white/10 mx-auto mb-3" strokeWidth={1} />
            <p className="text-white/30 text-sm">No chat sessions yet</p>
            <p className="text-white/15 text-xs mt-1">
              Sessions appear here when customers request a live agent
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
