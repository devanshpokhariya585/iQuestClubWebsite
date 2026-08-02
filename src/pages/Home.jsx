import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import Hero from '../components/Hero'
import Marquee from '../components/Marquee'
import About from '../components/About'
import Capabilities from '../components/Capabilities'
import Stats from '../components/Stats'
import Events from '../components/Events'
import TeamCarousel from '../components/TeamCarousel'
import Newsletter from '../components/Newsletter'

const ease = [0.16, 1, 0.3, 1]

function CTABand() {
  return (
    <section className="relative z-10 mx-auto max-w-7xl px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.7, ease }}
        className="neo-panel grid gap-6 p-8 md:grid-cols-2 md:items-center md:p-10"
      >
        <div>
          <p className="eyebrow">RECRUITMENT</p>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-white md:text-4xl">
            Join &amp; level up
          </h2>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">
            Sign in with your VIT email to take on tasks and quizzes and climb the ranks.
          </p>
        </div>
        <div className="md:justify-self-end">
          <Link to="/recruitment" className="btn-primary">
            Recruitment portal <ArrowUpRight size={16} />
          </Link>
        </div>
      </motion.div>
    </section>
  )
}

export default function Home() {
  return (
    <main>
      <Hero />
      <Marquee />
      <About />
      <Capabilities />
      <Stats />
      <Events />
      <TeamCarousel />
      <CTABand />
      <Newsletter />
    </main>
  )
}
