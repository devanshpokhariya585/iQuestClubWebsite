import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, Calendar, X, Images, ArrowUpRight } from 'lucide-react'
import { pastEvents } from '../data/content'
import Floaty from '../components/Floaty'

const ease = [0.16, 1, 0.3, 1]

/*
  Cover + gallery images use picsum.photos (seeded, so each event is consistent).
  Swap for your own by dropping files in /public/events/ and returning those paths
  from coverOf / galleryOf below.
*/
const coverOf = (ev) => `https://picsum.photos/seed/${ev.id}-cover/900/540`
const galleryOf = (ev) =>
  Array.from({ length: 6 }, (_, n) => `https://picsum.photos/seed/${ev.id}-${n}/800/560`)

export default function PastEvents() {
  const years = useMemo(() => ['All', ...Array.from(new Set(pastEvents.map((e) => e.year)))], [])
  const [year, setYear] = useState('All')
  const [open, setOpen] = useState(null) // event being viewed
  const [lightbox, setLightbox] = useState(null) // enlarged image url

  const list = year === 'All' ? pastEvents : pastEvents.filter((e) => e.year === year)

  // ESC to close + lock scroll while a modal is open
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== 'Escape') return
      if (lightbox) setLightbox(null)
      else if (open) setOpen(null)
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, lightbox])

  return (
    <section className="relative z-10 mx-auto max-w-7xl px-6 pb-28 pt-36">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease }}
        className="mb-12"
      >
        <p className="eyebrow">ARCHIVE · RECAPS</p>
        <h1 className="mt-4 font-display text-5xl font-extrabold leading-[0.95] tracking-tight text-white md:text-7xl">
          PAST <span className="text-pink text-glow-pink">EVENTS</span>
        </h1>
        <p className="mt-5 max-w-md text-sm leading-relaxed text-muted">
          Tap any event to open its photo gallery.
        </p>
      </motion.div>

      {/* year filter */}
      <div className="mb-10 flex flex-wrap gap-2">
        {years.map((y) => (
          <button
            key={y}
            onClick={() => setYear(y)}
            className={`rounded-full border px-4 py-1.5 font-mono text-[11px] uppercase tracking-widest transition-colors ${
              year === y
                ? 'border-pink/60 bg-pink/15 text-neon'
                : 'border-white/12 text-muted hover:border-pink/40 hover:text-neon'
            }`}
          >
            {y}
          </button>
        ))}
      </div>

      {/* cards */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {list.map((ev, i) => (
          <Floaty key={ev.id} index={i} depth={10 + (i % 3) * 8}>
            <button
              onClick={() => setOpen(ev)}
              className="glass glass-sheen group block h-full w-full overflow-hidden rounded-2xl text-left"
            >
              {/* cover */}
              <div className="relative h-40 w-full overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-pink/25 to-magenta/25" />
                <img
                  src={coverOf(ev)}
                  alt={ev.title}
                  loading="lazy"
                  className="relative h-full w-full object-cover opacity-90 transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-void/80 to-transparent" />
                <span className="absolute left-4 top-4 rounded-full border border-white/20 bg-void/50 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.25em] text-white/90 backdrop-blur-sm">
                  {ev.tag}
                </span>
                <span className="absolute bottom-3 right-4 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-white/90">
                  <Images size={12} /> gallery
                </span>
              </div>

              <div className="p-5">
                <h3 className="font-display text-xl font-semibold text-white transition-colors group-hover:text-neon">
                  {ev.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-muted">{ev.blurb}</p>
                <div className="mt-4 flex items-center gap-4 font-mono text-[10px] uppercase tracking-widest text-muted">
                  <span className="flex items-center gap-1.5"><Calendar size={12} className="text-pink" /> {ev.year}</span>
                  <span className="flex items-center gap-1.5"><Users size={12} className="text-pink" /> {ev.attendees}</span>
                </div>
              </div>
            </button>
          </Floaty>
        ))}
      </div>

      {/* EVENT MODAL */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(null)}
            className="fixed inset-0 z-[80] flex items-start justify-center overflow-y-auto bg-void/80 p-4 backdrop-blur-md md:p-10"
          >
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              transition={{ duration: 0.4, ease }}
              onClick={(e) => e.stopPropagation()}
              className="glass glass-sheen relative my-auto w-full max-w-4xl overflow-hidden rounded-3xl"
            >
              {/* banner */}
              <div className="relative h-56 w-full overflow-hidden md:h-64">
                <img src={coverOf(open)} alt={open.title} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-void via-void/40 to-transparent" />
                <button
                  onClick={() => setOpen(null)}
                  aria-label="Close"
                  className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full border border-white/20 bg-void/50 text-white backdrop-blur-sm transition-colors hover:border-pink hover:text-neon"
                >
                  <X size={18} />
                </button>
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-pink">{open.tag}</span>
                  <h2 className="mt-1 font-display text-3xl font-extrabold text-white md:text-4xl">{open.title}</h2>
                  <div className="mt-2 flex flex-wrap gap-4 font-mono text-[11px] uppercase tracking-widest text-white/80">
                    <span className="flex items-center gap-1.5"><Calendar size={12} className="text-pink" /> {new Date(open.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                    <span className="flex items-center gap-1.5"><Users size={12} className="text-pink" /> {open.attendees} attended</span>
                  </div>
                </div>
              </div>

              <div className="p-6 md:p-8">
                <p className="max-w-2xl text-sm leading-relaxed text-muted">{open.blurb}</p>

                <p className="mt-8 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.3em] text-neon">
                  <Images size={14} /> Gallery
                </p>
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {galleryOf(open).map((src, gi) => (
                    <button
                      key={gi}
                      onClick={() => setLightbox(src)}
                      className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-white/10"
                    >
                      <img src={src} alt={`${open.title} ${gi + 1}`} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      <span className="absolute inset-0 grid place-items-center bg-void/0 text-transparent transition-all group-hover:bg-void/40 group-hover:text-white">
                        <ArrowUpRight size={20} />
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LIGHTBOX */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
            className="fixed inset-0 z-[90] flex items-center justify-center bg-void/90 p-6 backdrop-blur-lg"
          >
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              src={lightbox}
              alt="Preview"
              className="max-h-[86vh] max-w-[92vw] rounded-2xl border border-white/15 object-contain shadow-[0_0_80px_rgba(255,45,149,0.25)]"
            />
            <button
              onClick={() => setLightbox(null)}
              aria-label="Close"
              className="absolute right-6 top-6 grid h-11 w-11 place-items-center rounded-full border border-white/20 bg-void/50 text-white hover:border-pink hover:text-neon"
            >
              <X size={20} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
