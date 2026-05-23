'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, XCircle, Clock, ArrowLeft, Loader2, ShoppingBag } from 'lucide-react'

type Status = 'confirmed' | 'pending' | 'failed' | 'loading' | 'not_found'

const STATUS_CONFIG = {
  confirmed: {
    icon: CheckCircle,
    color: 'text-green-400',
    bg: 'rgba(74,222,128,0.08)',
    border: 'rgba(74,222,128,0.2)',
    title: 'Payment Confirmed! 🎉',
    desc: 'Your payment was received. BMA Studios will contact you shortly via phone or WhatsApp.',
  },
  pending: {
    icon: Clock,
    color: 'text-amber-400',
    bg: 'rgba(251,191,36,0.08)',
    border: 'rgba(251,191,36,0.2)',
    title: 'Payment Pending',
    desc: 'Your payment is being processed. This usually takes a few minutes.',
  },
  failed: {
    icon: XCircle,
    color: 'text-red-400',
    bg: 'rgba(248,113,113,0.08)',
    border: 'rgba(248,113,113,0.2)',
    title: 'Payment Not Completed',
    desc: 'This payment was not completed. Please try again or contact BMA Studios for help.',
  },
  not_found: {
    icon: XCircle,
    color: 'text-white/30',
    bg: 'rgba(255,255,255,0.03)',
    border: 'rgba(255,255,255,0.08)',
    title: 'Order Not Found',
    desc: 'We couldn\'t find this order. Please check the order ID or contact BMA Studios.',
  },
}

export default function OrderStatus() {
  const { id } = useParams<{ id: string }>()
  const [status, setStatus] = useState<Status>('loading')
  const [receipt, setReceipt] = useState<string | null>(null)
  const [attempts, setAttempts] = useState(0)

  useEffect(() => {
    if (!id) return
    let timer: NodeJS.Timeout

    const check = async () => {
      try {
        const res = await fetch(`/api/orders/${id}`)
        if (res.status === 404) { setStatus('not_found'); return }
        if (res.status === 401) { setStatus('not_found'); return }

        const { data } = await res.json()
        if (!data) { setStatus('not_found'); return }

        setStatus(data.status as Status)
        setReceipt(data.mpesa_receipt)

        // Keep polling if still pending (max 24 attempts = 2 min)
        if (data.status === 'pending' && attempts < 24) {
          setAttempts(a => a + 1)
          timer = setTimeout(check, 5000)
        }
      } catch {
        setStatus('not_found')
      }
    }

    check()
    return () => clearTimeout(timer)
  }, [id, attempts])

  const cfg = status === 'loading' ? null : STATUS_CONFIG[status] ?? STATUS_CONFIG.not_found

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', background: '#0a0a0a' }}>
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-white/40 hover:text-white/80 transition-colors text-sm">
            <ArrowLeft className="h-4 w-4" />
            BMA Studios
          </Link>
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-4 w-4 text-amber-400" />
            <span className="text-xs text-white/50">Order Status</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-4">

          {/* Status card */}
          <div className="rounded-2xl p-6 text-center space-y-4"
            style={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.08)' }}>

            {status === 'loading' ? (
              <div className="py-8 flex flex-col items-center gap-4">
                <Loader2 className="h-8 w-8 text-amber-400 animate-spin" />
                <p className="text-white/50 text-sm">Checking order status...</p>
              </div>
            ) : cfg && (
              <>
                <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center"
                  style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}>
                  <cfg.icon className={`h-8 w-8 ${cfg.color}`} />
                </div>

                <div>
                  <p className="text-white font-bold text-lg">{cfg.title}</p>
                  <p className="text-white/50 text-sm mt-2 leading-relaxed">{cfg.desc}</p>
                </div>

                {/* Order details */}
                <div className="rounded-xl p-4 text-left space-y-2"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-white/40">Order ID</span>
                    <span className="text-xs font-mono text-white/80">{id}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-white/40">Status</span>
                    <span className={`text-xs font-semibold capitalize ${cfg.color}`}>{status}</span>
                  </div>
                  {receipt && (
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-white/40">M-Pesa Receipt</span>
                      <span className="text-xs font-mono text-white/80">{receipt}</span>
                    </div>
                  )}
                </div>

                {/* Pending: show live indicator */}
                {status === 'pending' && (
                  <div className="flex items-center justify-center gap-2 text-xs text-white/30">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Checking for updates...
                  </div>
                )}

                {/* Actions */}
                <div className="space-y-2 pt-2">
                  {status === 'confirmed' && (
                    <a
                      href={`https://wa.me/254725297393?text=Hi! I have a confirmed order.%0AOrder ID: ${id}%0AReceipt: ${receipt ?? 'N/A'}`}
                      target="_blank" rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 py-2.5 text-white font-semibold text-sm rounded-xl transition-all"
                      style={{ background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.25)' }}>
                      Chat with BMA Studios on WhatsApp
                    </a>
                  )}
                  {status === 'failed' && (
                    <Link href="/#products"
                      className="w-full flex items-center justify-center py-2.5 text-black font-semibold text-sm rounded-xl bg-amber-400 hover:bg-amber-300 transition-all">
                      Try Again
                    </Link>
                  )}
                  <Link href="/"
                    className="w-full flex items-center justify-center py-2.5 text-white/40 hover:text-white/70 text-sm rounded-xl transition-all"
                    style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
                    Back to BMA Studios
                  </Link>
                </div>
              </>
            )}
          </div>

          {/* Contact */}
          <p className="text-center text-white/20 text-xs">
            Need help? Call{' '}
            <a href="tel:+254725297393" className="text-amber-400 hover:text-amber-300">+254 725 297393</a>
          </p>
        </div>
      </div>
    </div>
  )
}
