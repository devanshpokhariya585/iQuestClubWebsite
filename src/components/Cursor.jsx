import { useEffect, useRef, useState } from 'react'

/*
  Custom cursor: a precise dot + a ring that eases behind it.
  Grows when over links/buttons or the 3D chip (body[data-hover]).
  Only active on fine pointers; touch devices keep native behavior.
*/
export default function Cursor() {
  const dot = useRef(null)
  const ring = useRef(null)
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return
    setEnabled(true)

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    const ringPos = { ...pos }
    let hovering = false

    const onMove = (e) => {
      pos.x = e.clientX
      pos.y = e.clientY
      const t = e.target
      hovering =
        !!(t.closest && t.closest('a, button, [data-cursor]')) ||
        document.body.dataset.hover === '1'
      if (dot.current) {
        dot.current.style.transform = `translate(${pos.x}px, ${pos.y}px)`
      }
    }

    let raf
    const loop = () => {
      ringPos.x += (pos.x - ringPos.x) * 0.18
      ringPos.y += (pos.y - ringPos.y) * 0.18
      if (ring.current) {
        const s = hovering ? 2.1 : 1
        ring.current.style.transform = `translate(${ringPos.x}px, ${ringPos.y}px) translate(-50%,-50%) scale(${s})`
        ring.current.style.borderColor = hovering ? '#f5b942' : 'rgba(95,224,255,0.7)'
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    window.addEventListener('mousemove', onMove)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
    }
  }, [])

  if (!enabled) return null

  return (
    <>
      <div
        ref={dot}
        className="pointer-events-none fixed left-0 top-0 z-[90] h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan"
        style={{ willChange: 'transform' }}
      />
      <div
        ref={ring}
        className="pointer-events-none fixed left-0 top-0 z-[90] h-8 w-8 rounded-full border transition-[border-color] duration-200"
        style={{ willChange: 'transform' }}
      />
    </>
  )
}
