import { useRef, useState } from 'react'
import type { ChangeEvent } from 'react'
import { useMonetEngine, FRAME_URL } from '../hooks/useMonetEngine'
import { useScrollLag } from '../hooks/useScrollLag'
import { paintings } from '../data/site'
import IdentityPanel from './IdentityPanel'
import LightPanel from './LightPanel'
import '../styles/hero.css'
const CUSTOM_KEY = 'hero-custom-painting'

export default function Hero() {
  const [lightsUp, setLightsUp] = useState(false)
  const [idx, setIdx] = useState(0)
  const [customUrl, setCustomUrl] = useState<string | null>(() => {
    try {
      return localStorage.getItem(CUSTOM_KEY)
    } catch {
      return null
    }
  })
  const fileInput = useRef<HTMLInputElement | null>(null)

  // the upload occupies one extra slot at the end of the carousel
  const total = paintings.length + (customUrl ? 1 : 0)
  const isCustom = customUrl !== null && idx === paintings.length

  const current = isCustom
    ? { title: 'Untitled', artist: 'You', origin: 'fresh from your files', url: customUrl }
    : paintings[idx % paintings.length]

  const engine = useMonetEngine(lightsUp, current.url)
  const workLag = useScrollLag<HTMLDivElement>(0.18)

  const step = (d: number) => setIdx((i) => (i + d + total) % total)
  const pick = (i: number) => setIdx(i)
  const onFile = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    e.target.value = ''
    const obj = URL.createObjectURL(f)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(obj)
      // downscale + re-encode so the data URL fits in localStorage; the
      // engine samples it down to a coarse grid anyway
      const scale = Math.min(1, 1280 / Math.max(img.naturalWidth, img.naturalHeight))
      const c = document.createElement('canvas')
      c.width = Math.max(1, Math.round(img.naturalWidth * scale))
      c.height = Math.max(1, Math.round(img.naturalHeight * scale))
      c.getContext('2d')?.drawImage(img, 0, 0, c.width, c.height)
      const url = c.toDataURL('image/jpeg', 0.85)
      try {
        localStorage.setItem(CUSTOM_KEY, url)
      } catch {
        /* quota exceeded — still shown this session, just not persisted */
      }
      setCustomUrl(url)
      setIdx(paintings.length)
    }
    img.onerror = () => URL.revokeObjectURL(obj)
    img.src = obj
  }

  return (
    <section id="top" className="hero" onPointerMove={engine.onAim}>
      {/* offscreen gallery light: soft spill from above */}
      <div ref={engine.glowRef} className="hero-glow" />
      <div className="hero-vignette" />

      <div className="hero-stage">
        {/* the work: gilt frame image with the ball-canvas in its window */}
        <div ref={workLag} className="hero-work">
          <div className="hero-canvas-window">
            <canvas
              ref={engine.canvasRef}
              onPointerMove={engine.onMove}
              onPointerLeave={engine.onLeave}
              onPointerDown={engine.onDown}
              onPointerUp={engine.onUp}
            />
            <div className="hero-hud">
              <span ref={engine.countRef}>0</span> points ·{' '}
              <span ref={engine.fpsRef}>60</span> fps
            </div>
          </div>
          <img
            className="hero-frame"
            crossOrigin="anonymous"
            src={FRAME_URL}
            alt="ornate gilt frame"
          />
        </div>

        {/* wall label: frosted plate below the work, with the exhibit rail */}
        <div className="wall-label">
          <div className="wall-label-title">
            After {current.artist} — <span>{current.title}</span>
          </div>
          <div className="wall-label-sub">
            reassembled in <span ref={engine.labelCountRef}>2,600</span> points
            of light · {current.origin}
          </div>
          <div className="wall-label-rule" />
          <div className="carousel-row">
            <button
              className="carousel-arrow"
              aria-label="previous painting"
              onClick={() => step(-1)}
            >
              ←
            </button>
            <div className="carousel-dots">
              {paintings.map((p, i) => (
                <button
                  key={p.title}
                  className={
                    'carousel-dot' + (!isCustom && i === idx ? ' is-active' : '')
                  }
                  aria-label={`${p.title} — ${p.artist}`}
                  title={`${p.artist} · ${p.title}`}
                  onClick={() => pick(i)}
                />
              ))}
              {customUrl && (
                <button
                  className={
                    'carousel-dot carousel-dot--custom' +
                    (isCustom ? ' is-active' : '')
                  }
                  aria-label="your upload"
                  title="You · Untitled"
                  onClick={() => pick(paintings.length)}
                />
              )}
            </div>
            <button
              className="carousel-arrow"
              aria-label="next painting"
              onClick={() => step(1)}
            >
              →
            </button>
          </div>
          <div className="carousel-upload-row">
            <button
              className="carousel-upload"
              onClick={() => fileInput.current?.click()}
            >
              hang your own painting
            </button>
            <input
              ref={fileInput}
              type="file"
              accept="image/*"
              hidden
              onChange={onFile}
            />
          </div>
          <div className="wall-label-rule" />
          <div className="wall-label-hint">
            Move across the room to steer the light. Drag the paint to disturb
            it, click to scatter.
          </div>
        </div>
      </div>
      
      <IdentityPanel />
      <LightPanel
        lightsUp={lightsUp}
        onToggle={() => setLightsUp((v) => !v)}
        onScatter={engine.scatter}
      />
    </section>
  )
}
