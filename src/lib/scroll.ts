import type { MouseEvent } from 'react'

// Eased scroll matched to the design prototype: duration scales with
// distance, cubic ease-out.
export function scrollToId(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  const toY = el.getBoundingClientRect().top + window.scrollY - 6
  const fromY = window.scrollY
  const d = Math.min(900, Math.max(360, Math.abs(toY - fromY) * 0.6))
  const start = performance.now()
  const ease = (t: number) => 1 - Math.pow(1 - t, 3)
  const step = (now: number) => {
    const t = Math.min(1, (now - start) / d)
    window.scrollTo(0, fromY + (toY - fromY) * ease(t))
    if (t < 1) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}

export function navTo(id: string) {
  return (e: MouseEvent) => {
    e.preventDefault()
    scrollToId(id)
  }
}
