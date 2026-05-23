import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { validateAdminCookie } from '@/lib/chatAuth'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!validateAdminCookie(req.cookies.get('admin_auth')?.value)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id: sessionId } = await params

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

  // Verify session exists and is active
  const { data: session } = await supabase
    .from('chat_sessions')
    .select('status')
    .eq('id', sessionId)
    .single()

  if (!session || session.status === 'closed') {
    return NextResponse.json({ error: 'Session is closed or not found.' }, { status: 400 })
  }

  // Insert with sender = 'admin' set server-side
  const { data: message, error } = await supabase
    .from('chat_messages')
    .insert({
      session_id: sessionId,
      sender: 'admin',
      content,
    })
    .select('id, sender, content, created_at')
    .single()

  if (error) {
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }

  return NextResponse.json({ message })
}
