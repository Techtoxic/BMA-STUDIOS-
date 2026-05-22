import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  // Must have either admin cookie OR the order token (passed by frontend after creating order)
  const cookieStore = await cookies()
  const adminAuth = cookieStore.get('admin_auth')
  const isAdmin = adminAuth?.value === (process.env.ADMIN_SECRET ?? 'bma_secret_token')

  // Frontend passes ?token= (the order's own secure token stored in sessionStorage)
  const token = request.nextUrl.searchParams.get('token')

  if (!isAdmin && !token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data, error } = await supabase
    .from('orders')
    .select('id, status, mpesa_receipt')
    .eq('id', params.id)
    .eq(token && !isAdmin ? 'session_token' : 'id', token && !isAdmin ? token : params.id)
    .single()

  if (error) return NextResponse.json({ data: null }, { status: 404 })
  return NextResponse.json({ data })
}
