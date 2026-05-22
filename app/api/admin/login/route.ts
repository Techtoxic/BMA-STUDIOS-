import { NextRequest, NextResponse } from 'next/server'
import { rateLimit, resetLimit } from '@/lib/rateLimit'

export async function POST(request: NextRequest) {
  // Rate limit — 5 attempts per IP per 15 minutes
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown'
  const allowed = rateLimit(ip, 5, 15 * 60 * 1000)

  if (!allowed) {
    return NextResponse.json(
      { error: 'Too many attempts. Try again in 15 minutes.' },
      { status: 429 }
    )
  }

  const { password } = await request.json()
  const adminPassword = process.env.ADMIN_PASSWORD ?? 'bma2024'

  if (password !== adminPassword) {
    return NextResponse.json({ error: 'Wrong password' }, { status: 401 })
  }

  // Success — clear their failed attempts
  resetLimit(ip)

  const response = NextResponse.json({ success: true })
  response.cookies.set('admin_auth', process.env.ADMIN_SECRET ?? 'bma_secret_token', {
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
