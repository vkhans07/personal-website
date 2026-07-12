import { useRef, useState } from 'react'
import type { ChangeEvent } from 'react'
import { useMonetEngine, FRAME_URL } from '../hooks/useMonetEngine'
import { useScrollLag } from '../hooks/useScrollLag'
import { paintings } from '../data/site'
import IdentityPanel from './IdentityPanel'
import LightPanel from './LightPanel'
import '../styles/hero.css'

export default function Hero() {
  const [lightsUp, setLightsUp] = useState(false)
  const [idx, setIdx] = useState(0)
  const [customUrl, setCustomUrl] = useState<string | null>(null)
  const fileInput = useRef<HTMLInputElement | null>(null)

  const current = customUrl
    ? { title: 'Untitled', artist: 'You', origin: 'fresh from your files', url: customUrl }
    : paintings[idx]

  const engine = useMonetEngine(lightsUp, current.url)
  const workLag = useScrollLag<HTMLDivElement>(0.18)

  const clearCustom = () => {
    if (customUrl) URL.revokeObjectURL(customUrl)
    setCustomUrl(null)
  }
  const step = (d: number) => {
    clearCustom()
    setIdx((i) => (i + d + paintings.length) % paintings.length)
  }
  const pick = (i: number) => {
    clearCustom()
    setIdx(i)
  }
  const onFile = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    if (customUrl) URL.revokeObjectURL(customUrl)
    setCustomUrl(URL.createObjectURL(f))
    e.target.value = ''
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
                    'carousel-dot' + (!customUrl && i === idx ? ' is-active' : '')
                  }
                  aria-label={`${p.title} — ${p.artist}`}
                  title={`${p.artist} · ${p.title}`}
                  onClick={() => pick(i)}
                />
              ))}
              {customUrl && (
                <button
                  className="carousel-dot carousel-dot--custom is-active"
                  aria-label="your upload"
                  title="You · Untitled"
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
        onReassemble={engine.reassemble}
        onScatter={engine.scatter}
      />
    </section>
  )
}
