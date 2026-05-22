import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// Frontend polls this to check if callback already confirmed the order
export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const { data, error } = await supabase
    .from('orders')
    .select('id, status, mpesa_receipt')
    .eq('id', params.id)
    .single()

  if (error) return NextResponse.json({ data: null }, { status: 404 })
  return NextResponse.json({ data })
}
