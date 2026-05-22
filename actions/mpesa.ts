'use server'

import axios from 'axios'
import { supabase } from '@/lib/supabase'

const MPESA_BASE_URL =
  process.env.MPESA_ENVIRONMENT === 'live'
    ? 'https://api.safaricom.co.ke'
    : 'https://sandbox.safaricom.co.ke'

// Cache token — expires in 55min (Safaricom gives 60min)
let cachedToken: { token: string; expiresAt: number } | null = null

async function getMpesaToken() {
  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    return cachedToken.token
  }
  const auth = Buffer.from(
    `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`
  ).toString('base64')

  const resp = await axios.get(
    `${MPESA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`,
    { headers: { authorization: `Basic ${auth}`, 'User-Agent': 'BMAStudios/1.0' } }
  )
  cachedToken = { token: resp.data.access_token, expiresAt: Date.now() + 55 * 60 * 1000 }
  return cachedToken.token
}

function getTimestamp() {
  const date = new Date()
  return (
    date.getFullYear() +
    ('0' + (date.getMonth() + 1)).slice(-2) +
    ('0' + date.getDate()).slice(-2) +
    ('0' + date.getHours()).slice(-2) +
    ('0' + date.getMinutes()).slice(-2) +
    ('0' + date.getSeconds()).slice(-2)
  )
}

export async function sendStkPush({
  phone, amount, productName, orderId,
}: {
  phone: string; amount: number; productName: string; orderId: string
}) {
  try {
    const token = await getMpesaToken()
    const timestamp = getTimestamp()
    const shortcode = process.env.MPESA_SHORTCODE!
    const passkey = process.env.MPESA_PASSKEY!
    const password = Buffer.from(shortcode + passkey + timestamp).toString('base64')

    const cleaned = phone.replace(/\D/g, '')
    const formattedPhone = `254${cleaned.slice(-9)}`
    const callbackURL = `https://bmastudio.maxxciey.me/api/mpesa/callback`

    const response = await axios.post(
      `${MPESA_BASE_URL}/mpesa/stkpush/v1/processrequest`,
      {
        BusinessShortCode: shortcode, Password: password, Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline', Amount: Math.round(amount),
        PartyA: formattedPhone, PartyB: shortcode, PhoneNumber: formattedPhone,
        CallBackURL: callbackURL, AccountReference: orderId,
        TransactionDesc: `BMA Studios - ${productName}`,
      },
      { headers: { Authorization: `Bearer ${token}`, 'User-Agent': 'BMAStudios/1.0' } }
    )

    const checkoutRequestId = response.data?.CheckoutRequestID

    // ✅ Save checkoutRequestId SERVER-SIDE immediately
    // Don't rely on frontend — callback can fire before frontend saves it
    if (checkoutRequestId) {
      await supabase
        .from('orders')
        .update({ checkout_request_id: checkoutRequestId, updated_at: new Date().toISOString() })
        .eq('id', orderId)

      console.log(`STK push sent — order ${orderId} linked to ${checkoutRequestId}`)
    }

    return { data: response.data }
  } catch (error: any) {
    console.error('STK Push error:', error?.response?.data || error.message)
    return {
      error: error?.response?.data?.errorMessage || error.message || 'STK Push failed',
    }
  }
}

export async function queryStkPush(checkoutRequestId: string) {
  try {
    const token = await getMpesaToken()
    const timestamp = getTimestamp()
    const shortcode = process.env.MPESA_SHORTCODE!
    const passkey = process.env.MPESA_PASSKEY!
    const password = Buffer.from(shortcode + passkey + timestamp).toString('base64')

    const response = await axios.post(
      `${MPESA_BASE_URL}/mpesa/stkpushquery/v1/query`,
      {
        BusinessShortCode: shortcode, Password: password,
        Timestamp: timestamp, CheckoutRequestID: checkoutRequestId,
      },
      { headers: { Authorization: `Bearer ${token}`, 'User-Agent': 'BMAStudios/1.0' } }
    )

    return { data: response.data }
  } catch (error: any) {
    return { error: error?.response?.data || error.message }
  }
}
