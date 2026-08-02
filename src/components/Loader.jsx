import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const BOOT_LINES = [
  '> mounting core modules',
  '> linking neural bus',
  '> calibrating innovation matrix',
  '> igniting quest protocol',
]

export default function Loader({ onDone }) {
  const [pct, setPct] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const duration = reduce ? 300 : 2200
    const start = performance.now()
    let raf

    const tick = (now) => {
      const p = Math.min(1, (now - start) / duration)
      // ease-out so it decelerates into 100
      const eased = 1 - Math.pow(1 - p, 3)
      setPct(Math.round(eased * 100))
      if (p < 1) {
        raf = requestAnimationFrame(tick)
      } else {
        setTimeout(() => setDone(true), 350)
        setTimeout(() => onDone?.(), 900)
      }
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [onDone])

  const lineIndex = Math.min(BOOT_LINES.length - 1, Math.floor((pct / 100) * BOOT_LINES.length))

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-void"
        >
          <div className="w-[min(560px,82vw)]">
            <div className="mb-6 flex items-baseline justify-between font-mono text-xs uppercase tracking-[0.3em] text-muted">
              <span className="text-neon/80">Innovators Quest</span>
              <span>{String(pct).padStart(3, '0')}%</span>
            </div>

            {/* progress rail */}
            <div className="h-px w-full bg-white/10">
              <motion.div
                className="h-full bg-gradient-to-r from-pink to-neon"
                style={{ width: `${pct}%` }}
              />
            </div>

            <div className="mt-6 h-5 font-mono text-[11px] tracking-wide text-muted">
              <motion.span key={lineIndex} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {BOOT_LINES[lineIndex]}
                <span className="ml-1 inline-block h-3 w-2 animate-pulse bg-neon align-middle" />
              </motion.span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
