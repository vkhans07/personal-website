import { useEffect, useRef } from 'react'

// Hangs an element with scroll inertia: a smoothed copy of scrollY chases
// the real one (same easing trick as the hero lamp), and the element is
// translated by the gap. Scroll fast and it trails behind, then settles
// back into place.
//
// strength — how far it trails (px of offset per px of scroll gap)
// easeRate — how quickly the smoothed scroll catches up (higher = stiffer)
export function useScrollLag<T extends HTMLElement>(strength = 0.14, easeRate = 0.09) {
  const ref = useRef<T | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    el.style.willChange = 'transform'
    let smooth = window.scrollY
    let raf = requestAnimationFrame(function tick() {
      raf = requestAnimationFrame(tick)
      const y = window.scrollY
      smooth += (y - smooth) * easeRate
      let off = (y - smooth) * strength
      if (off > 60) off = 60
      else if (off < -60) off = -60
      el.style.transform =
        Math.abs(off) < 0.05 ? '' : 'translate3d(0,' + off + 'px,0)'
    })

    return () => {
      cancelAnimationFrame(raf)
      el.style.transform = ''
      el.style.willChange = ''
    }
  }, [strength, easeRate])

  return ref
}
