import { useState } from 'react'
import { useMonetEngine, FRAME_URL } from '../hooks/useMonetEngine'
import IdentityPanel from './IdentityPanel'
import LightPanel from './LightPanel'
import '../styles/hero.css'

export default function Hero() {
  const [lightsUp, setLightsUp] = useState(false)
  const engine = useMonetEngine(lightsUp)

  return (
    <section id="top" className="hero" onPointerMove={engine.onAim}>
      {/* offscreen gallery light: soft spill from above */}
      <div ref={engine.glowRef} className="hero-glow" />
      <div className="hero-vignette" />

      <div className="hero-stage">
        {/* the work: gilt frame image with the ball-canvas in its window */}
        <div className="hero-work">
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

        {/* wall label: frosted plate below the work */}
        <div className="wall-label">
          <div className="wall-label-title">
            After Monet — <span>Woman with a Parasol</span>
          </div>
          <div className="wall-label-sub">
            reassembled in <span ref={engine.labelCountRef}>2,600</span> points
            of light · after the 1875 oil
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
