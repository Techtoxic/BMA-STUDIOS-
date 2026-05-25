import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  // Public read — order status and receipt are not sensitive
  const { data, error } = await supabase
    .from('orders')
    .select('id, status, mpesa_receipt')
    .eq('id', id)
    .single()

  if (error || !data) return NextResponse.json({ data: null }, { status: 404 })

  return NextResponse.json({ data })
}
