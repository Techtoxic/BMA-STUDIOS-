import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const callback = body?.Body?.stkCallback

    if (!callback) {
      return NextResponse.json({ ResultCode: 0, ResultDesc: 'Accepted' })
    }

    const { CheckoutRequestID, ResultCode, CallbackMetadata } = callback

    if (ResultCode === 0) {
      const items: Record<string, any> = {}
      CallbackMetadata?.Item?.forEach((item: any) => {
        if (item.Value !== undefined) items[item.Name] = item.Value
      })

      const mpesaReceipt = items['MpesaReceiptNumber'] ?? null
      const amount = items['Amount'] ?? null
      const customerPhone = items['PhoneNumber']?.toString() ?? null

      const { data: order, error: fetchError } = await supabase
        .from('orders')
        .select('*')
        .eq('checkout_request_id', CheckoutRequestID)
        .single()

      if (!fetchError && order) {
        await supabase
          .from('orders')
          .update({ status: 'confirmed', mpesa_receipt: mpesaReceipt, updated_at: new Date().toISOString() })
          .eq('id', order.id)

        await notifyBMAStudios({
          orderId: order.id,
          productName: order.product_name,
          amount: amount ?? order.amount,
          phone: customerPhone ?? order.phone,
          mpesaReceipt,
        })
      }
    } else {
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
  // Posts to your MUST Bot n8n workflow — BMA Order Webhook node
  const n8nWebhookUrl = process.env.N8N_BMA_WEBHOOK_URL
  if (!n8nWebhookUrl) {
    console.log('N8N_BMA_WEBHOOK_URL not set — skipping WhatsApp notify')
    return
  }
  try {
    await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId,
        productName,
        amount,
        phone,
        mpesaReceipt: mpesaReceipt ?? 'N/A',
        notifyPhone: process.env.BMA_NOTIFY_PHONE ?? '254725297393',
      }),
    })
    console.log('📲 n8n notified for order', orderId)
  } catch (err) {
    console.error('n8n notify error:', err)
  }
}
