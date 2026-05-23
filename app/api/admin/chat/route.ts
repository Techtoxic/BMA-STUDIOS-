import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { validateAdminCookie } from '@/lib/chatAuth'

export async function GET(req: NextRequest) {
  if (!validateAdminCookie(req.cookies.get('admin_auth')?.value)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: sessions, error } = await supabase
    .from('chat_sessions')
    .select('id, status, user_name, user_email, user_phone, created_at, taken_over_at')
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch sessions' }, { status: 500 })
  }

  return NextResponse.json({ sessions: sessions ?? [] })
}
