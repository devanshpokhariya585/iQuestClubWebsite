import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { events } from '../data/content'
import Floaty from './Floaty'

const ease = [0.16, 1, 0.3, 1]

const statusStyle = {
  REGISTERING: 'text-neon',
  'FEW SEATS': 'text-pink',
  'RSVP OPEN': 'text-neon',
}

export default function Events() {
  return (
    <section id="events" className="relative z-10 mx-auto max-w-7xl px-6 py-28 md:py-36">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8, ease }}
        className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end"
      >
        <div>
          <p className="eyebrow">{events.eyebrow}</p>
          <h2 className="mt-5 font-display text-5xl font-bold leading-[0.95] tracking-tight text-white md:text-6xl">
            {events.heading}
          </h2>
        </div>
        <p className="max-w-xs text-sm leading-relaxed text-muted">{events.subheading}</p>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-2">
        {events.list.map((ev, i) => (
          <Floaty key={ev.id} index={i} depth={10 + (i % 3) * 8}>
            <a
              href="#"
              className="glass glass-sheen group flex items-center gap-5 rounded-2xl p-5 md:p-6"
            >
              {/* date block */}
              <span className="flex w-20 shrink-0 flex-col items-center justify-center rounded-lg border border-line bg-white/[0.02] py-3">
                <span className="font-mono text-[10px] uppercase tracking-widest text-neon">
                  {ev.date.split(' ')[0]}
                </span>
                <span className="font-display text-2xl font-bold text-white">
                  {ev.date.split(' ')[1]}
                </span>
              </span>

              <span className="min-w-0 flex-1">
                <span className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-pink">
                    {ev.tag}
                  </span>
                  <span
                    className={`font-mono text-[9px] uppercase tracking-widest ${
                      statusStyle[ev.status] || 'text-muted'
                    }`}
                  >
                    {ev.status}
                  </span>
                </span>
                <span className="mt-1 block truncate font-display text-xl font-semibold text-white transition-colors group-hover:text-neon">
                  {ev.title}
                </span>
                <span className="mt-2 block font-mono text-[11px] text-muted">
                  {ev.time} · {ev.location}
                </span>
              </span>

              <ArrowUpRight
                size={18}
                className="shrink-0 text-muted transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-neon"
              />
            </a>
          </Floaty>
        ))}
      </div>

      <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
        <Link to="/calendar" className="btn-primary">
          Full calendar
          <ArrowUpRight size={16} />
        </Link>
        <Link to="/events/past" className="btn-ghost">
          Past events
          <ArrowUpRight size={16} />
        </Link>
      </div>
    </section>
  )
}
