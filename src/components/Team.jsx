import { motion } from 'framer-motion'
import { team } from '../data/content'
import Floaty from './Floaty'

const ease = [0.16, 1, 0.3, 1]

export default function Team() {
  return (
    <section id="team" className="relative z-10 mx-auto max-w-7xl px-6 py-28 md:py-36">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8, ease }}
        className="mb-14 text-center"
      >
        <p className="eyebrow">{team.eyebrow}</p>
        <h2 className="mt-5 font-display text-5xl font-bold leading-[0.95] tracking-tight text-white md:text-6xl">
          {team.heading}
        </h2>
        <p className="mx-auto mt-5 max-w-lg text-sm leading-relaxed text-muted">{team.subheading}</p>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {team.members.map((m, i) => (
          <Floaty key={m.name} index={i} depth={14 + (i % 4) * 7}>
            <article className="neo-panel scanlines group h-full overflow-hidden p-6 text-center">
              <div className="relative mx-auto grid h-24 w-24 place-items-center rounded-full border border-pink/40 bg-gradient-to-b from-pink/20 to-transparent">
                <span className="font-display text-2xl font-bold text-neon text-glow-pink">
                  {m.initials}
                </span>
                <span className="absolute inset-0 rounded-full ring-1 ring-inset ring-white/10 transition-all duration-300 group-hover:ring-pink/50" />
              </div>
              <h3 className="mt-5 font-display text-lg font-semibold text-white">{m.name}</h3>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.25em] text-neon">
                {m.role}
              </p>
            </article>
          </Floaty>
        ))}
      </div>
    </section>
  )
}
