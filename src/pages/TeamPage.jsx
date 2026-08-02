import { useEffect, useRef, useState } from 'react'
import {
  motion,
  useScroll,
  useTransform,
  useMotionTemplate,
  useMotionValueEvent,
  useReducedMotion,
} from 'framer-motion'
import { team } from '../data/content'

// iridescent "art" fill per card, hue shifts by index (pink -> violet -> teal)
function fill(i) {
  const h = 320 - i * 55
  return (
    `radial-gradient(120% 90% at 22% 18%, hsla(${h},90%,62%,0.55), transparent 60%),` +
    `radial-gradient(120% 90% at 82% 30%, hsla(${h + 45},90%,58%,0.5), transparent 60%),` +
    `radial-gradient(120% 120% at 55% 105%, hsla(${h + 95},85%,55%,0.5), transparent 62%),` +
    `linear-gradient(180deg,#140a18,#0b0610)`
  )
}

function CardFace({ m, i, active }) {
  return (
    <div
      className={`relative h-full w-full overflow-hidden rounded-[26px] border transition-all duration-500 ${
        active ? 'border-pink shadow-[0_0_70px_rgba(255,45,149,0.45)]' : 'border-white/15'
      }`}
      style={{ background: fill(i), opacity: active ? 1 : 0.62 }}
    >
      <div className="scanlines absolute inset-0" />
      <span className="absolute right-5 top-4 font-mono text-[11px] tracking-widest text-white/80">
        {String(i + 1).padStart(2, '0')} / {String(team.members.length).padStart(2, '0')}
      </span>
      <span className="absolute left-6 top-5 font-mono text-[10px] uppercase tracking-[0.3em] text-white/85">
        IQ · BOARD
      </span>
      {m.img ? (
        <img
          src={m.img}
          alt={m.name}
          className="absolute inset-0 h-full w-full object-cover mix-blend-luminosity opacity-70"
        />
      ) : (
        <span className="pointer-events-none absolute inset-0 grid place-items-center font-display text-[7rem] font-extrabold text-white/10">
          {m.initials}
        </span>
      )}
      <div className="absolute inset-x-0 bottom-0 p-6">
        <h3 className="font-display text-3xl font-extrabold leading-none text-white drop-shadow-[0_2px_20px_rgba(0,0,0,0.6)] md:text-4xl">
          {m.name}
        </h3>
        <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.3em] text-white/90">
          {m.role}
        </p>
      </div>
    </div>
  )
}

function GridFallback() {
  return (
    <div className="mx-auto grid max-w-5xl gap-5 px-6 pb-20 pt-36 sm:grid-cols-2">
      {team.members.map((m, i) => (
        <div key={m.name} className="aspect-[3/2]">
          <CardFace m={m} i={i} active />
        </div>
      ))}
    </div>
  )
}

export default function TeamPage() {
  const reduce = useReducedMotion()
  const ref = useRef(null)
  const [active, setActive] = useState(0)
  const [dims, setDims] = useState({ w: 440, h: 300, radius: 540 })

  const N = team.members.length
  const step = 360 / N

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const rotate = useTransform(scrollYProgress, [0, 1], [0, -(N - 1) * step])
  const transform = useMotionTemplate`rotateX(-7deg) rotateY(${rotate}deg)`

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const idx = Math.min(N - 1, Math.max(0, Math.round(v * (N - 1))))
    setActive((prev) => (prev === idx ? prev : idx))
  })

  useEffect(() => {
    const calc = () => {
      const vw = window.innerWidth
      const w = Math.max(240, Math.min(460, vw * 0.7))
      const radius = Math.max(320, Math.min(580, vw * 0.44))
      setDims({ w, h: Math.round(w * 0.66), radius })
    }
    calc()
    window.addEventListener('resize', calc)
    return () => window.removeEventListener('resize', calc)
  }, [])

  if (reduce) return <GridFallback />

  const member = team.members[active]

  return (
    <section ref={ref} className="relative z-10" style={{ height: `${N * 95}vh` }}>
      <div className="sticky top-0 flex h-[100svh] items-center justify-center overflow-hidden">
        {/* info panel */}
        <div className="pointer-events-none absolute left-6 top-1/2 z-20 max-w-xs -translate-y-1/2 md:left-12">
          <p className="eyebrow">{team.eyebrow}</p>
          <h1 className="mt-4 font-display text-4xl font-extrabold leading-[0.95] tracking-tight text-white md:text-6xl">
            THE <span className="text-pink text-glow-pink">MINDS</span>
          </h1>

          <div className="mt-8 h-24">
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <p className="font-display text-2xl font-bold text-white">{member.name}</p>
              <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.3em] text-neon">
                {member.role}
              </p>
            </motion.div>
          </div>

          <div className="mt-4 flex gap-2">
            {team.members.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === active ? 'w-6 bg-pink' : 'w-1.5 bg-white/25'
                }`}
              />
            ))}
          </div>

          <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.3em] text-muted">
            scroll to rotate ↓
          </p>
        </div>

        {/* 3D cylinder */}
        <div className="absolute inset-0" style={{ perspective: '1500px' }}>
          <motion.div
            className="absolute left-1/2 top-1/2"
            style={{ transform, transformStyle: 'preserve-3d' }}
          >
            {team.members.map((m, i) => (
              <div
                key={m.name}
                className="absolute"
                style={{
                  width: dims.w,
                  height: dims.h,
                  marginLeft: -dims.w / 2,
                  marginTop: -dims.h / 2,
                  transform: `rotateY(${i * step}deg) translateZ(${dims.radius}px)`,
                  backfaceVisibility: 'hidden',
                }}
              >
                <CardFace m={m} i={i} active={i === active} />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
