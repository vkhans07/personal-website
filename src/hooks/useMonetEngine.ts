import { useEffect, useRef } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'

export const MONET_URL =
  'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Claude_Monet%2C_Woman_with_a_Parasol_-_Madame_Monet_and_Her_Son%2C_1875%2C_NGA_61379.jpg/960px-Claude_Monet%2C_Woman_with_a_Parasol_-_Madame_Monet_and_Her_Son%2C_1875%2C_NGA_61379.jpg'

export const FRAME_URL =
  'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Jacques-louis_david%2C_marte_disarmato_da_venere%2C_1824%2C_picture_frame.png/960px-Jacques-louis_david%2C_marte_disarmato_da_venere%2C_1824%2C_picture_frame.png'

// Tuning knobs carried over from the design canvas.
export const PAINTING = {
  detail: 1, // 0.5–1.6 · point density multiplier
  ballScale: 1, // 0.6–1.8 · dot radius multiplier
  beamWidth: 0.52, // 0.32–0.8 · spotlight cone half-width per unit depth
  shadow: 0.08, // 0.02–0.3 · brightness floor outside the beam
}

interface Ball {
  hx: number // home position the spring pulls back to
  hy: number
  x: number
  y: number
  vx: number
  vy: number
  r: number
  g: number
  b: number
  rad: number
}

interface EngineState {
  ctx: CanvasRenderingContext2D | null
  img: HTMLImageElement | null
  imgReady: boolean
  balls: Ball[]
  mouse: { x: number; y: number; active: boolean; down: boolean }
  burst: { x: number; y: number } | null
  frames: number
  fpsSmooth: number
  last: number
  lampX: number
  lampTargetX: number
  cssW: number
  W: number
  H: number
  dpr: number
}

