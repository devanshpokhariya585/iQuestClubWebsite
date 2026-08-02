import { motion, AnimatePresence } from 'framer-motion'
import { Power } from 'lucide-react'

/*
  The signature interaction.
  - Closed: two dark chip halves sit flush, forming one sealed processor.
  - Open:   the halves slide apart + tilt, an electric arc ignites in the seam,
            and the glowing core panel (children) powers on between them.

  `isOpen` / `onToggle` are controlled by the parent (About.jsx) so the section
  heading and the chip stay in sync.
*/

// One half of the chip, drawn as an SVG. `side` flips it for the right half.
function ChipHalf({ side = 'left' }) {
  const flip = side === 'right'
  return (
    <svg
      viewBox="0 0 200 320"
      className="h-full w-full drop-shadow-[0_0_25px_rgba(46,139,255,0.25)]"
      style={{ transform: flip ? 'scaleX(-1)' : 'none' }}
      aria-hidden="true"
    >
      {/* outer pins on the far edge */}
      <g stroke="#f5b942" strokeWidth="3" opacity="0.85">
        {[70, 110, 150, 190, 230, 270].map((y) => (
          <line key={`p${y}`} x1="4" y1={y} x2="34" y2={y} />
        ))}
      </g>
      {/* top + bottom pins */}
      <g stroke="#2e8bff" strokeWidth="3" opacity="0.7">
        {[70, 110, 150, 190].map((x) => (
          <line key={`t${x}`} x1={x} y1="10" x2={x} y2="40" />
        ))}
        {[70, 110, 150, 190].map((x) => (
          <line key={`b${x}`} x1={x} y1="280" x2={x} y2="310" />
        ))}
      </g>
      {/* body — only the outer corners are rounded, seam edge is flat */}
      <path
        d="M60 40 H200 V280 H60 a20 20 0 0 1 -20 -20 V60 a20 20 0 0 1 20 -20 Z"
        fill="#0b1220"
        stroke="#2e8bff"
        strokeWidth="2"
      />
      {/* etched circuit traces */}
      <g stroke="#1b3a66" strokeWidth="2" fill="none">
        <path d="M60 90 H150 V130 H120" />
        <path d="M60 190 H130 V230 H180" />
        <path d="M60 150 H100" />
      </g>
      <g fill="#2e8bff" opacity="0.6">
        <circle cx="150" cy="90" r="3" />
        <circle cx="120" cy="130" r="3" />
        <circle cx="130" cy="230" r="3" />
      </g>
      {/* seam indicator (glows faintly) */}
      <rect x="196" y="120" width="8" height="80" fill="#2e8bff" opacity="0.25" />
    </svg>
  )
}

// The electric arc that fires in the gap when the chip opens.
function Arc() {
  return (
    <motion.svg
      viewBox="0 0 40 320"
      className="absolute left-1/2 top-0 h-full w-16 -translate-x-1/2"
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 0.6, 1] }}
      transition={{ duration: 0.6, times: [0, 0.3, 0.6, 1] }}
      aria-hidden="true"
    >
      <defs>
        <filter id="arc-glow" x="-100%" y="-50%" width="300%" height="200%">
          <feGaussianBlur stdDeviation="2.5" />
        </filter>
      </defs>
      <motion.path
        d="M20 20 L14 90 L26 140 L12 200 L24 250 L20 300"
        fill="none"
        stroke="#4fd6ff"
        strokeWidth="2.5"
        filter="url(#arc-glow)"
        animate={{ d: [
          'M20 20 L14 90 L26 140 L12 200 L24 250 L20 300',
          'M20 20 L26 80 L12 150 L28 190 L14 260 L20 300',
          'M20 20 L14 90 L26 140 L12 200 L24 250 L20 300',
        ] }}
        transition={{ repeat: Infinity, duration: 0.35, ease: 'linear' }}
      />
    </motion.svg>
  )
}

export default function Processor({ isOpen, onToggle, children }) {
  return (
    <div className="relative mx-auto w-full max-w-3xl select-none [perspective:1200px]">
      {/* CORE PANEL — revealed between the halves */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="core"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            className="corner-ticks absolute left-1/2 top-1/2 z-20 w-[78%] -translate-x-1/2 -translate-y-1/2
                       rounded-xl border border-cyan/40 bg-panel/85 p-6 backdrop-blur-md
                       shadow-glow-cyan md:p-8"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>

      {/* CHIP HALVES */}
      <button
        type="button"
        onClick={onToggle}
        aria-pressed={isOpen}
        aria-label={isOpen ? 'Close the processor core' : 'Open the processor core'}
        className="group relative block aspect-[3/2] w-full outline-none"
      >
        {/* ambient base glow under the chip */}
        <div
          className={`pointer-events-none absolute left-1/2 top-1/2 h-1/2 w-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl transition-opacity duration-500 ${
            isOpen ? 'bg-cyan/30 opacity-100' : 'bg-blue/20 opacity-70'
          }`}
        />

        {/* left half */}
        <motion.div
          className="absolute left-0 top-1/2 h-[80%] w-1/2 -translate-y-1/2 origin-right will-change-transform"
          animate={
            isOpen
              ? { x: '-32%', rotateY: 18, opacity: 1 }
              : { x: '0%', rotateY: 0, opacity: 1 }
          }
          transition={{ type: 'spring', stiffness: 120, damping: 16 }}
        >
          <ChipHalf side="left" />
        </motion.div>

        {/* right half */}
        <motion.div
          className="absolute right-0 top-1/2 h-[80%] w-1/2 -translate-y-1/2 origin-left will-change-transform"
          animate={
            isOpen
              ? { x: '32%', rotateY: -18, opacity: 1 }
              : { x: '0%', rotateY: 0, opacity: 1 }
          }
          transition={{ type: 'spring', stiffness: 120, damping: 16 }}
        >
          <ChipHalf side="right" />
        </motion.div>

        {/* electric arc in the seam, only while open */}
        <AnimatePresence>{isOpen && <Arc />}</AnimatePresence>

        {/* power hint — only while closed */}
        <AnimatePresence>
          {!isOpen && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="pointer-events-none absolute left-1/2 top-1/2 z-30 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2"
            >
              <span className="grid h-14 w-14 place-items-center rounded-full border border-gold/60 bg-void/70 text-gold shadow-glow-gold transition-transform duration-300 group-hover:scale-110">
                <Power size={22} />
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-gold">
                Tap to boot
              </span>
            </motion.span>
          )}
        </AnimatePresence>
      </button>
    </div>
  )
}
