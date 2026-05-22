// Send notifications to BMA Studios via n8n webhook
// Reuses the same n8n workflow already set up for M-Pesa orders

export async function notifyBMA(payload: {
  type: 'contact' | 'booking' | 'inquiry'
  name: string
  phone?: string
  email?: string
  service?: string
  message?: string
  date?: string
  time?: string
  location?: string
  notes?: string
  package?: string
  budget?: string
}) {
  const n8nWebhookUrl = process.env.N8N_BMA_WEBHOOK_URL
  if (!n8nWebhookUrl) {
    console.log('N8N_BMA_WEBHOOK_URL not set — skipping notification')
    return
  }

  const typeLabel = {
    contact: '📬 New Contact Message',
    booking: '📅 New Booking Request',
    inquiry: '💬 New Inquiry',
  }[payload.type]

  const lines = [
    typeLabel,
    '',
    `👤 Name: ${payload.name}`,
    payload.phone ? `📱 Phone: ${payload.phone}` : null,
    payload.email ? `📧 Email: ${payload.email}` : null,
    payload.service ? `🎯 Service: ${payload.service}` : null,
    payload.date ? `📆 Date: ${payload.date}` : null,
    payload.time ? `⏰ Time: ${payload.time}` : null,
    payload.location ? `📍 Location: ${payload.location}` : null,
    payload.budget ? `💰 Budget: ${payload.budget}` : null,
    payload.message ? `💬 Message: ${payload.message}` : null,
    payload.notes ? `📝 Notes: ${payload.notes}` : null,
  ].filter(Boolean).join('\n')

  try {
    await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-webhook-secret': process.env.N8N_WEBHOOK_SECRET ?? '',
      },
      body: JSON.stringify({
        // Use same fields as order notification so n8n WhatsApp node works
        notifyPhone: process.env.BMA_NOTIFY_PHONE ?? '254725297393',
        productName: typeLabel,
        orderId: `${payload.type.toUpperCase()}-${Date.now()}`,
        amount: 0,
        phone: payload.phone ?? payload.email ?? 'N/A',
        mpesaReceipt: lines, // reuse this field as the full message body
        customerPhone: null,
        customerSms: null,
      }),
    })
  } catch (err) {
    console.error('BMA notify error:', err)
  }
}
