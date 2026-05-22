'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ShoppingBag, CheckCircle, XCircle, Clock, LogOut, RefreshCw, Search, Trash2, ChevronDown, ChevronUp } from 'lucide-react'

interface Order {
  id: string
  product_name: string
  amount: number
  phone: string
  status: 'pending' | 'confirmed' | 'failed'
  mpesa_receipt: string | null
  updated_at: string
}

const STATUS_CONFIG = {
  confirmed: { label: 'Paid', color: 'text-green-400', bg: 'rgba(74,222,128,0.08)', border: 'rgba(74,222,128,0.2)', icon: CheckCircle },
  pending:   { label: 'Pending', color: 'text-amber-400', bg: 'rgba(251,191,36,0.08)', border: 'rgba(251,191,36,0.2)', icon: Clock },
  failed:    { label: 'Failed', color: 'text-red-400', bg: 'rgba(248,113,113,0.08)', border: 'rgba(248,113,113,0.2)', icon: XCircle },
}

function OrderCard({ order }: { order: Order }) {
  const [expanded, setExpanded] = useState(false)
  const s = STATUS_CONFIG[order.status]
  const Icon = s.icon

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.07)' }}
    >
      {/* Main row — always visible */}
      <div
        className="flex items-center gap-3 px-3 py-3 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        {/* Status icon */}
        <div className="flex-shrink-0">
          <span
            className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold"
            style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.color.replace('text-', '') }}
          >
            <Icon className="h-2.5 w-2.5" />
            {s.label}
          </span>
        </div>

        {/* Product + amount */}
        <div className="flex-1 min-w-0">
          <p className="text-white text-xs font-semibold truncate">{order.product_name}</p>
          <p className="text-white/40 text-[10px] mt-0.5">
            {new Date(order.updated_at).toLocaleDateString('en-KE', {
              day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
            })}
          </p>
        </div>

        {/* Amount + expand */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <p className="text-amber-400 text-xs font-bold">KSH {order.amount.toLocaleString()}</p>
          {expanded
            ? <ChevronUp className="h-3.5 w-3.5 text-white/30" />
            : <ChevronDown className="h-3.5 w-3.5 text-white/30" />
          }
        </div>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div
          className="px-3 pb-3 space-y-2 text-xs"
          style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
        >
          <div className="pt-2 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-white/40">Order ID</span>
              <span className="font-mono text-white/80 text-[11px]">{order.id}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/40">Phone</span>
              <a href={`tel:${order.phone}`} className="text-white/70 hover:text-white transition-colors">
                {order.phone}
              </a>
            </div>
            {order.mpesa_receipt && (
              <div className="flex justify-between items-center">
                <span className="text-white/40">Receipt</span>
                <span className="font-mono text-white/80">{order.mpesa_receipt}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export function AdminDashboard({ orders }: { orders: Order[] }) {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'confirmed' | 'pending' | 'failed'>('all')
  const [refreshing, setRefreshing] = useState(false)
  const [cleaning, setCleaning] = useState(false)
  const [cleanMsg, setCleanMsg] = useState('')

  const handleLogout = async () => {
    await fetch('/api/admin/login', { method: 'DELETE' })
    router.push('/admin/login')
  }

  const handleRefresh = () => {
    setRefreshing(true)
    router.refresh()
    setTimeout(() => setRefreshing(false), 1000)
  }

  const handleCleanup = async () => {
    setCleaning(true)
    setCleanMsg('')
    const res = await fetch('/api/admin/cleanup', { method: 'POST' })
    const json = await res.json()
    setCleaning(false)
    setCleanMsg(json.cleaned > 0 ? `Cleaned ${json.cleaned} stale` : 'None found')
    if (json.cleaned > 0) router.refresh()
    setTimeout(() => setCleanMsg(''), 4000)
  }

  const filtered = orders.filter((o) => {
    const matchesFilter = filter === 'all' || o.status === filter
    const matchesSearch =
      !search ||
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.product_name.toLowerCase().includes(search.toLowerCase()) ||
      o.phone.includes(search) ||
      (o.mpesa_receipt ?? '').toLowerCase().includes(search.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const stats = {
    revenue: orders.filter(o => o.status === 'confirmed').reduce((s, o) => s + o.amount, 0),
    confirmed: orders.filter(o => o.status === 'confirmed').length,
    pending: orders.filter(o => o.status === 'pending').length,
    failed: orders.filter(o => o.status === 'failed').length,
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', background: '#0a0a0a' }}>
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.2)' }}>
              <ShoppingBag className="h-3.5 w-3.5 text-amber-400" />
            </div>
            <div>
              <p className="text-white font-semibold text-xs">BMA Studios</p>
              <p className="text-white/40 text-[10px]">Orders</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            {cleanMsg && <span className="text-[10px] text-white/40 hidden sm:block">{cleanMsg}</span>}
            <button onClick={handleCleanup} disabled={cleaning} title="Clean stale pending orders"
              className="p-1.5 rounded-lg text-white/40 hover:text-white/80 transition-colors disabled:opacity-40"
              style={{ background: 'rgba(255,255,255,0.05)' }}>
              <Trash2 className={`h-3.5 w-3.5 ${cleaning ? 'animate-pulse' : ''}`} />
            </button>
            <button onClick={handleRefresh}
              className="p-1.5 rounded-lg text-white/40 hover:text-white/80 transition-colors"
              style={{ background: 'rgba(255,255,255,0.05)' }}>
              <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
            <button onClick={handleLogout}
              className="p-1.5 rounded-lg text-white/40 hover:text-white/80 transition-colors"
              style={{ background: 'rgba(255,255,255,0.05)' }}>
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-4 space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: 'Revenue', value: `${stats.revenue.toLocaleString()}`, color: 'text-amber-400', prefix: 'KSH ' },
            { label: 'Paid', value: `${stats.confirmed}`, color: 'text-green-400' },
            { label: 'Pending', value: `${stats.pending}`, color: 'text-amber-400' },
            { label: 'Failed', value: `${stats.failed}`, color: 'text-red-400' },
          ].map((s) => (
            <div key={s.label} className="rounded-xl p-2.5 text-center"
              style={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.07)' }}>
              <p className="text-white/40 text-[9px] uppercase tracking-wider mb-1">{s.label}</p>
              <p className={`text-sm font-bold ${s.color} leading-none`}>
                {s.prefix && <span className="text-[8px] font-normal">{s.prefix}</span>}
                {s.value}
              </p>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/30" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search orders, phone, receipt..."
            className="w-full pl-8 pr-4 py-2.5 rounded-xl text-white text-xs placeholder-white/25 outline-none"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
          />
        </div>

        {/* Filter pills */}
        <div className="flex gap-2">
          {(['all', 'confirmed', 'pending', 'failed'] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className="flex-1 py-1.5 rounded-lg text-[10px] font-medium capitalize transition-all"
              style={{
                background: filter === f ? 'rgba(251,191,36,0.15)' : 'rgba(255,255,255,0.05)',
                border: `1px solid ${filter === f ? 'rgba(251,191,36,0.3)' : 'rgba(255,255,255,0.08)'}`,
                color: filter === f ? 'rgb(251,191,36)' : 'rgba(255,255,255,0.4)',
              }}>
              {f}
            </button>
          ))}
        </div>

        {/* Orders — card list, tap to expand */}
        <div className="space-y-2">
          {filtered.length === 0
            ? <div className="py-12 text-center text-white/25 text-sm">No orders found</div>
            : filtered.map((order) => <OrderCard key={order.id} order={order} />)
          }
        </div>

        <p className="text-center text-white/20 text-[10px] pb-4">
          {filtered.length} of {orders.length} orders
        </p>
      </div>
    </div>
  )
}
