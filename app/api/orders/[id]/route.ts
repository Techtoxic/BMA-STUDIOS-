import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const cookieStore = await cookies()
  const adminAuth = cookieStore.get('admin_auth')
  const isAdmin = adminAuth?.value === (process.env.ADMIN_SECRET ?? 'bma_secret_token')
  const token = request.nextUrl.searchParams.get('token')

  // Must be admin or have a session token
  if (!isAdmin && !token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Fetch the order by ID (service role bypasses RLS)
  const { data, error } = await supabase
    .from('orders')
    .select('id, status, mpesa_receipt, session_token')
    .eq('id', params.id)
    .single()

  if (error || !data) return NextResponse.json({ data: null }, { status: 404 })

  // If not admin, verify session token matches
  if (!isAdmin && data.session_token && data.session_token !== token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return NextResponse.json({ data })
}
