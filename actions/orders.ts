'use server'

import { supabase } from '@/lib/supabase'

export async function saveOrder({
  orderId,
  productId,
  productName,
  amount,
  phone,
  mpesaReceiptNumber,
  status,
}: {
  orderId: string
  productId: string
  productName: string
  amount: number
  phone: string
  mpesaReceiptNumber?: string
  status: 'pending' | 'confirmed' | 'failed'
}) {
  const { error } = await supabase.from('orders').upsert({
    id: orderId,
    product_id: productId,
    product_name: productName,
    amount,
    phone,
    mpesa_receipt: mpesaReceiptNumber || null,
    status,
    updated_at: new Date().toISOString(),
  })

  if (error) {
    console.error('Supabase save order error:', error)
    return { error: error.message }
  }

  return { success: true }
}
