import { useEffect } from 'react'
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion'

const ease = [0.16, 1, 0.3, 1]

/*
  Active-Theory-style floating item.
  - reveals once on scroll (outer)
  - drifts toward the cursor with easing, amount set by `depth` (middle = parallax)
  - idly bobs up and down forever (inner)
  Disabled gracefully when the user prefers reduced motion.
*/
export default function Floaty({ index = 0, depth = 16, className = '', children }) {
  const reduce = useReducedMotion()
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const x = useSpring(rawX, { stiffness: 50, damping: 16, mass: 0.6 })
  const y = useSpring(rawY, { stiffness: 50, damping: 16, mass: 0.6 })

  useEffect(() => {
    if (reduce) return
    const onMove = (e) => {
      const cx = window.innerWidth / 2
      const cy = window.innerHeight / 2
      rawX.set(((e.clientX - cx) / cx) * depth)
      rawY.set(((e.clientY - cy) / cy) * depth)
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [depth, reduce, rawX, rawY])

  return (
    <motion.div
      initial={{ opacity: 0, y: 34 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay: index * 0.07, ease }}
      className={className}
    >
      <motion.div style={reduce ? undefined : { x, y }}>
        <motion.div
          animate={reduce ? undefined : { y: [0, -9, 0] }}
          transition={{
            repeat: Infinity,
            duration: 4.5 + (index % 3),
            ease: 'easeInOut',
            delay: index * 0.25,
          }}
        >
          {children}
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
