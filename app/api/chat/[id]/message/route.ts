import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { validateUserToken } from '@/lib/chatAuth'
import { rateLimit } from '@/lib/rateLimit'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: sessionId } = await params

  // Rate limit: 30 messages per minute per session
  const allowed = rateLimit(`msg_${sessionId}`, 30, 60 * 1000)
  if (!allowed) {
    return NextResponse.json({ error: 'Slow down — too many messages.' }, { status: 429 })
  }

  // Validate user token
  const authHeader = req.headers.get('authorization')
  const session = await validateUserToken(sessionId, authHeader)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Only allow messages once session is active (agent has taken over)
  if (session.status === 'waiting') {
    return NextResponse.json({ error: 'Waiting for agent to join.' }, { status: 400 })
  }

  let body: { content?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const content = String(body.content ?? '').trim().slice(0, 2000)
  if (!content) {
    return NextResponse.json({ error: 'Message cannot be empty.' }, { status: 400 })
  }

  // Insert message — sender always set server-side (never trusted from client)
  const { data: message, error } = await supabase
    .from('chat_messages')
    .insert({
      session_id: sessionId,
      sender: 'user', // always set server-side
      content,
    })
    .select('id, sender, content, created_at')
    .single()

  if (error) {
    console.error('Message insert error:', error)
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }

  return NextResponse.json({ message })
}
