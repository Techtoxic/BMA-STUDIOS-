import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const callback = body?.Body?.stkCallback

    if (!callback) {
      console.log('Callback: no stkCallback in body')
      return NextResponse.json({ ResultCode: 0, ResultDesc: 'Accepted' })
    }

    const { CheckoutRequestID, ResultCode, CallbackMetadata } = callback
    console.log(`Callback received — CheckoutRequestID: ${CheckoutRequestID} ResultCode: ${ResultCode}`)

    if (ResultCode === 0) {
      const items: Record<string, any> = {}
      CallbackMetadata?.Item?.forEach((item: any) => {
        if (item.Value !== undefined) items[item.Name] = item.Value
      })

      const mpesaReceipt = items['MpesaReceiptNumber'] ?? null
      const amount = items['Amount'] ?? null
      const customerPhone = items['PhoneNumber']?.toString() ?? null
      console.log(`Payment confirmed — receipt: ${mpesaReceipt} amount: ${amount} phone: ${customerPhone}`)

      // Look up order by checkout_request_id
      const { data: order, error: fetchError } = await supabase
        .from('orders')
        .select('*')
        .eq('checkout_request_id', CheckoutRequestID)
        .single()

      if (fetchError || !order) {
        console.error(`Callback: order NOT FOUND for CheckoutRequestID ${CheckoutRequestID} — error: ${fetchError?.message}`)
        // Still return 200 so Safaricom doesn't retry
        return NextResponse.json({ ResultCode: 0, ResultDesc: 'Accepted' })
      }

      console.log(`Order found: ${order.id} — updating to confirmed`)

      await supabase
        .from('orders')
        .update({ status: 'confirmed', mpesa_receipt: mpesaReceipt, updated_at: new Date().toISOString() })
        .eq('id', order.id)

      await notifyBMAStudios({
        orderId: order.id, productName: order.product_name,
        amount: amount ?? order.amount,
        phone: customerPhone ?? order.phone,
        mpesaReceipt,
      })

    } else {
      console.log(`Payment not successful — ResultCode: ${ResultCode} for ${CheckoutRequestID}`)
      await supabase
        .from('orders')
        .update({ status: 'failed', updated_at: new Date().toISOString() })
        .eq('checkout_request_id', CheckoutRequestID)
    }

    return NextResponse.json({ ResultCode: 0, ResultDesc: 'Accepted' })
  } catch (error) {
    console.error('M-Pesa callback error:', error)
    return NextResponse.json({ ResultCode: 0, ResultDesc: 'Accepted' })
  }
}

async function notifyBMAStudios({ orderId, productName, amount, phone, mpesaReceipt }: {
  orderId: string; productName: string; amount: number; phone: string; mpesaReceipt: string
}) {
  const n8nWebhookUrl = process.env.N8N_BMA_WEBHOOK_URL
  if (!n8nWebhookUrl) {
    console.error('N8N_BMA_WEBHOOK_URL not set — cannot send WhatsApp notification!')
    return
  }
  try {
    const res = await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId, productName, amount, phone,
        mpesaReceipt: mpesaReceipt ?? 'N/A',
        notifyPhone: process.env.BMA_NOTIFY_PHONE ?? '254725297393',
      }),
    })
    if (!res.ok) {
      console.error(`n8n webhook failed — status: ${res.status}`)
    } else {
      console.log(`📲 n8n notified for order ${orderId}`)
    }
  } catch (err) {
    console.error('n8n notify error:', err)
  }
}
