import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'

const routeLinks = [
  { label: 'Home', to: '/' },
  { label: 'Past Events', to: '/events/past' },
  { label: 'Calendar', to: '/calendar' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setOpen(false), [pathname])

  const linkCls = ({ isActive }) =>
    `font-mono text-[11px] uppercase tracking-[0.25em] transition-colors ${
      isActive ? 'text-neon' : 'text-muted hover:text-neon'
    }`
  const plainCls = 'font-mono text-[11px] uppercase tracking-[0.25em] text-muted transition-colors hover:text-neon'

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? 'border-b border-white/10 bg-void/70 backdrop-blur-md' : 'border-b border-transparent'
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <Link to="/" className="flex items-center gap-2 font-display text-sm font-bold tracking-[0.2em] text-white">
          IQ<span className="text-pink">/</span>
          <span className="hidden text-muted sm:inline">INNOVATORS QUEST</span>
        </Link>

        <ul className="hidden items-center gap-9 md:flex">
          {routeLinks.map((l) => (
            <li key={l.to}>
              <NavLink to={l.to} className={linkCls} end={l.to === '/'}>
                {l.label}
              </NavLink>
            </li>
          ))}
          {/* Team is an inline section on the home page */}
          <li>
            <Link to="/#team" className={plainCls}>Team</Link>
          </li>
          <li>
            <Link to="/recruitment" className="btn-primary !py-2 !px-5 !text-[10px]">
              Recruitment
            </Link>
          </li>
        </ul>

        <button
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          className="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-ink md:hidden"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-white/10 bg-void/95 px-6 md:hidden"
          >
            {[...routeLinks, { label: 'Team', to: '/#team' }, { label: 'Recruitment', to: '/recruitment' }].map((l) => (
              <li key={l.to} className="border-b border-white/5 last:border-0">
                <Link
                  to={l.to}
                  className="block py-4 font-mono text-sm uppercase tracking-[0.25em] text-ink"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
