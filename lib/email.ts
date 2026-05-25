// Brevo (formerly Sendinblue) email notifications
// Free tier: 300 emails/day — more than enough for BMA Studios

export async function sendEmail({
  subject,
  html,
  replyTo,
  toName,
  toEmail,
}: {
  subject: string
  html: string
  replyTo?: string
  toName?: string
  toEmail?: string
}): Promise<{ ok: boolean; error?: string }> {
  const apiKey = process.env.BREVO_API_KEY?.trim()
  const fromEmail = (process.env.BREVO_FROM_EMAIL ?? 'noreply@bmastudio.maxxciey.me').trim()
  const fromName = (process.env.BREVO_FROM_NAME ?? 'BMA Studios').trim()
  const notifyEmail = (process.env.NOTIFICATION_EMAIL ?? 'maxxymaxxy04@gmail.com').trim()

  if (!apiKey) {
    console.log('BREVO_API_KEY not set — skipping email')
    return { ok: false, error: 'email_disabled' }
  }

  // Sanity-check the key format (Brevo keys start with "xkeysib-")
  if (!apiKey.startsWith('xkeysib-')) {
    console.error('BREVO_API_KEY looks malformed — should start with "xkeysib-". Got:', apiKey.slice(0, 12) + '...')
    return { ok: false, error: 'malformed_api_key' }
  }

  try {
    const res = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sender: { name: fromName, email: fromEmail },
        to: [{ name: toName ?? 'BMA Studios', email: toEmail ?? notifyEmail }],
        replyTo: replyTo ? { email: replyTo } : undefined,
        subject,
        htmlContent: html,
      }),
    })

    if (!res.ok) {
      const err = await res.json()
      console.error('Brevo error:', err)
      return { ok: false, error: JSON.stringify(err) }
    }

    return { ok: true }
  } catch (err) {
    console.error('Brevo email error:', err)
    return { ok: false, error: String(err) }
  }
}

// Pre-built email templates
export function orderConfirmedEmail(order: {
  orderId: string
  productName: string
  amount: number
  phone: string
  mpesaReceipt: string
}) {
  return {
    subject: `💰 New Order Paid — ${order.orderId}`,
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px">
        <h2 style="color:#000;margin-bottom:4px">New Order Received ✅</h2>
        <p style="color:#666;font-size:14px">A customer has just completed an M-Pesa payment on BMA Studios.</p>
        <div style="background:#f9f9f9;border-radius:12px;padding:20px;margin:20px 0">
          <table style="width:100%;font-size:14px">
            <tr><td style="color:#888;padding:4px 0">Product</td><td style="font-weight:600">${order.productName}</td></tr>
            <tr><td style="color:#888;padding:4px 0">Amount</td><td style="font-weight:600">KSH ${order.amount.toLocaleString()}</td></tr>
            <tr><td style="color:#888;padding:4px 0">Customer Phone</td><td style="font-weight:600">${order.phone}</td></tr>
            <tr><td style="color:#888;padding:4px 0">M-Pesa Receipt</td><td style="font-family:monospace">${order.mpesaReceipt}</td></tr>
            <tr><td style="color:#888;padding:4px 0">Order ID</td><td style="font-family:monospace">${order.orderId}</td></tr>
          </table>
        </div>
        <p style="color:#666;font-size:13px">Contact the customer on <strong>${order.phone}</strong> via phone or WhatsApp to arrange delivery/pickup.</p>
        <a href="https://bmastudio.maxxciey.me/admin" style="display:inline-block;margin-top:16px;padding:10px 20px;background:#000;color:#fff;border-radius:8px;text-decoration:none;font-size:14px">View Dashboard →</a>
      </div>
    `,
  }
}

export function contactEmail(data: { name: string; email: string; phone?: string; service: string; message: string }) {
  return {
    subject: `New Contact: ${data.name} — ${data.service}`,
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px">
        <h2 style="color:#000">New Contact Message 📬</h2>
        <div style="background:#f9f9f9;border-radius:12px;padding:20px;margin:20px 0;font-size:14px">
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          ${data.phone ? `<p><strong>Phone:</strong> ${data.phone}</p>` : ''}
          <p><strong>Service:</strong> ${data.service}</p>
          <p><strong>Message:</strong><br>${data.message}</p>
        </div>
      </div>
    `,
  }
}

// Sent to BMA Studios (admin notification)
export function bookingEmail(data: { name: string; email: string; phone: string; service: string; date?: string; time?: string; location?: string; notes?: string }) {
  return {
    subject: `New Booking: ${data.name} — ${data.service}`,
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px">
        <h2 style="color:#000">New Booking Request 📅</h2>
        <div style="background:#f9f9f9;border-radius:12px;padding:20px;margin:20px 0;font-size:14px">
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Phone:</strong> ${data.phone}</p>
          <p><strong>Service:</strong> ${data.service}</p>
          ${data.date ? `<p><strong>Date:</strong> ${data.date}</p>` : ''}
          ${data.time ? `<p><strong>Time:</strong> ${data.time}</p>` : ''}
          ${data.location ? `<p><strong>Location:</strong> ${data.location}</p>` : ''}
          ${data.notes ? `<p><strong>Notes:</strong> ${data.notes}</p>` : ''}
        </div>
      </div>
    `,
  }
}

// Sent to the CLIENT as a confirmation receipt
export function bookingConfirmationEmail(data: { name: string; service: string; date?: string; time?: string; location?: string; notes?: string }) {
  return {
    subject: `Booking Received — BMA Studios`,
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px">
        <h2 style="color:#000">We've got your booking! 📸</h2>
        <p style="color:#555;font-size:14px">Hi ${data.name}, thank you for reaching out to BMA Studios. We've received your booking request and will confirm your appointment shortly via phone or WhatsApp.</p>
        <div style="background:#f9f9f9;border-radius:12px;padding:20px;margin:20px 0;font-size:14px">
          <p><strong>Service:</strong> ${data.service}</p>
          ${data.date ? `<p><strong>Preferred Date:</strong> ${data.date}</p>` : ''}
          ${data.time ? `<p><strong>Preferred Time:</strong> ${data.time}</p>` : ''}
          ${data.location ? `<p><strong>Location:</strong> ${data.location}</p>` : ''}
          ${data.notes ? `<p><strong>Notes:</strong> ${data.notes}</p>` : ''}
        </div>
        <p style="color:#555;font-size:13px">Questions? Reach us on WhatsApp or call <strong>+254 725 297393</strong>.</p>
        <p style="color:#888;font-size:12px;margin-top:24px">BMA Studios · Mahiga Building, Nyeri Town</p>
      </div>
    `,
  }
}
