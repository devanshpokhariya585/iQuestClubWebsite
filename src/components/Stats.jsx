import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { impact } from '../data/content'

const ease = [0.16, 1, 0.3, 1]

function CountUp({ value, suffix = '', active }) {
  const [n, setN] = useState(0)

  useEffect(() => {
    if (!active) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return setN(value)
    let raf
    const start = performance.now()
    const dur = 1400
    const tick = (now) => {
      const p = Math.min(1, (now - start) / dur)
      const eased = 1 - Math.pow(1 - p, 3)
      setN(Math.round(eased * value))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [active, value])

  return (
    <span>
      {n}
      {suffix}
    </span>
  )
}

export default function Stats() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} className="relative z-10 mx-auto max-w-7xl px-6 py-24">
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease }}
        className="eyebrow mb-10 text-center"
      >
        {impact.eyebrow} — {impact.heading}
      </motion.p>

      <div className="grid grid-cols-2 gap-y-10 border-y border-line/70 py-12 md:grid-cols-5">
        {impact.stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.08, ease }}
            className="text-center"
          >
            <div className="font-display text-4xl font-bold text-pink text-glow-pink md:text-5xl">
              <CountUp value={s.value} suffix={s.suffix} active={inView} />
            </div>
            <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
              {s.label}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
