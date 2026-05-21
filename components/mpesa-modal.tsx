'use client'

import { useState } from 'react'
import { X, Smartphone, CheckCircle, Loader2, ShoppingBag } from 'lucide-react'
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

type Step = 'form' | 'waiting' | 'success' | 'error'

function generateOrderId() {
  const timestamp = Date.now().toString().slice(-6)
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  return `BMA-${timestamp}-${random}`
}

export function MpesaModal({ product, onClose }: MpesaModalProps) {
  const [phone, setPhone] = useState('')
  const [step, setStep] = useState<Step>('form')
  const [errorMsg, setErrorMsg] = useState('')
  const [orderId, setOrderId] = useState('')
  const [loading, setLoading] = useState(false)

  const handlePay = async () => {
    const kenyanPhone = /^(07\d{8}|01\d{8}|2547\d{8}|2541\d{8}|\+2547\d{8}|\+2541\d{8})$/
    if (!kenyanPhone.test(phone.trim())) {
      setErrorMsg('Please enter a valid Safaricom number e.g. 0712345678')
      return
    }

    setErrorMsg('')
    setLoading(true)
    const newOrderId = generateOrderId()
    setOrderId(newOrderId)

    await saveOrder({
      orderId: newOrderId,
      productId: product._id,
      productName: product.name,
      amount: product.price,
      phone: phone.trim(),
      status: 'pending',
    })

    const { data, error } = await sendStkPush({
      phone: phone.trim(),
      amount: product.price,
      productName: product.name,
      orderId: newOrderId,
    })

    if (error || !data?.CheckoutRequestID) {
      setErrorMsg(error || 'Failed to initiate payment. Please try again.')
      setLoading(false)
      return
    }

    setLoading(false)
    setStep('waiting')

    let attempts = 0
    const checkoutRequestId = data.CheckoutRequestID

    const timer = setInterval(async () => {
      attempts++

      if (attempts >= 15) {
        clearInterval(timer)
        await saveOrder({
          orderId: newOrderId,
          productId: product._id,
          productName: product.name,
          amount: product.price,
          phone: phone.trim(),
          status: 'failed',
        })
        setStep('error')
        setErrorMsg('Payment timed out. Please try again.')
        return
      }

      const { data: queryData, error: queryError } = await queryStkPush(checkoutRequestId)

      if (queryError) {
        if (queryError?.errorCode !== '500.001.1001') {
          clearInterval(timer)
          setStep('error')
          setErrorMsg('Payment cancelled or failed.')
          await saveOrder({
            orderId: newOrderId,
            productId: product._id,
            productName: product.name,
            amount: product.price,
            phone: phone.trim(),
            status: 'failed',
          })
        }
        return
      }

      if (queryData?.ResultCode === '0') {
        clearInterval(timer)
        await saveOrder({
          orderId: newOrderId,
          productId: product._id,
          productName: product.name,
          amount: product.price,
          phone: phone.trim(),
          mpesaReceiptNumber: queryData?.MpesaReceiptNumber,
          status: 'confirmed',
        })
        setStep('success')
      } else if (queryData?.ResultCode && queryData.ResultCode !== '0') {
        clearInterval(timer)
        setStep('error')
        setErrorMsg(queryData?.ResultDesc || 'Payment failed.')
        await saveOrder({
          orderId: newOrderId,
          productId: product._id,
          productName: product.name,
          amount: product.price,
          phone: phone.trim(),
          status: 'failed',
        })
      }
    }, 3000)
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: '#000000', border: '1px solid rgba(255,255,255,0.08)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        {step !== 'waiting' && (
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-10 p-1.5 rounded-full transition-colors text-white/40 hover:text-white/80"
            style={{ background: 'rgba(255,255,255,0.06)' }}
          >
            <X className="h-4 w-4" />
          </button>
        )}

        {/* Header */}
        <div
          className="px-5 py-4"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', background: '#000' }}
        >
          <div className="flex items-center gap-3">
            <div
              className="h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
            >
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
                <p className="text-xs text-white/40 mb-3">
                  Enter the Safaricom number to receive STK push
                </p>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value)
                    setErrorMsg('')
                  }}
                  placeholder="e.g. 0712345678"
                  className="w-full rounded-xl px-4 py-3 text-white text-sm placeholder-white/25 outline-none transition-all"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
                  }}
                />
                {errorMsg && <p className="text-xs text-red-400 mt-1.5">{errorMsg}</p>}
              </div>

              <div
                className="rounded-xl p-3 text-xs text-white/35 space-y-1"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
              >
                <p>• You will receive an M-Pesa prompt on your phone</p>
                <p>• Enter your PIN to complete payment</p>
                <p>• Do not close this page</p>
              </div>

              <button
                onClick={handlePay}
                disabled={loading || !phone}
                className="w-full flex items-center justify-center gap-2 py-3 font-semibold text-sm rounded-xl transition-all duration-200 text-white disabled:opacity-30 disabled:cursor-not-allowed"
                style={{ background: loading || !phone ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.12)' }}
                onMouseEnter={(e) => {
                  if (!loading && phone) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.16)'
                }}
                onMouseLeave={(e) => {
                  if (!loading && phone) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.12)'
                }}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending prompt...
                  </>
                ) : (
                  <>
                    <Smartphone className="h-4 w-4" />
                    Pay KSH {product.price.toLocaleString()} via M-Pesa
                  </>
                )}
              </button>
            </div>
          )}

          {/* STEP: Waiting */}
          {step === 'waiting' && (
            <div className="text-center py-4 space-y-4">
              <div className="relative mx-auto w-16 h-16">
                <div
                  className="absolute inset-0 rounded-full animate-ping"
                  style={{ border: '1px solid rgba(255,255,255,0.12)' }}
                />
                <div
                  className="relative h-16 w-16 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(255,255,255,0.05)' }}
                >
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
              <div
                className="mx-auto w-16 h-16 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.15)' }}
              >
                <CheckCircle className="h-8 w-8 text-green-400" />
              </div>
              <div>
                <p className="text-white font-semibold">Payment Confirmed! 🎉</p>
                <p className="text-xs text-white/40 mt-1">{product.name}</p>
                <p className="text-white font-bold mt-1">KSH {product.price.toLocaleString()}</p>
              </div>

              <div
                className="rounded-xl p-3 text-left space-y-1"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <p className="text-xs text-white/40">Order ID</p>
                <p className="text-sm font-mono font-bold text-white">{orderId}</p>
                <p className="text-[10px] text-white/30">Screenshot this for your records</p>
              </div>

              <a
                href={`https://wa.me/254725297393?text=Hi BMA Studios! I just placed an order.%0AOrder ID: ${orderId}%0AProduct: ${product.name}%0AAmount: KSH ${product.price.toLocaleString()}%0APhone: ${phone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-2.5 text-white font-semibold text-sm rounded-xl transition-all duration-200"
                style={{ background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.25)' }}
              >
                Message BMA Studios on WhatsApp
              </a>

              <button
                onClick={onClose}
                className="w-full py-2.5 text-white/40 hover:text-white/70 text-sm rounded-xl transition-all"
                style={{ border: '1px solid rgba(255,255,255,0.07)' }}
              >
                Close
              </button>
            </div>
          )}

          {/* STEP: Error */}
          {step === 'error' && (
            <div className="text-center py-4 space-y-4">
              <div
                className="mx-auto w-16 h-16 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.15)' }}
              >
                <X className="h-8 w-8 text-red-400" />
              </div>
              <div>
                <p className="text-white font-semibold">Payment Failed</p>
                <p className="text-xs text-white/40 mt-1">{errorMsg}</p>
              </div>
              <button
                onClick={() => { setStep('form'); setErrorMsg('') }}
                className="w-full py-2.5 text-white font-semibold text-sm rounded-xl transition-all"
                style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.13)' }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.08)' }}
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
