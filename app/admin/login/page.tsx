'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Lock, Loader2 } from 'lucide-react'

function AdminLoginForm() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })

    if (res.ok) {
      const redirect = searchParams.get('redirect')
      router.push(redirect && redirect.startsWith('/admin') ? redirect : '/admin')
    } else {
      setError('Incorrect password')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div
        className="w-full max-w-sm rounded-2xl p-8"
        style={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.08)' }}
      >
        <div className="flex flex-col items-center mb-8">
          <div
            className="h-12 w-12 rounded-full flex items-center justify-center mb-4"
            style={{ background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.2)' }}
          >
            <Lock className="h-5 w-5 text-amber-400" />
          </div>
          <h1 className="text-white font-bold text-xl">BMA Studios Admin</h1>
          <p className="text-white/40 text-sm mt-1">Orders dashboard</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError('') }}
              placeholder="Enter password"
              className="w-full rounded-xl px-4 py-3 text-white text-sm placeholder-white/25 outline-none"
              style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${error ? 'rgba(248,113,113,0.5)' : 'rgba(255,255,255,0.1)'}` }}
              autoFocus
            />
            {error && <p className="text-red-400 text-xs mt-1.5">{error}</p>}
          </div>

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full py-3 rounded-xl font-semibold text-sm text-black bg-amber-400 hover:bg-amber-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            {loading ? <><Loader2 className="h-4 w-4 animate-spin" />Signing in...</> : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default function AdminLogin() {
  return (
    <Suspense>
      <AdminLoginForm />
    </Suspense>
  )
}
