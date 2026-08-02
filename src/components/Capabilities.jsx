import { motion } from 'framer-motion'
import { Code2, Trophy, Rocket, Users, GitBranch } from 'lucide-react'
import { capabilities } from '../data/content'
import Floaty from './Floaty'

const ease = [0.16, 1, 0.3, 1]
const icons = { Code2, Trophy, Rocket, Users, GitBranch }

export default function Capabilities() {
  return (
    <section className="relative z-10 mx-auto max-w-7xl px-6 py-28 md:py-36">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8, ease }}
        className="mb-14 text-center"
      >
        <p className="eyebrow">{capabilities.eyebrow}</p>
        <h2 className="mt-5 font-display text-5xl font-bold leading-[0.95] tracking-tight text-white md:text-6xl">
          {capabilities.heading}
        </h2>
        <p className="mx-auto mt-5 max-w-lg text-sm leading-relaxed text-muted">
          {capabilities.subheading}
        </p>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {capabilities.items.map((item, i) => {
          const Icon = icons[item.icon] || Code2
          return (
            <Floaty key={item.title} index={i} depth={12 + (i % 3) * 10}>
              <div className="neo-panel group h-full p-6">
                <span className="grid h-11 w-11 place-items-center rounded-lg border border-pink/40 bg-pink/10 text-neon transition-colors group-hover:bg-pink/20">
                  <Icon size={20} />
                </span>
                <h3 className="mt-5 font-display text-lg font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-muted">{item.text}</p>
              </div>
            </Floaty>
          )
        })}
      </div>
    </section>
  )
}
