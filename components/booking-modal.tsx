'use client'

import { useState } from 'react'
import { X, Calendar, Loader2, CheckCircle } from 'lucide-react'

interface BookingModalProps {
  service?: string
  onClose: () => void
}

const SERVICES = ['Wedding Photography', 'Portraits', 'Events', 'Studio Sessions', 'Graphic Design', 'Camera Sales']
const TIMES = ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM']

export function BookingModal({ service, onClose }: BookingModalProps) {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', service: service ?? '',
    date: '', time: '', location: '', notes: '',
  })
  const [step, setStep] = useState<'form' | 'success'>('form')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (res.ok) {
        setStep('success')
      } else {
        setError(data.error || 'Failed to submit. Please try again.')
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-2xl overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto"
        style={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.08)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 px-5 py-4 flex items-center justify-between"
          style={{ background: '#0a0a0a', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.2)' }}>
              <Calendar className="h-4 w-4 text-amber-400" />
            </div>
            <div>
              <p className="text-[10px] text-white/40 uppercase tracking-widest">BMA Studios</p>
              <p className="text-sm font-semibold text-white">Book a Session</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full text-white/40 hover:text-white/80 transition-colors"
            style={{ background: 'rgba(255,255,255,0.06)' }}>
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-5">
          {step === 'success' ? (
            <div className="text-center py-6 space-y-4">
              <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.15)' }}>
                <CheckCircle className="h-8 w-8 text-green-400" />
              </div>
              <div>
                <p className="text-white font-bold text-base">Booking Request Sent! 🎉</p>
                <p className="text-white/50 text-sm mt-2 leading-relaxed">
                  BMA Studios will contact you shortly via phone or WhatsApp to confirm your session.
                </p>
              </div>
              <button onClick={onClose}
                className="w-full py-2.5 text-white/50 hover:text-white/80 text-sm rounded-xl transition-all"
                style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name + Phone */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Full Name', key: 'name', placeholder: 'Your name', required: true },
                  { label: 'Phone', key: 'phone', placeholder: '0712 345 678', required: true },
                ].map(f => (
                  <div key={f.key}>
                    <label className="block text-[10px] text-white/40 mb-1 uppercase tracking-wider">{f.label}</label>
                    <input
                      value={form[f.key as keyof typeof form]}
                      onChange={e => set(f.key, e.target.value)}
                      placeholder={f.placeholder}
                      required={f.required}
                      className="w-full px-3 py-2.5 rounded-xl text-white text-xs placeholder-white/20 outline-none transition-all"
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                      onFocus={e => { e.currentTarget.style.borderColor = 'rgba(251,191,36,0.4)' }}
                      onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}
                    />
                  </div>
                ))}
              </div>

              {/* Email */}
              <div>
                <label className="block text-[10px] text-white/40 mb-1 uppercase tracking-wider">Email</label>
                <input
                  type="email" value={form.email}
                  onChange={e => set('email', e.target.value)}
                  placeholder="your@email.com" required
                  className="w-full px-3 py-2.5 rounded-xl text-white text-xs placeholder-white/20 outline-none transition-all"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                  onFocus={e => { e.currentTarget.style.borderColor = 'rgba(251,191,36,0.4)' }}
                  onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}
                />
              </div>

              {/* Service */}
              <div>
                <label className="block text-[10px] text-white/40 mb-1 uppercase tracking-wider">Service</label>
                <select value={form.service} onChange={e => set('service', e.target.value)} required
                  className="w-full px-3 py-2.5 rounded-xl text-white text-xs outline-none transition-all bg-transparent"
                  style={{ background: '#111', border: '1px solid rgba(255,255,255,0.1)' }}
                  onFocus={e => { e.currentTarget.style.borderColor = 'rgba(251,191,36,0.4)' }}
                  onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}
                >
                  <option value="">Select a service...</option>
                  {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              {/* Date + Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] text-white/40 mb-1 uppercase tracking-wider">Preferred Date</label>
                  <input type="date" value={form.date} onChange={e => set('date', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2.5 rounded-xl text-white text-xs outline-none transition-all"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', colorScheme: 'dark' }}
                    onFocus={e => { e.currentTarget.style.borderColor = 'rgba(251,191,36,0.4)' }}
                    onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-white/40 mb-1 uppercase tracking-wider">Preferred Time</label>
                  <select value={form.time} onChange={e => set('time', e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl text-white text-xs outline-none transition-all bg-transparent"
                    style={{ background: '#111', border: '1px solid rgba(255,255,255,0.1)' }}
                    onFocus={e => { e.currentTarget.style.borderColor = 'rgba(251,191,36,0.4)' }}
                    onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}
                  >
                    <option value="">Any time</option>
                    {TIMES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-[10px] text-white/40 mb-1 uppercase tracking-wider">Location / Venue</label>
                <input value={form.location} onChange={e => set('location', e.target.value)}
                  placeholder="e.g. BMA Studio, Nyeri Town or outdoor location"
                  className="w-full px-3 py-2.5 rounded-xl text-white text-xs placeholder-white/20 outline-none transition-all"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                  onFocus={e => { e.currentTarget.style.borderColor = 'rgba(251,191,36,0.4)' }}
                  onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-[10px] text-white/40 mb-1 uppercase tracking-wider">Additional Notes</label>
                <textarea value={form.notes} onChange={e => set('notes', e.target.value)}
                  placeholder="Any special requests or details..."
                  rows={3}
                  className="w-full px-3 py-2.5 rounded-xl text-white text-xs placeholder-white/20 outline-none transition-all resize-none"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                  onFocus={e => { e.currentTarget.style.borderColor = 'rgba(251,191,36,0.4)' }}
                  onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}
                />
              </div>

              {error && <p className="text-xs text-red-400 text-center">{error}</p>}

              <button type="submit" disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm text-black bg-amber-400 hover:bg-amber-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                {loading ? <><Loader2 className="h-4 w-4 animate-spin" />Sending...</> : 'Book Session'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
