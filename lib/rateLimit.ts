// Simple in-memory rate limiter
// Vercel is stateless so this resets per instance — good enough for brute force protection
const attempts = new Map<string, { count: number; resetAt: number }>()

export function rateLimit(ip: string, maxAttempts = 5, windowMs = 15 * 60 * 1000): boolean {
  const now = Date.now()
  const record = attempts.get(ip)

  if (!record || now > record.resetAt) {
    attempts.set(ip, { count: 1, resetAt: now + windowMs })
    return true // allowed
  }

  if (record.count >= maxAttempts) {
    return false // blocked
  }

  record.count++
  return true // allowed
}

export function resetLimit(ip: string) {
  attempts.delete(ip)
}