// The painting: the Monet is downsampled to a small grid, one spring-damped
// ball per pixel. Every frame each ball is pulled home, shoved by the
// pointer, and lit by a cone of light whose apex sits offscreen above the
// frame. All mutable sim state lives outside React; the only React state is
// `lightsUp`, passed in and mirrored into a ref so the RAF loop reads it
// without re-subscribing.
export function useMonetEngine(lightsUp: boolean) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const glowRef = useRef<HTMLDivElement | null>(null)
  const countRef = useRef<HTMLSpanElement | null>(null)
  const fpsRef = useRef<HTMLSpanElement | null>(null)
  const labelCountRef = useRef<HTMLSpanElement | null>(null)

  const lightsUpRef = useRef(lightsUp)
  lightsUpRef.current = lightsUp

  const st = useRef<EngineState>({
    ctx: null,
    img: null,
    imgReady: false,
    balls: [],
    mouse: { x: -9999, y: -9999, active: false, down: false },
    burst: null,
    frames: 0,
    fpsSmooth: 60,
    last: 0,
    lampX: 0.5,
    lampTargetX: 0.5,
    cssW: 300,
    W: 0,
    H: 0,
    dpr: 1,
  }).current

  useEffect(() => {
    const cv = canvasRef.current
    if (!cv) return
    st.ctx = cv.getContext('2d')

    const buildBalls = () => {
      if (!st.imgReady || !st.img || !st.W) return
      const imgAspect = st.img.naturalWidth / st.img.naturalHeight
      const rows = Math.max(
        2,
        Math.round(
          58 * Math.sqrt(PAINTING.detail) * Math.min(1.15, st.H / (560 * st.dpr)),
        ),
      )
      const cols = Math.max(8, Math.round(rows * imgAspect))
      const oc = document.createElement('canvas')
      oc.width = cols
      oc.height = rows
      const og = oc.getContext('2d')
      if (!og) return
      og.drawImage(st.img, 0, 0, cols, rows)
      let data: Uint8ClampedArray
      try {
        data = og.getImageData(0, 0, cols, rows).data
      } catch (e) {
        console.warn('canvas tainted — image must be served with CORS', e)
        return
      }
      const cellW = st.W / cols
      const cellH = st.H / rows
      const rad = Math.max(cellW, cellH) * 0.6
      const keep = st.balls.length > 0
      const old = st.balls
      const nb: Ball[] = []
      let k = 0
      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          const idx = (j * cols + i) * 4
          const prev = keep ? old[k] : null
          nb.push({
            hx: (i + 0.5) * cellW,
            hy: (j + 0.5) * cellH,
            x: prev ? prev.x : Math.random() * st.W,
            y: prev ? prev.y : Math.random() * st.H,
            vx: prev ? prev.vx : (Math.random() - 0.5) * 6,
            vy: prev ? prev.vy : (Math.random() - 0.5) * 6,
            r: data[idx],
            g: data[idx + 1],
            b: data[idx + 2],
            rad,
          })
          k++
        }
      }
      st.balls = nb
      if (labelCountRef.current)
        labelCountRef.current.textContent = nb.length.toLocaleString()
    }

    const resize = () => {
      const r = cv.getBoundingClientRect()
      st.cssW = r.width
      st.dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = Math.max(1, Math.floor(r.width * st.dpr))
      const h = Math.max(1, Math.floor(r.height * st.dpr))
      if (w === st.W && h === st.H) return
      cv.width = st.W = w
      cv.height = st.H = h
      if (st.imgReady) buildBalls()
    }

    const loop = (t: number) => {
      raf = requestAnimationFrame(loop)
      const ctx = st.ctx
      if (!ctx || !st.W) return
      const dt = st.last ? t - st.last : 16
      st.last = t
      st.fpsSmooth += (Math.min(120, 1000 / Math.max(1, dt)) - st.fpsSmooth) * 0.08
      const { dpr, W, H } = st

      // ease the aim toward pointer target + faint idle drift
      const idle = Math.sin(t * 0.0002) * 0.02
      st.lampX += (st.lampTargetX + idle - st.lampX) * 0.045
      if (glowRef.current)
        glowRef.current.style.transform =
          'translateX(calc(-50% + ' + (st.lampX - 0.5) * st.cssW * 0.6 + 'px))'

      ctx.globalCompositeOperation = 'source-over'
      ctx.globalAlpha = 1
      ctx.fillStyle = '#08070c'
      ctx.fillRect(0, 0, W, H)

      const beam = PAINTING.beamWidth
      const darkFloor = PAINTING.shadow
      const up = lightsUpRef.current
      const apexX = st.lampX * W
      const apexY = -0.55 * H // light originates well offscreen, above
      const feather = 90 * dpr

      const k = 0.02
      const drag = 0.86
      const { x: mx, y: my, active: mAct, down } = st.mouse
      const R = (down ? 130 : 100) * dpr
      const bscale = PAINTING.ballScale

      const balls = st.balls
      for (let n = 0; n < balls.length; n++) {
        const p = balls[n]
        p.vx += (p.hx - p.x) * k
        p.vy += (p.hy - p.y) * k
        if (mAct) {
          const dx = p.x - mx
          const dy = p.y - my
          const d2 = dx * dx + dy * dy
          if (d2 < R * R) {
            const d = Math.sqrt(d2) || 0.01
            const f = (1 - d / R) * (down ? 4.2 : 2.2)
            p.vx += (dx / d) * f
            p.vy += (dy / d) * f
          }
        }
        if (st.burst) {
          const dx = p.x - st.burst.x
          const dy = p.y - st.burst.y
          const d2 = dx * dx + dy * dy
          const R2 = 240 * dpr
          if (d2 < R2 * R2) {
            const d = Math.sqrt(d2) || 0.01
            const f = (1 - d / R2) * 13 * dpr
            p.vx += (dx / d) * f
            p.vy += (dy / d) * f
          }
        }
        p.vx *= drag
        p.vy *= drag
        p.x += p.vx
        p.y += p.vy

        let bri: number
        if (up) {
          bri = 1
        } else {
          const dyc = p.y - apexY
          const halfW = dyc * beam
          const edge = halfW - Math.abs(p.x - apexX)
          let lit = edge / feather
          lit = lit < 0 ? 0 : lit > 1 ? 1 : lit
          lit = lit * lit * (3 - 2 * lit)
          const vAtt = 1 - 0.24 * (p.y / H)
          bri = darkFloor + (1 - darkFloor) * lit * vAtt
        }
        const rr = (p.r * bri) | 0
        const gg = (p.g * bri * 0.99) | 0
        const bb = (p.b * bri * 0.93) | 0
        ctx.fillStyle = 'rgb(' + rr + ',' + gg + ',' + bb + ')'
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.rad * bscale, 0, 6.2832)
        ctx.fill()
      }
      st.burst = null

      // visible light cone, additive over the paint
      if (!up) {
        const bottomHalf = (H - apexY) * beam
        const g = ctx.createLinearGradient(0, 0, 0, H)
        g.addColorStop(0, 'rgba(255,240,206,0.14)')
        g.addColorStop(0.5, 'rgba(255,236,196,0.05)')
        g.addColorStop(1, 'rgba(255,236,196,0)')
        ctx.globalCompositeOperation = 'lighter'
        ctx.fillStyle = g
        ctx.beginPath()
        ctx.moveTo(apexX, apexY)
        ctx.lineTo(apexX + bottomHalf, H)
        ctx.lineTo(apexX - bottomHalf, H)
        ctx.closePath()
        ctx.fill()
        ctx.globalCompositeOperation = 'source-over'
      }

      st.frames++
      if (st.frames % 8 === 0) {
        if (countRef.current)
          countRef.current.textContent = balls.length.toLocaleString()
        if (fpsRef.current)
          fpsRef.current.textContent = String(Math.round(st.fpsSmooth))
      }
    }

    let raf = requestAnimationFrame(loop)
    const ro = new ResizeObserver(resize)
    ro.observe(cv)
    resize()

    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      st.img = img
      st.imgReady = true
      buildBalls()
    }
    img.onerror = () => console.warn('Monet image failed to load')
    img.src = MONET_URL

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [st])

  const toCanvas = (e: ReactPointerEvent) => {
    const cv = canvasRef.current!
    const r = cv.getBoundingClientRect()
    return { x: (e.clientX - r.left) * st.dpr, y: (e.clientY - r.top) * st.dpr }
  }

  return {
    canvasRef,
    glowRef,
    countRef,
    fpsRef,
    labelCountRef,
    onMove: (e: ReactPointerEvent<HTMLCanvasElement>) => {
      const c = toCanvas(e)
      st.mouse.x = c.x
      st.mouse.y = c.y
      st.mouse.active = true
    },
    onLeave: () => {
      st.mouse.active = false
      st.mouse.down = false
    },
    onDown: (e: ReactPointerEvent<HTMLCanvasElement>) => {
      const c = toCanvas(e)
      st.burst = { x: c.x, y: c.y }
      st.mouse.x = c.x
      st.mouse.y = c.y
      st.mouse.active = true
      st.mouse.down = true
      try {
        e.currentTarget.setPointerCapture(e.pointerId)
      } catch {
        /* pointer capture is best-effort */
      }
    },
    onUp: () => {
      st.mouse.down = false
    },
    // steer the offscreen gallery light by moving across the whole hero
    onAim: (e: ReactPointerEvent<HTMLElement>) => {
      const cv = canvasRef.current
      if (!cv) return
      const r = cv.getBoundingClientRect()
      let f = (e.clientX - r.left) / r.width
      f = Math.max(0.3, Math.min(0.7, f))
      st.lampTargetX = f
    },
    reassemble: () => {
      for (const p of st.balls) {
        p.vx = 0
        p.vy = 0
      }
    },
    scatter: () => {
      for (const p of st.balls) {
        const a = Math.random() * 6.2832
        const s = (6 + Math.random() * 10) * st.dpr
        p.vx += Math.cos(a) * s
        p.vy += Math.sin(a) * s
      }
    },
  }
}

export type MonetEngine = ReturnType<typeof useMonetEngine>
