'use client'

import { useState, useEffect, useRef } from 'react'
import { X, Smartphone, CheckCircle, Loader2, ShoppingBag, Phone } from 'lucide-react'
import { sendStkPush, queryStkPush } from '@/actions/mpesa'
import { saveOrder } from '@/actions/orders'

interface Product {
  _id: string
  name: string
  price: number
  category: string
}

interface MpesaModalProps {
  product: Product
  onClose: () => void
}

type Step = 'form' | 'processing' | 'waiting' | 'success' | 'error'

function generateOrderId() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  const random = Array.from({ length: 9 }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join('')
  return `BMA-${random}`
}

function generateSessionToken() {
  const arr = new Uint8Array(32)
  crypto.getRandomValues(arr)
  return Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('')
}

const FINAL_FAILURE_CODES = new Set(['1032', '2001', '1025', '1037'])

export function MpesaModal({ product, onClose }: MpesaModalProps) {
  const [phone, setPhone] = useState('')
  const [step, setStep] = useState<Step>('form')
  const [errorMsg, setErrorMsg] = useState('')
  const [orderId, setOrderId] = useState('')
  const pollingTimer = useRef<NodeJS.Timeout | null>(null)
  const checkoutRef = useRef<string | null>(null)

  useEffect(() => {
    return () => { if (pollingTimer.current) clearInterval(pollingTimer.current) }
  }, [])

  const sessionTokenRef = useRef<string | null>(null)

  // Poll DB first (callback may have already confirmed), then Daraja as backup
  const startPolling = (newOrderId: string, currentPhone: string) => {
    let attempts = 0
    pollingTimer.current = setInterval(async () => {
      attempts++

      // 1. Check DB with session token — secured endpoint
      try {
        const token = sessionTokenRef.current
        const res = await fetch(`/api/orders/${newOrderId}${token ? `?token=${token}` : ''}`)
        if (res.ok) {
          const { data: dbOrder } = await res.json()
          if (dbOrder?.status === 'confirmed') {
            clearInterval(pollingTimer.current!)
            setStep('success')
            return
          }
          if (dbOrder?.status === 'failed' && attempts > 3) {
            clearInterval(pollingTimer.current!)
            setStep('error')
            setErrorMsg('Payment was not completed. Please try again.')
            return
          }
        }
      } catch {}

      if (attempts >= 24) {
        clearInterval(pollingTimer.current!)
        await saveOrder({
          orderId: newOrderId, productId: product._id, productName: product.name,
          amount: product.price, phone: currentPhone, status: 'failed',
        })
        setStep('error')
        setErrorMsg('Payment timed out. Please try again.')
        return
      }

      // 2. Daraja query as backup (only if we have checkoutRequestId)
      if (checkoutRef.current) {
        const { data: queryData, error: queryError } = await queryStkPush(checkoutRef.current)
        if (queryError) return

        if (queryData?.ResultCode === '0') {
          clearInterval(pollingTimer.current!)
          await saveOrder({
            orderId: newOrderId, productId: product._id, productName: product.name,
            amount: product.price, phone: currentPhone,
            checkoutRequestId: checkoutRef.current,
            mpesaReceiptNumber: queryData?.MpesaReceiptNumber, status: 'confirmed',
          })
          setStep('success')
          return
        }

        if (queryData?.ResultCode && FINAL_FAILURE_CODES.has(queryData.ResultCode)) {
          clearInterval(pollingTimer.current!)
          setStep('error')
          setErrorMsg(
            queryData.ResultCode === '1032' ? 'Payment request was cancelled.' :
            queryData.ResultCode === '2001' ? 'Wrong M-Pesa PIN entered.' :
            'Payment was declined. Please try again.'
          )
          await saveOrder({
            orderId: newOrderId, productId: product._id, productName: product.name,
            amount: product.price, phone: currentPhone,
            checkoutRequestId: checkoutRef.current, status: 'failed',
          })
        }
      }
    }, 5000)
  }

  const handlePay = async () => {
    const kenyanPhone = /^(07\d{8}|01\d{8}|2547\d{8}|2541\d{8}|\+2547\d{8}|\+2541\d{8})$/
    if (!kenyanPhone.test(phone.trim())) {
      setErrorMsg('Please enter a valid Safaricom number e.g. 0712345678')
      return
    }

    setErrorMsg('')
    const newOrderId = generateOrderId()
    const sessionToken = generateSessionToken()
    setOrderId(newOrderId)
    sessionTokenRef.current = sessionToken
    const currentPhone = phone.trim()

    setStep('processing')

    await saveOrder({
      orderId: newOrderId, productId: product._id, productName: product.name,
      amount: product.price, phone: currentPhone, sessionToken, status: 'pending',
    })

    const { data, error } = await sendStkPush({
      phone: currentPhone, amount: product.price,
      productName: product.name, orderId: newOrderId,
    })

    if (error || !data?.CheckoutRequestID) {
      // STK push actually failed — tell the user honestly
      setStep('error')
      setErrorMsg(error || 'Failed to send M-Pesa prompt. Please try again.')
      return
    }

    // ✅ STK push confirmed sent — NOW tell user to check phone
    checkoutRef.current = data.CheckoutRequestID
    setStep('waiting')
    startPolling(newOrderId, currentPhone)
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
      onClick={step === 'waiting' ? undefined : onClose}
    >
      <div
        className="relative w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: '#000000', border: '1px solid rgba(255,255,255,0.08)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {(step === 'form' || step === 'error' || step === 'success') && (
          <button onClick={onClose}
            className="absolute top-3 right-3 z-10 p-1.5 rounded-full transition-colors text-white/40 hover:text-white/80"
            style={{ background: 'rgba(255,255,255,0.06)' }}>
            <X className="h-4 w-4" />
          </button>
        )}

        {/* Header */}
        <div className="px-5 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', background: '#000' }}>
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <ShoppingBag className="h-4 w-4 text-white/70" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-white/40 font-medium uppercase tracking-widest">BMA Studios</p>
              <p className="text-sm font-semibold text-white truncate">{product.name}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-[10px] text-white/40">Amount</p>
              <p className="text-base font-bold text-white">KSH {product.price.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="p-5">
          {/* STEP: Form */}
          {step === 'form' && (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-white font-medium mb-1">M-Pesa Phone Number</p>
                <p className="text-xs text-white/40 mb-3">Enter the Safaricom number to receive STK push</p>
                <input type="tel" value={phone}
                  onChange={(e) => { setPhone(e.target.value); setErrorMsg('') }}
                  placeholder="e.g. 0712345678"
                  className="w-full rounded-xl px-4 py-3 text-white text-sm placeholder-white/25 outline-none transition-all"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)' }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}
                />
                {errorMsg && <p className="text-xs text-red-400 mt-1.5">{errorMsg}</p>}
              </div>
              <div className="rounded-xl p-3 text-xs text-white/35 space-y-1"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <p>• You will receive an M-Pesa prompt on your phone</p>
                <p>• Enter your PIN to complete payment</p>
                <p>• Do not close this page</p>
              </div>
              <button onClick={handlePay} disabled={!phone}
                className="w-full flex items-center justify-center gap-2 py-3 font-semibold text-sm rounded-xl transition-all duration-200 text-white disabled:opacity-30 disabled:cursor-not-allowed"
                style={{ background: !phone ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.12)' }}
                onMouseEnter={(e) => { if (phone) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.16)' }}
                onMouseLeave={(e) => { if (phone) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.12)' }}
              >
                <Smartphone className="h-4 w-4" />
                Pay KSH {product.price.toLocaleString()} via M-Pesa
              </button>
            </div>
          )}

          {/* STEP: Processing — STK push in flight, honest state */}
          {step === 'processing' && (
            <div className="text-center py-6 space-y-4">
              <div className="mx-auto w-14 h-14 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <Loader2 className="h-6 w-6 text-white/50 animate-spin" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">Initiating transaction...</p>
                <p className="text-xs text-white/35 mt-1">Please wait, this may take a few seconds</p>
              </div>
            </div>
          )}

          {/* STEP: Waiting — STK confirmed sent */}
          {step === 'waiting' && (
            <div className="text-center py-4 space-y-4">
              <div className="relative mx-auto w-16 h-16">
                <div className="absolute inset-0 rounded-full animate-ping" style={{ border: '1px solid rgba(255,255,255,0.12)' }} />
                <div className="relative h-16 w-16 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <Smartphone className="h-7 w-7 text-white/60" />
                </div>
              </div>
              <div>
                <p className="text-white font-semibold text-sm">Check your phone!</p>
                <p className="text-xs text-white/40 mt-1">
                  M-Pesa prompt sent to <span className="text-white/80">{phone}</span>
                </p>
                <p className="text-xs text-white/40 mt-1">Enter your PIN to complete payment</p>
              </div>
              <div className="flex items-center justify-center gap-2 text-xs text-white/30">
                <Loader2 className="h-3 w-3 animate-spin" />
                Waiting for confirmation...
              </div>
            </div>
          )}

          {/* STEP: Success */}
          {step === 'success' && (
            <div className="text-center py-4 space-y-4">
              <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.15)' }}>
                <CheckCircle className="h-8 w-8 text-green-400" />
              </div>

              <div>
                <p className="text-white font-bold text-base">Payment Received! 🎉</p>
                <p className="text-white/60 text-sm mt-2 leading-relaxed">
                  Your transaction has been successfully received.<br />
                  BMA Studios will get back to you shortly via<br />
                  <span className="text-white/80 font-medium">phone call or WhatsApp.</span>
                </p>
              </div>

              <div className="rounded-xl p-3 text-left space-y-2"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="flex justify-between items-center">
                  <p className="text-xs text-white/40">Product</p>
                  <p className="text-xs text-white font-medium">{product.name}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-xs text-white/40">Amount Paid</p>
                  <p className="text-xs text-white font-medium">KSH {product.price.toLocaleString()}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-xs text-white/40">Order ID</p>
                  <p className="text-xs font-mono text-white font-medium">{orderId}</p>
                </div>
              </div>

              <div className="rounded-xl p-3 text-center"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <p className="text-[11px] text-white/35 leading-relaxed">
                  You will also receive an SMS confirmation shortly.{'\n'}
                  Save your Order ID for reference.
                </p>
              </div>

              <a href={`https://wa.me/254725297393?text=Hi BMA Studios! I just placed an order.%0AOrder ID: ${orderId}%0AProduct: ${product.name}%0AAmount: KSH ${product.price.toLocaleString()}%0APhone: ${phone}`}
                target="_blank" rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-2.5 text-white font-semibold text-sm rounded-xl transition-all duration-200"
                style={{ background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.25)' }}>
                Message BMA Studios on WhatsApp
              </a>
              <button onClick={onClose}
                className="w-full py-2.5 text-white/40 hover:text-white/70 text-sm rounded-xl transition-all"
                style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
                Close
              </button>
            </div>
          )}

          {/* STEP: Error */}
          {step === 'error' && (
            <div className="text-center py-4 space-y-4">
              <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.15)' }}>
                <X className="h-8 w-8 text-red-400" />
              </div>
              <div>
                <p className="text-white font-semibold">Payment Failed</p>
                <p className="text-xs text-white/40 mt-1">{errorMsg}</p>
              </div>
              <button onClick={() => { setStep('form'); setErrorMsg('') }}
                className="w-full py-2.5 text-white font-semibold text-sm rounded-xl transition-all"
                style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.13)' }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.08)' }}>
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
