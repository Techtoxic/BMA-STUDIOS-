import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { generateToken } from '@/lib/chatAuth'
import { rateLimit } from '@/lib/rateLimit'

export async function POST(req: NextRequest) {
  // Rate limit: 3 handovers per hour per IP
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  const allowed = rateLimit(ip, 3, 60 * 60 * 1000)
  if (!allowed) {
    return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 })
  }

  let body: {
    userName?: string
    userEmail?: string
    userPhone?: string
    aiHistory?: Array<{ role: string; content: string }>
  }

  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { userName, userEmail, userPhone, aiHistory = [] } = body

  // Sanitize inputs
  const safeName = String(userName ?? '').trim().slice(0, 100) || 'Anonymous'
  const safeEmail = String(userEmail ?? '').trim().slice(0, 200) || null
  const safePhone = String(userPhone ?? '').trim().slice(0, 30) || null

  // Generate secure tokens server-side
  const userToken = generateToken(32)

  // Insert session into Supabase
  const { data: session, error } = await supabase
    .from('chat_sessions')
    .insert({
      user_token: userToken,
      status: 'waiting',
      user_name: safeName,
      user_email: safeEmail,
      user_phone: safePhone,
      ai_history: aiHistory,
    })
    .select('id')
    .single()

  if (error || !session) {
    console.error('Handover insert error:', error)
    return NextResponse.json({ error: 'Failed to create session' }, { status: 500 })
  }

  const sessionId = session.id
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://bmastudio.maxxciey.me'
  const adminUrl = `${baseUrl}/admin/chat/${sessionId}`
  const chatUrl = `/chat/${sessionId}`

  // Notify owner via n8n → WhatsApp
  const n8nWebhookUrl = process.env.N8N_BMA_WEBHOOK_URL
  if (n8nWebhookUrl) {
    const message = [
      '🔴 LIVE CHAT REQUEST',
      '',
      `👤 Name: ${safeName}`,
      safePhone ? `📱 Phone: ${safePhone}` : null,
      safeEmail ? `📧 Email: ${safeEmail}` : null,
      '',
      `🔗 Open chat:\n${adminUrl}`,
      '',
      'Client is waiting. Tap link to take over.',
    ]
      .filter((l) => l !== null)
      .join('\n')

    try {
      await fetch(n8nWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-webhook-secret': process.env.N8N_WEBHOOK_SECRET ?? '',
        },
        body: JSON.stringify({
          notifyPhone: process.env.BMA_NOTIFY_PHONE ?? '254725297393',
          productName: '🔴 Live Chat Request',
          orderId: `CHAT-${sessionId.slice(0, 8).toUpperCase()}`,
          amount: 0,
          phone: safePhone ?? safeEmail ?? 'N/A',
          mpesaReceipt: message,
          customerPhone: null,
          customerSms: null,
        }),
      })
    } catch (err) {
      console.error('WhatsApp notify error:', err)
      // Don't fail the request — session was created successfully
    }
  }

  return NextResponse.json({
    sessionId,
    userToken,
    chatUrl,
  })
}
