import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// Safaricom calls this URL when payment completes (success or failure)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const callback = body?.Body?.stkCallback

    if (!callback) {
      return NextResponse.json({ ResultCode: 0, ResultDesc: 'Accepted' })
    }

    const { CheckoutRequestID, ResultCode, CallbackMetadata } = callback

    if (ResultCode === 0) {
      // ✅ Payment successful — extract receipt details
      const items: Record<string, any> = {}
      CallbackMetadata?.Item?.forEach((item: any) => {
        if (item.Value !== undefined) items[item.Name] = item.Value
      })

      const mpesaReceipt = items['MpesaReceiptNumber'] ?? null
      const amount = items['Amount'] ?? null
      const customerPhone = items['PhoneNumber']?.toString() ?? null

      // Find the order by checkout_request_id
      const { data: order, error: fetchError } = await supabase
        .from('orders')
        .select('*')
        .eq('checkout_request_id', CheckoutRequestID)
        .single()

      if (fetchError || !order) {
        console.error('Callback: order not found for', CheckoutRequestID)
        return NextResponse.json({ ResultCode: 0, ResultDesc: 'Accepted' })
      }

      // Update order to confirmed
      await supabase
        .from('orders')
        .update({
          status: 'confirmed',
          mpesa_receipt: mpesaReceipt,
          updated_at: new Date().toISOString(),
        })
        .eq('id', order.id)

      // 🔔 Notify BMA Studios via WhatsApp
      await notifyBMAStudios({
        orderId: order.id,
        productName: order.product_name,
        amount: amount ?? order.amount,
        phone: customerPhone ?? order.phone,
        mpesaReceipt,
      })

      console.log(`✅ Order ${order.id} confirmed — receipt ${mpesaReceipt}`)

    } else {
      // ❌ Payment failed — update order status
      await supabase
        .from('orders')
        .update({ status: 'failed', updated_at: new Date().toISOString() })
        .eq('checkout_request_id', CheckoutRequestID)

      console.log(`❌ Payment failed for checkout ${CheckoutRequestID} — code ${ResultCode}`)
    }

    // Always return 200 — if we return anything else Safaricom retries endlessly
    return NextResponse.json({ ResultCode: 0, ResultDesc: 'Accepted' })

  } catch (error) {
    console.error('M-Pesa callback error:', error)
    // Still 200 — never let Safaricom retry on our errors
    return NextResponse.json({ ResultCode: 0, ResultDesc: 'Accepted' })
  }
}

async function notifyBMAStudios({
  orderId,
  productName,
  amount,
  phone,
  mpesaReceipt,
}: {
  orderId: string
  productName: string
  amount: number
  phone: string
  mpesaReceipt: string
}) {
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID
  const token = process.env.WHATSAPP_TOKEN
  const recipient = process.env.BMA_NOTIFY_PHONE ?? '254725297393'

  if (!phoneNumberId || !token) {
    // Not configured yet — just log so nothing breaks
    console.log('WhatsApp notify not configured. Order:', orderId)
    return
  }

  const message =
    `🛒 *New BMA Studios Order!*\n\n` +
    `📦 *Product:* ${productName}\n` +
    `💰 *Amount:* KSH ${Number(amount).toLocaleString()}\n` +
    `📱 *Customer:* ${phone}\n` +
    `🧾 *M-Pesa Receipt:* ${mpesaReceipt}\n` +
    `🔖 *Order ID:* ${orderId}\n\n` +
    `✅ Payment confirmed via M-Pesa`

  try {
    const res = await fetch(
      `https://graph.facebook.com/v19.0/${phoneNumberId}/messages`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: recipient,
          type: 'text',
          text: { body: message },
        }),
      }
    )

    if (!res.ok) {
      const err = await res.json()
      console.error('WhatsApp notify failed:', err)
    } else {
      console.log(`📲 WhatsApp notification sent to ${recipient}`)
    }
  } catch (err) {
    console.error('WhatsApp notify error:', err)
  }
}
