import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Check } from 'lucide-react'

const ease = [0.16, 1, 0.3, 1]

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // idle | success | error

  const handleSubmit = (e) => {
    e.preventDefault()
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    if (!ok) return setStatus('error')
    // TODO: POST { email } to your Express endpoint, e.g. /api/subscribe
    setStatus('success')
    setEmail('')
  }

  return (
    <section id="newsletter" className="relative z-10 mx-auto max-w-4xl px-6 py-28 text-center md:py-36">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8, ease }}
      >
        <p className="eyebrow">03 · STAY IN THE LOOP</p>
        <h2 className="mx-auto mt-5 max-w-2xl font-display text-4xl font-bold leading-[1] tracking-tight text-white md:text-6xl">
          Join the <span className="text-white text-glow-white">signal.</span>
        </h2>
        <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-muted">
          Event drops, hackathon calls and open-source missions — straight to your inbox.
          No spam, unsubscribe anytime.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-10 flex max-w-md items-center gap-2 border-b border-white/20 pb-2 focus-within:border-neon"
        >
          <span className="font-mono text-sm text-neon">&gt;</span>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              if (status !== 'idle') setStatus('idle')
            }}
            placeholder="you@domain.dev"
            aria-label="Email address"
            className="w-full bg-transparent py-2 font-mono text-sm text-ink placeholder:text-muted/50 focus:outline-none"
           
          />
          <button
            type="submit"
            aria-label="Subscribe"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/50 text-white transition-colors hover:bg-white/15"
           
          >
            {status === 'success' ? <Check size={16} /> : <ArrowRight size={16} />}
          </button>
        </form>

        <div className="mt-4 h-5 font-mono text-xs">
          {status === 'error' && <p className="text-white">// enter a valid email</p>}
          {status === 'success' && <p className="text-neon">// you’re on the list. welcome aboard.</p>}
        </div>
      </motion.div>
    </section>
  )
}
