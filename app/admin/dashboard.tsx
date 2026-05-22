'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ShoppingBag, CheckCircle, XCircle, Clock, LogOut, RefreshCw, Search, Trash2 } from 'lucide-react'

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
  confirmed: { label: 'Confirmed', color: 'text-green-400', bg: 'rgba(74,222,128,0.08)', border: 'rgba(74,222,128,0.2)', icon: CheckCircle },
  pending:   { label: 'Pending',   color: 'text-amber-400', bg: 'rgba(251,191,36,0.08)', border: 'rgba(251,191,36,0.2)', icon: Clock },
  failed:    { label: 'Failed',    color: 'text-red-400',   bg: 'rgba(248,113,113,0.08)', border: 'rgba(248,113,113,0.2)', icon: XCircle },
}

export function AdminDashboard({ orders }: { orders: Order[] }) {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'confirmed' | 'pending' | 'failed'>('all')
  const [refreshing, setRefreshing] = useState(false)
  const [cleaning, setCleaning] = useState(false)
  const [cleanMsg, setCleanMsg] = useState('')

  const handleCleanup = async () => {
    setCleaning(true)
    setCleanMsg('')
    const res = await fetch('/api/admin/cleanup', { method: 'POST' })
    const json = await res.json()
    setCleaning(false)
    setCleanMsg(json.cleaned > 0 ? `Marked ${json.cleaned} stale order(s) as failed` : 'No stale orders found')
    if (json.cleaned > 0) router.refresh()
    setTimeout(() => setCleanMsg(''), 4000)
  }

  const handleLogout = async () => {
    await fetch('/api/admin/login', { method: 'DELETE' })
    router.push('/admin/login')
  }

  const handleRefresh = () => {
    setRefreshing(true)
    router.refresh()
    setTimeout(() => setRefreshing(false), 1000)
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
    total: orders.length,
    confirmed: orders.filter((o) => o.status === 'confirmed').length,
    pending: orders.filter((o) => o.status === 'pending').length,
    failed: orders.filter((o) => o.status === 'failed').length,
    revenue: orders
      .filter((o) => o.status === 'confirmed')
      .reduce((sum, o) => sum + o.amount, 0),
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', background: '#0a0a0a' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.2)' }}>
              <ShoppingBag className="h-4 w-4 text-amber-400" />
            </div>
            <div>
              <p className="text-white font-semibold text-sm">BMA Studios</p>
              <p className="text-white/40 text-xs">Orders Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {cleanMsg && <span className="text-xs text-white/40 hidden sm:block">{cleanMsg}</span>}
            <button onClick={handleCleanup} disabled={cleaning}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-white/40 hover:text-white/80 text-xs transition-colors disabled:opacity-40"
              style={{ background: 'rgba(255,255,255,0.05)' }}
              title="Mark stale pending orders (10+ min old) as failed"
            >
              <Trash2 className={`h-3.5 w-3.5 ${cleaning ? 'animate-pulse' : ''}`} />
              {cleaning ? 'Cleaning...' : 'Clean Stale'}
            </button>
            <button
              onClick={handleRefresh}
              className="p-2 rounded-lg text-white/40 hover:text-white/80 transition-colors"
              style={{ background: 'rgba(255,255,255,0.05)' }}
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-white/40 hover:text-white/80 text-xs transition-colors"
              style={{ background: 'rgba(255,255,255,0.05)' }}
            >
              <LogOut className="h-3.5 w-3.5" />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Revenue', value: `KSH ${stats.revenue.toLocaleString()}`, color: 'text-amber-400' },
            { label: 'Confirmed', value: stats.confirmed, color: 'text-green-400' },
            { label: 'Pending', value: stats.pending, color: 'text-amber-400' },
            { label: 'Failed', value: stats.failed, color: 'text-red-400' },
          ].map((s) => (
            <div key={s.label} className="rounded-xl p-4" style={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.07)' }}>
              <p className="text-white/40 text-xs mb-1">{s.label}</p>
              <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Filters + Search */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by order ID, product, phone, receipt..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl text-white text-sm placeholder-white/25 outline-none"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
            />
          </div>
          <div className="flex gap-2">
            {(['all', 'confirmed', 'pending', 'failed'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className="px-3 py-2 rounded-xl text-xs font-medium capitalize transition-all"
                style={{
                  background: filter === f ? 'rgba(251,191,36,0.15)' : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${filter === f ? 'rgba(251,191,36,0.3)' : 'rgba(255,255,255,0.08)'}`,
                  color: filter === f ? 'rgb(251,191,36)' : 'rgba(255,255,255,0.5)',
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Orders Table */}
        <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
          {filtered.length === 0 ? (
            <div className="py-16 text-center text-white/30 text-sm">No orders found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ background: '#0a0a0a', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                    {['Order ID', 'Product', 'Amount', 'Phone', 'Receipt', 'Status', 'Date'].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-xs text-white/40 font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((order, i) => {
                    const s = STATUS_CONFIG[order.status]
                    const Icon = s.icon
                    return (
                      <tr
                        key={order.id}
                        style={{
                          borderBottom: i < filtered.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                          background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)',
                        }}
                      >
                        <td className="px-4 py-3">
                          <span className="text-xs font-mono text-white/70">{order.id}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-white">{order.product_name}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm font-semibold text-amber-400">KSH {order.amount.toLocaleString()}</span>
                        </td>
                        <td className="px-4 py-3">
                          <a href={`tel:${order.phone}`} className="text-xs text-white/60 hover:text-white transition-colors">{order.phone}</a>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-xs font-mono text-white/50">{order.mpesa_receipt ?? '—'}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium"
                            style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.color.replace('text-', '') }}
                          >
                            <Icon className="h-3 w-3" />
                            {s.label}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-xs text-white/30">
                            {new Date(order.updated_at).toLocaleDateString('en-KE', {
                              day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                            })}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <p className="text-center text-white/20 text-xs">
          {filtered.length} of {orders.length} orders · Last 100 records
        </p>
      </div>
    </div>
  )
}
