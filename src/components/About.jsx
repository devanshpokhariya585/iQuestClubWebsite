import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ChipCanvas from '../three/ChipCanvas'
import { about } from '../data/content'

const ease = [0.16, 1, 0.3, 1]

export default function About() {
  const [open, setOpen] = useState(false)

  return (
    <section id="about" className="relative z-10 mx-auto max-w-7xl px-6 py-28 md:py-36">
      <div className="grid items-center gap-10 md:grid-cols-2">
        {/* left — narrative */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease }}
        >
          <p className="eyebrow">{about.eyebrow}</p>
          <h2 className="mt-5 font-display text-5xl font-bold leading-[0.95] tracking-tight text-white md:text-6xl">
            {about.heading}
          </h2>
          <p className="mt-6 max-w-md text-base leading-relaxed text-muted">{about.lead}</p>

          {/* revealed core content */}
          <div className="mt-8 min-h-[190px]">
            <AnimatePresence mode="wait">
              {open ? (
                <motion.div
                  key="core"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5, ease }}
                >
                  <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-neon">
                    {about.core.heading}
                  </p>
                  <p className="mt-3 max-w-md text-sm leading-relaxed text-ink">
                    {about.core.text}
                  </p>
                  <div className="mt-6 grid grid-cols-4 gap-3">
                    {about.core.stats.map((s, i) => (
                      <motion.div
                        key={s.label}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 + i * 0.08 }}
                      >
                        <div className="font-display text-2xl font-bold text-white text-glow-white">
                          {s.value}
                        </div>
                        <div className="mt-1 font-mono text-[9px] uppercase tracking-widest text-muted">
                          {s.label}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.p
                  key="prompt"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.3em] text-white"
                >
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
                  {about.prompt}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* right — interactive 3D processor */}
        <div className="relative h-[56vh] min-h-[420px] w-full">
          <ChipCanvas interactive open={open} onToggle={() => setOpen((v) => !v)} dust={false} />

          <p className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.35em] text-muted">
            {open ? 'core online · tap to seal' : 'tap the processor'}
          </p>
        </div>
      </div>
    </section>
  )
}
