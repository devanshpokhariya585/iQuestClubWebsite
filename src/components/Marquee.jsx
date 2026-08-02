import { marquee } from '../data/content'

export default function Marquee() {
  // duplicated once so the -50% loop is seamless
  const items = [...marquee, ...marquee]
  return (
    <div className="relative z-10 overflow-hidden border-y border-line/80 bg-pink/[0.03] py-4">
      <div className="flex w-max animate-marquee items-center gap-8 whitespace-nowrap">
        {items.map((text, i) => (
          <span key={i} className="flex items-center gap-8">
            <span className="font-display text-sm font-semibold uppercase tracking-[0.25em] text-neon">
              {text}
            </span>
            <span className="text-pink text-glow-pink">◆</span>
          </span>
        ))}
      </div>
    </div>
  )
}
