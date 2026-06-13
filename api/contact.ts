import type { VercelRequest, VercelResponse } from '@vercel/node'
import nodemailer from 'nodemailer'

/**
 * Contact-form backend for zatwik.com.
 *
 * Receives { name, email, message } from the cockpit email popup and relays it
 * to CONTACT_TO via Gmail SMTP (Nodemailer). Deployed as a Vercel Function; the
 * GitHub Pages frontend POSTs to it cross-origin (see the CORS allowlist).
 *
 * Required environment variables (set in the Vercel project):
 *   GMAIL_USER          the Gmail address that sends (e.g. sa7wik@gmail.com)
 *   GMAIL_APP_PASSWORD  a Google "App Password" (needs 2FA on the account)
 *   CONTACT_TO          optional; where mail is delivered (defaults to GMAIL_USER)
 */

const ALLOWED_ORIGINS = [
  'https://zatwik511.github.io',
  'https://zatwik.com',
  'https://www.zatwik.com',
  'http://localhost:5173',
]

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function applyCors(req: VercelRequest, res: VercelResponse) {
  const origin = req.headers.origin
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin)
  }
  res.setHeader('Vary', 'Origin')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  applyCors(req, res)

  if (req.method === 'OPTIONS') {
    res.status(204).end()
    return
  }
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'Method not allowed' })
    return
  }

  const { name, email, message, company } = (req.body ?? {}) as Record<
    string,
    unknown
  >

  // Honeypot: real users never fill a hidden "company" field. Pretend success.
  if (typeof company === 'string' && company.trim() !== '') {
    res.status(200).json({ ok: true })
    return
  }

  const name_ = typeof name === 'string' ? name.trim() : ''
  const email_ = typeof email === 'string' ? email.trim() : ''
  const message_ = typeof message === 'string' ? message.trim() : ''

  if (!name_ || !email_ || !message_) {
    res.status(400).json({ ok: false, error: 'Name, email and message are required.' })
    return
  }
  if (!EMAIL_RE.test(email_) || email_.length > 200) {
    res.status(400).json({ ok: false, error: 'Please enter a valid email address.' })
    return
  }
  if (name_.length > 120 || message_.length > 5000) {
    res.status(400).json({ ok: false, error: 'Message is too long.' })
    return
  }

  const user = process.env.GMAIL_USER
  const pass = process.env.GMAIL_APP_PASSWORD
  if (!user || !pass) {
    res.status(500).json({ ok: false, error: 'Mailer is not configured.' })
    return
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
  })

  try {
    await transporter.sendMail({
      from: `"zatwik.com" <${user}>`,
      to: process.env.CONTACT_TO || user,
      replyTo: `"${name_}" <${email_}>`,
      subject: `New message from ${name_} via zatwik.com`,
      text: `${message_}\n\n— ${name_} (${email_})`,
    })
    res.status(200).json({ ok: true })
  } catch (err) {
    console.error('contact: sendMail failed', err)
    res.status(502).json({ ok: false, error: 'Could not send right now. Try again later.' })
  }
}
