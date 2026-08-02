import { useEffect, useRef } from 'react'
import Lenis from 'lenis'

/*
  Momentum smooth-scroll (the biggest "Active Theory" feel differentiator).
  Also hijacks in-page anchor clicks so nav links glide instead of jumping.
  Disabled automatically when the user prefers reduced motion.
*/
export default function useLenis() {
  const lenisRef = useRef(null)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return

    const lenis = new Lenis({
      lerp: 0.09,
      wheelMultiplier: 1,
      smoothWheel: true,
    })
    lenisRef.current = lenis
    window.__lenis = lenis

    let raf
    const loop = (t) => {
      lenis.raf(t)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    const onClick = (e) => {
      const a = e.target.closest('a[href^="#"]')
      if (!a) return
      const id = a.getAttribute('href')
      if (id.length < 2) return
      const el = document.querySelector(id)
      if (!el) return
      e.preventDefault()
      lenis.scrollTo(el, { offset: -40, duration: 1.2 })
    }
    document.addEventListener('click', onClick)

    return () => {
      cancelAnimationFrame(raf)
      document.removeEventListener('click', onClick)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  return lenisRef
}
