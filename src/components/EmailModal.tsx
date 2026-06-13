import { useEffect, useState, type FormEvent } from 'react'

interface EmailModalProps {
  open: boolean
  onClose: () => void
}

type Status = 'idle' | 'sending' | 'sent' | 'error'

// Same-origin default works with `vercel dev`; the GitHub Pages build sets an
// absolute URL via VITE_CONTACT_ENDPOINT (see .env.example).
const ENDPOINT = import.meta.env.VITE_CONTACT_ENDPOINT || '/api/contact'

/**
 * Cockpit-themed contact popup. Posts the message to the Vercel contact
 * function, which relays it by email (Gmail SMTP). Shows live transmit state.
 */
export function EmailModal({ open, onClose }: EmailModalProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [company, setCompany] = useState('') // honeypot — must stay empty
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState('')

  // Close on Escape while open.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  // Reset transient state each time the popup opens.
  useEffect(() => {
    if (open) {
      setStatus('idle')
      setError('')
    }
  }, [open])

  if (!open) return null

  const send = async (e: FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    setError('')
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message, company }),
      })
      const data = (await res.json().catch(() => null)) as
        | { ok?: boolean; error?: string }
        | null
      if (!res.ok || !data?.ok) {
        throw new Error(data?.error || 'Transmission failed.')
      }
      setStatus('sent')
      setName('')
      setEmail('')
      setMessage('')
      // Let the success message land, then close.
      setTimeout(onClose, 1600)
    } catch (err) {
      setStatus('error')
      setError(err instanceof Error ? err.message : 'Transmission failed.')
    }
  }

  const sending = status === 'sending'

  return (
    // mousedown on the backdrop closes; stopPropagation on the panel keeps it open.
    <div className="modal-overlay" onMouseDown={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label="Send me a message"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="modal-head">
          <span className="ml modal-title">TRANSMIT MESSAGE</span>
          <button
            className="modal-close"
            type="button"
            aria-label="Close"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        {status === 'sent' ? (
          <p className="modal-status modal-status-ok" role="status">
            ▸ Message transmitted. Thanks — I'll be in touch.
          </p>
        ) : (
          <form className="modal-form" onSubmit={send}>
            <label className="modal-field">
              <span className="ml modal-label">NAME</span>
              <input
                className="modal-input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoFocus
                disabled={sending}
              />
            </label>
            <label className="modal-field">
              <span className="ml modal-label">YOUR EMAIL</span>
              <input
                className="modal-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={sending}
              />
            </label>
            <label className="modal-field">
              <span className="ml modal-label">MESSAGE</span>
              <textarea
                className="modal-input modal-textarea"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                required
                disabled={sending}
              />
            </label>

            {/* Honeypot: hidden from users, catches bots. */}
            <input
              className="modal-hp"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />

            {status === 'error' && (
              <p className="modal-status modal-status-err" role="alert">
                ✕ {error}
              </p>
            )}

            <button className="modal-send" type="submit" disabled={sending}>
              {sending ? 'TRANSMITTING…' : 'SEND ▸'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
