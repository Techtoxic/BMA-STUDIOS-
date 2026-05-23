import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { validateAdminCookie } from '@/lib/chatAuth'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!validateAdminCookie(req.cookies.get('admin_auth')?.value)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id: sessionId } = await params

  const { data: session, error } = await supabase
    .from('chat_sessions')
    .select('*')
    .eq('id', sessionId)
    .single()

  if (error || !session) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 })
  }

  const { data: messages } = await supabase
    .from('chat_messages')
    .select('id, sender, content, created_at')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true })

  return NextResponse.json({ session, messages: messages ?? [] })
}
