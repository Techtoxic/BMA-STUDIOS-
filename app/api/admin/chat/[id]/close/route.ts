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

  const { error } = await supabase
    .from('chat_sessions')
    .update({ status: 'closed' })
    .eq('id', sessionId)
    .neq('status', 'closed')

  if (error) {
    return NextResponse.json({ error: 'Failed to close session' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
