'use server'

import axios from 'axios'

const MPESA_BASE_URL =
  process.env.MPESA_ENVIRONMENT === 'live'
    ? 'https://api.safaricom.co.ke'
    : 'https://sandbox.safaricom.co.ke'

async function getMpesaToken() {
  const auth = Buffer.from(
    `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`
  ).toString('base64')

  const resp = await axios.get(
    `${MPESA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`,
    { headers: { authorization: `Basic ${auth}` } }
  )
  return resp.data.access_token
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
  phone,
  amount,
  productName,
  orderId,
}: {
  phone: string
  amount: number
  productName: string
  orderId: string
}) {
  try {
    const token = await getMpesaToken()
    const timestamp = getTimestamp()
    const shortcode = process.env.MPESA_SHORTCODE!
    const passkey = process.env.MPESA_PASSKEY!
    const password = Buffer.from(shortcode + passkey + timestamp).toString('base64')

    // Clean phone to 2547XXXXXXXX format
    const cleaned = phone.replace(/\D/g, '')
    const formattedPhone = `254${cleaned.slice(-9)}`

    const callbackURL = `https://bmastudio.maxxciey.me/api/mpesa/callback`

    const response = await axios.post(
      `${MPESA_BASE_URL}/mpesa/stkpush/v1/processrequest`,
      {
        BusinessShortCode: shortcode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: Math.round(amount),
        PartyA: formattedPhone,
        PartyB: shortcode,
        PhoneNumber: formattedPhone,
        CallBackURL: callbackURL,
        AccountReference: orderId,
        TransactionDesc: `BMA Studios - ${productName}`,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    )

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
        BusinessShortCode: shortcode,
        Password: password,
        Timestamp: timestamp,
        CheckoutRequestID: checkoutRequestId,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    )

    return { data: response.data }
  } catch (error: any) {
    return { error: error?.response?.data || error.message }
  }
}
