import { NextRequest, NextResponse } from 'next/server'
import { rateLimit, resetLimit } from '@/lib/rateLimit'

export async function POST(request: NextRequest) {
  const adminPassword = process.env.ADMIN_PASSWORD
  const adminSecret = process.env.ADMIN_SECRET

  if (!adminPassword || !adminSecret) {
    console.error('ADMIN_PASSWORD or ADMIN_SECRET env vars not set!')
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
  }

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown'
  const allowed = rateLimit(ip, 5, 15 * 60 * 1000)

  if (!allowed) {
    return NextResponse.json(
      { error: 'Too many attempts. Try again in 15 minutes.' },
      { status: 429 }
    )
  }

  const { password } = await request.json()

  if (password !== adminPassword) {
    return NextResponse.json({ error: 'Wrong password' }, { status: 401 })
  }

  resetLimit(ip)

  const response = NextResponse.json({ success: true })
  response.cookies.set('admin_auth', adminSecret, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24,
    path: '/',
  })
  return response
}

export async function DELETE() {
  const response = NextResponse.json({ success: true })
  response.cookies.delete('admin_auth')
  return response
}
