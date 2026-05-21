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

    // Save order as pending first
    await saveOrder({
      orderId: newOrderId,
      productId: product._id,
      productName: product.name,
      amount: product.price,
      phone: phone.trim(),
      status: 'pending',
    })

    // Send STK push
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

    // Poll every 3s for up to 15 attempts (45 seconds)
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
        // errorCode 500.001.1001 = still pending, keep polling
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
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm bg-[#111] border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        {step !== 'waiting' && (
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        {/* Header */}
        <div className="bg-gradient-to-r from-amber-400/20 to-amber-600/10 border-b border-white/10 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-amber-400/20 flex items-center justify-center">
              <ShoppingBag className="h-4 w-4 text-amber-400" />
            </div>
            <div>
              <p className="text-xs text-amber-400 font-medium">BMA Studios</p>
              <p className="text-sm font-semibold text-white truncate max-w-[200px]">{product.name}</p>
            </div>
            <div className="ml-auto text-right">
              <p className="text-xs text-muted-foreground">Amount</p>
              <p className="text-base font-bold text-amber-400">KSH {product.price.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="p-5">
          {/* STEP: Form */}
          {step === 'form' && (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-white font-medium mb-1">M-Pesa Phone Number</p>
                <p className="text-xs text-muted-foreground mb-3">
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
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/30 focus:outline-none focus:border-amber-400/50 focus:bg-white/8 transition-all"
                />
                {errorMsg && <p className="text-xs text-red-400 mt-1.5">{errorMsg}</p>}
              </div>

              <div className="bg-white/5 rounded-xl p-3 text-xs text-muted-foreground space-y-1">
                <p>• You will receive an M-Pesa prompt on your phone</p>
                <p>• Enter your PIN to complete payment</p>
                <p>• Do not close this page</p>
              </div>

              <button
                onClick={handlePay}
                disabled={loading || !phone}
                className="w-full flex items-center justify-center gap-2 py-3 bg-amber-400 hover:bg-amber-300 disabled:bg-amber-400/30 disabled:cursor-not-allowed text-black disabled:text-black/40 font-semibold text-sm rounded-xl transition-all duration-200"
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
                <div className="absolute inset-0 rounded-full border-2 border-amber-400/20 animate-ping" />
                <div className="relative h-16 w-16 rounded-full bg-amber-400/10 flex items-center justify-center">
                  <Smartphone className="h-7 w-7 text-amber-400" />
                </div>
              </div>
              <div>
                <p className="text-white font-semibold text-sm">Check your phone!</p>
                <p className="text-xs text-muted-foreground mt-1">
                  M-Pesa prompt sent to <span className="text-amber-400">{phone}</span>
                </p>
                <p className="text-xs text-muted-foreground mt-1">Enter your PIN to complete payment</p>
              </div>
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <Loader2 className="h-3 w-3 animate-spin" />
                Waiting for confirmation...
              </div>
            </div>
          )}

          {/* STEP: Success */}
          {step === 'success' && (
            <div className="text-center py-4 space-y-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-400" />
              </div>
              <div>
                <p className="text-white font-semibold">Payment Confirmed! 🎉</p>
                <p className="text-xs text-muted-foreground mt-1">{product.name}</p>
                <p className="text-amber-400 font-bold mt-1">KSH {product.price.toLocaleString()}</p>
              </div>

              <div className="bg-white/5 rounded-xl p-3 text-left space-y-1">
                <p className="text-xs text-muted-foreground">Order ID</p>
                <p className="text-sm font-mono font-bold text-amber-400">{orderId}</p>
                <p className="text-[10px] text-muted-foreground">Screenshot this for your records</p>
              </div>

              <a
                href={`https://wa.me/254725297393?text=Hi BMA Studios! I just placed an order.%0AOrder ID: ${orderId}%0AProduct: ${product.name}%0AAmount: KSH ${product.price.toLocaleString()}%0APhone: ${phone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-green-600 hover:bg-green-500 text-white font-semibold text-sm rounded-xl transition-all duration-200"
              >
                Message BMA Studios on WhatsApp
              </a>

              <button
                onClick={onClose}
                className="w-full py-2.5 border border-white/10 text-white/60 hover:text-white text-sm rounded-xl transition-all"
              >
                Close
              </button>
            </div>
          )}

          {/* STEP: Error */}
          {step === 'error' && (
            <div className="text-center py-4 space-y-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
                <X className="h-8 w-8 text-red-400" />
              </div>
              <div>
                <p className="text-white font-semibold">Payment Failed</p>
                <p className="text-xs text-muted-foreground mt-1">{errorMsg}</p>
              </div>
              <button
                onClick={() => {
                  setStep('form')
                  setErrorMsg('')
                }}
                className="w-full py-2.5 bg-amber-400 hover:bg-amber-300 text-black font-semibold text-sm rounded-xl transition-all"
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
