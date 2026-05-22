import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  // Auth check
  const cookieStore = await cookies()
  const auth = cookieStore.get('admin_auth')
  if (!auth || auth.value !== (process.env.ADMIN_SECRET ?? 'bma_secret_token')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Mark any pending order older than 10 minutes as failed
  const cutoff = new Date(Date.now() - 10 * 60 * 1000).toISOString()

  const { data, error } = await supabase
    .from('orders')
    .update({ status: 'failed', updated_at: new Date().toISOString() })
    .eq('status', 'pending')
    .lt('updated_at', cutoff)
    .select('id')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ cleaned: data?.length ?? 0 })
}
