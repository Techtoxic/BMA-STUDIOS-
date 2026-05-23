import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { validateUserToken, validateAdminCookie } from '@/lib/chatAuth'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: sessionId } = await params

  // Allow either user token or admin cookie
  const authHeader = req.headers.get('authorization')
  const adminCookie = req.cookies.get('admin_auth')?.value

  const isAdmin = validateAdminCookie(adminCookie)
  const userSession = !isAdmin ? await validateUserToken(sessionId, authHeader) : null

  if (!isAdmin && !userSession) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Fetch session
  const { data: session, error: sessionError } = await supabase
    .from('chat_sessions')
    .select('id, status, user_name, created_at, taken_over_at, ai_history')
    .eq('id', sessionId)
    .single()

  if (sessionError || !session) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 })
  }

  // Fetch live messages
  const { data: messages } = await supabase
    .from('chat_messages')
    .select('id, sender, content, created_at')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true })

  return NextResponse.json({ session, messages: messages ?? [] })
}
