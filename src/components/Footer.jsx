import { footer } from '../data/content'

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/10">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-[1.6fr_1fr_1fr]">
        <div>
          <a href="#top" className="inline-block">
            <img src="/logo.png" alt="Innovators Quest" className="h-16 w-auto" />
          </a>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">{footer.tagline}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {footer.socials.map((s) => (
              <a
                key={s}
                href="#"
               
                className="rounded-full border border-white/15 px-4 py-1.5 font-mono text-[10px] uppercase tracking-widest text-muted transition-colors hover:border-neon/60 hover:text-neon"
              >
                {s}
              </a>
            ))}
          </div>
        </div>

        {footer.columns.map((col) => (
          <div key={col.title}>
            <h4 className="font-mono text-[10px] uppercase tracking-[0.3em] text-neon/70">
              {col.title}
            </h4>
            <ul className="mt-5 space-y-3">
              {col.links.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="text-sm text-muted transition-colors hover:text-ink">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-white/5">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-6 py-6 font-mono text-[10px] uppercase tracking-widest text-muted md:flex-row">
          <span>© {new Date().getFullYear()} Innovators Quest · All systems nominal</span>
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-neon" />
            Built by curious minds
          </span>
        </div>
      </div>
    </footer>
  )
}
