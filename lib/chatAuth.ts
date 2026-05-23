import { randomBytes } from 'crypto'
import { supabase } from './supabase'

/** Generate a cryptographically secure hex token */
export function generateToken(bytes = 32): string {
  return randomBytes(bytes).toString('hex')
}

/**
 * Validate that an Authorization: Bearer <token> header
 * matches the session's user_token in the DB.
 * Returns the session row on success, null on failure.
 */
export async function validateUserToken(
  sessionId: string,
  authHeader: string | null
): Promise<Record<string, unknown> | null> {
  if (!authHeader?.startsWith('Bearer ')) return null
  const token = authHeader.slice(7)
  if (!token) return null

  const { data, error } = await supabase
    .from('chat_sessions')
    .select('*')
    .eq('id', sessionId)
    .eq('user_token', token)
    .single()

  if (error || !data) return null

  return data
}

/**
 * Validate admin via cookie value vs ADMIN_SECRET env var.
 * Pass the raw cookie value from request.cookies.get('admin_auth')?.value
 */
export function validateAdminCookie(cookieValue: string | undefined): boolean {
  const secret = process.env.ADMIN_SECRET
  if (!secret || !cookieValue) return false
  return cookieValue === secret
}
