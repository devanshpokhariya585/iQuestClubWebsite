import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, MapPin, Clock } from 'lucide-react'
import { upcomingEvents } from '../data/content'

const ease = [0.16, 1, 0.3, 1]
const WEEKDAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

// group events by YYYY-MM-DD
function useEventMap() {
  return useMemo(() => {
    const m = {}
    for (const ev of upcomingEvents) (m[ev.date] ||= []).push(ev)
    return m
  }, [])
}

export default function Calendar() {
  const eventMap = useEventMap()
  const first = upcomingEvents[0]?.date || '2026-08-01'
  const [y, setY] = useState(Number(first.slice(0, 4)))
  const [m, setM] = useState(Number(first.slice(5, 7)) - 1) // 0-indexed
  const [selected, setSelected] = useState(null)

  // Monday-first grid math
  const firstDow = (new Date(y, m, 1).getDay() + 6) % 7
  const daysInMonth = new Date(y, m + 1, 0).getDate()
  const cells = []
  for (let i = 0; i < firstDow; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  const pad = (n) => String(n).padStart(2, '0')
  const key = (d) => `${y}-${pad(m + 1)}-${pad(d)}`

  const move = (dir) => {
    setSelected(null)
    let nm = m + dir
    let ny = y
    if (nm < 0) { nm = 11; ny-- }
    if (nm > 11) { nm = 0; ny++ }
    setM(nm)
    setY(ny)
  }

  const agenda = selected
    ? eventMap[selected] || []
    : upcomingEvents.filter((e) => e.date.startsWith(`${y}-${pad(m + 1)}`))

  return (
    <section className="relative z-10 mx-auto max-w-7xl px-6 pb-28 pt-36">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease }}
        className="mb-12"
      >
        <p className="eyebrow">SCHEDULE · UPCOMING</p>
        <h1 className="mt-4 font-display text-5xl font-extrabold leading-[0.95] tracking-tight text-white md:text-7xl">
          EVENT <span className="text-pink text-glow-pink">CALENDAR</span>
        </h1>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        {/* calendar */}
        <div className="neo-panel p-6 md:p-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold text-white">
              {MONTHS[m]} <span className="text-muted">{y}</span>
            </h2>
            <div className="flex gap-2">
              <button onClick={() => move(-1)} aria-label="Previous month" className="grid h-9 w-9 place-items-center rounded-full border border-white/15 text-ink hover:border-pink/60 hover:text-neon">
                <ChevronLeft size={16} />
              </button>
              <button onClick={() => move(1)} aria-label="Next month" className="grid h-9 w-9 place-items-center rounded-full border border-white/15 text-ink hover:border-pink/60 hover:text-neon">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1.5">
            {WEEKDAYS.map((w) => (
              <div key={w} className="pb-2 text-center font-mono text-[10px] uppercase tracking-widest text-muted">
                {w}
              </div>
            ))}
            {cells.map((d, i) => {
              if (!d) return <div key={`e${i}`} />
              const k = key(d)
              const has = eventMap[k]
              const isSel = selected === k
              return (
                <button
                  key={k}
                  onClick={() => has && setSelected(isSel ? null : k)}
                  className={`relative aspect-square rounded-lg border text-sm transition-all ${
                    isSel
                      ? 'border-pink bg-pink/20 text-white'
                      : has
                      ? 'border-pink/40 bg-pink/[0.06] text-white hover:bg-pink/15'
                      : 'border-white/8 text-muted'
                  }`}
                >
                  <span className="absolute left-1.5 top-1 font-mono text-[11px]">{d}</span>
                  {has && (
                    <span className="absolute bottom-1.5 left-1/2 flex -translate-x-1/2 gap-0.5">
                      {has.slice(0, 3).map((_, di) => (
                        <span key={di} className="h-1 w-1 rounded-full bg-neon" />
                      ))}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* agenda */}
        <div>
          <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.3em] text-neon/80">
            {selected
              ? new Date(selected).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })
              : `${MONTHS[m]} agenda`}
          </p>
          <div className="space-y-3">
            {agenda.length === 0 && (
              <p className="font-mono text-xs text-muted">// no events this month</p>
            )}
            {agenda.map((ev) => (
              <div key={ev.id} className="neo-panel p-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-pink">{ev.tag}</span>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-neon">
                    {new Date(ev.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                  </span>
                </div>
                <h3 className="mt-1.5 font-display text-lg font-semibold text-white">{ev.title}</h3>
                <div className="mt-2 space-y-1 font-mono text-[11px] text-muted">
                  <p className="flex items-center gap-2"><Clock size={12} className="text-pink" /> {ev.time}</p>
                  <p className="flex items-center gap-2"><MapPin size={12} className="text-pink" /> {ev.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
