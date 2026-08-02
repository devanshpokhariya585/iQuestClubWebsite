import { motion } from 'framer-motion'
import ChipCanvas from '../three/ChipCanvas'
import { hero } from '../data/content'

const ease = [0.16, 1, 0.3, 1]

export default function Hero() {
  return (
    <section id="top" className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6">
      {/* chip lifted up so the title doesn't cover it */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <ChipCanvas interactive={false} open={false} dust scale={0.72} lift={0.85} />
      </div>

      {/* vignette sits lower, around the title, for legibility */}
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{ background: 'radial-gradient(52% 34% at 50% 62%, rgba(10,5,16,0.78), transparent 72%)' }}
      />

      {/* content pushed slightly down so the lifted chip has room above */}
      <div className="relative z-10 mt-[14vh] flex flex-col items-center text-center">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.8, ease }}
          className="mb-5 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.4em] text-neon/70"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-pink" />
          {hero.status}
        </motion.p>

        <h1 className="font-display font-extrabold text-white">
          <motion.span
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.9, ease }}
            className="block display-hero text-glow-pink"
          >
            {hero.title1}
          </motion.span>
          <motion.span
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.26, duration: 0.9, ease }}
            className="block display-hero text-white text-glow-white"
          >
            {hero.title2}
          </motion.span>
        </h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55, duration: 1 }}
          className="mt-6 font-mono text-[11px] uppercase tracking-[0.45em] text-muted"
        >
          {hero.tagline}
        </motion.p>

        {/* single CTA, no other clutter */}
        <motion.a
          href="#about"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="btn-ghost mt-8 !py-2.5 !text-[10px]"
        >
          Explore the chip
        </motion.a>
      </div>

      {/* scroll hint */}
      <motion.a
        href="#about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 1 }}
        className="absolute bottom-7 left-1/2 z-10 -translate-x-1/2 font-mono text-[9px] uppercase tracking-[0.4em] text-muted transition-colors hover:text-neon"
      >
        {hero.scrollHint}
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.6 }}
          className="mx-auto mt-2 block h-5 w-3.5 rounded-full border border-white/20"
        >
          <span className="mx-auto mt-1 block h-1 w-1 rounded-full bg-neon" />
        </motion.span>
      </motion.a>
    </section>
  )
}
