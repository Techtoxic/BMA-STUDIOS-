import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    // 🔒 Validate secret token — rejects anyone who isn't Safaricom
    const secret = request.nextUrl.searchParams.get('secret')
    const expectedSecret = process.env.CALLBACK_SECRET ?? 'bma_callback_secret'
    if (secret !== expectedSecret) {
      console.warn('Callback rejected — invalid secret')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const callback = body?.Body?.stkCallback

    if (!callback) {
      console.log('Callback: no stkCallback in body')
      return NextResponse.json({ ResultCode: 0, ResultDesc: 'Accepted' })
    }

    const { CheckoutRequestID, ResultCode, CallbackMetadata } = callback
    console.log(`Callback — CheckoutRequestID: ${CheckoutRequestID} ResultCode: ${ResultCode}`)

    if (ResultCode === 0) {
      const items: Record<string, any> = {}
      CallbackMetadata?.Item?.forEach((item: any) => {
        if (item.Value !== undefined) items[item.Name] = item.Value
      })

      const mpesaReceipt = items['MpesaReceiptNumber'] ?? null
      const amount = items['Amount'] ?? null
      const customerPhone = items['PhoneNumber']?.toString() ?? null
      console.log(`Payment confirmed — receipt: ${mpesaReceipt} phone: ${customerPhone}`)

      const { data: order, error: fetchError } = await supabase
        .from('orders')
        .select('*')
        .eq('checkout_request_id', CheckoutRequestID)
        .single()

      if (fetchError || !order) {
        console.error(`Order NOT FOUND for ${CheckoutRequestID} — ${fetchError?.message}`)
        return NextResponse.json({ ResultCode: 0, ResultDesc: 'Accepted' })
      }

      console.log(`Order found: ${order.id} — updating to confirmed`)

      await supabase
        .from('orders')
        .update({ status: 'confirmed', mpesa_receipt: mpesaReceipt, updated_at: new Date().toISOString() })
        .eq('id', order.id)

      await notifyViaN8n({
        orderId: order.id, productName: order.product_name,
        amount: amount ?? order.amount,
        customerPhone: customerPhone ?? order.phone,
        mpesaReceipt,
        notifyPhone: process.env.BMA_NOTIFY_PHONE ?? '254725297393',
      })

    } else {
      console.log(`Payment not successful — ResultCode: ${ResultCode}`)
      await supabase
        .from('orders')
        .update({ status: 'failed', updated_at: new Date().toISOString() })
        .eq('checkout_request_id', CheckoutRequestID)
    }

    return NextResponse.json({ ResultCode: 0, ResultDesc: 'Accepted' })
  } catch (error) {
    console.error('Callback error:', error)
    return NextResponse.json({ ResultCode: 0, ResultDesc: 'Accepted' })
  }
}

async function notifyViaN8n({ orderId, productName, amount, customerPhone, mpesaReceipt, notifyPhone }: {
  orderId: string; productName: string; amount: number
  customerPhone: string; mpesaReceipt: string; notifyPhone: string
}) {
  const n8nWebhookUrl = process.env.N8N_BMA_WEBHOOK_URL
  if (!n8nWebhookUrl) { console.error('N8N_BMA_WEBHOOK_URL not set!'); return }

  // 🔒 Include shared secret so n8n can reject fake POSTs
  const webhookSecret = process.env.N8N_WEBHOOK_SECRET ?? 'bma_n8n_secret'

  try {
    const res = await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-webhook-secret': webhookSecret,
      },
      body: JSON.stringify({
        orderId, productName, amount, phone: customerPhone,
        mpesaReceipt: mpesaReceipt ?? 'N/A', notifyPhone,
        customerPhone,
        customerSms:
          `BMA Studios: Payment of KSH ${amount} received for ${productName}. ` +
          `Order ID: ${orderId}. We will contact you shortly via call or WhatsApp. Thank you!`,
      }),
    })
    if (!res.ok) console.error(`n8n webhook failed — status: ${res.status}`)
    else console.log(`📲 n8n notified for order ${orderId}`)
  } catch (err) {
    console.error('n8n notify error:', err)
  }
}
