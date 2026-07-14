import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { works } from '../data/site'
import type { Work } from '../data/site'
import { useScrollLag } from '../hooks/useScrollLag'
import '../styles/works.css'

// A piece's frame is a button that opens the frosted detail panel.
function FrameButton({
  onOpen,
  className,
  children,
}: {
  onOpen: () => void
  className: string
  children: ReactNode
}) {
  return (
    <button type="button" className={`${className} work-open`} onClick={onOpen}>
      {children}
    </button>
  )
}

// Frosted-glass detail panel. Portaled to <body> so the fixed overlay
// escapes the section's transforms (the hung piece sways and lags).
function WorkPanel({ work, onClose }: { work: Work; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [onClose])

  return createPortal(
    <div className="work-panel-backdrop" onClick={onClose}>
      <div
        className="work-panel"
        role="dialog"
        aria-modal="true"
        aria-label={work.title}
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="work-panel-close" onClick={onClose} aria-label="Close">
          ×
        </button>
        {work.image && (
          <img className="work-panel-img" src={work.image} alt={work.imageAlt ?? work.title} />
        )}
        <div className="work-panel-credit">{work.credit}</div>
        <h3 className="work-panel-title">{work.title}</h3>
        {work.description && <p className="work-panel-desc">{work.description}</p>}
        {work.href && (
          <a className="work-panel-visit" href={work.href} target="_blank" rel="noreferrer">
            Visit the project ↗
          </a>
        )}
      </div>
    </div>,
    document.body,
  )
}

// Gallery II — the pop-art room. A torn cream sheet slapped over the two
// dark rooms; each piece gets a bespoke hanging treatment.
export default function SelectedWorks() {
  const [pinned, leaning, hung] = works
  const [active, setActive] = useState<Work | null>(null)
  // the cable-hung piece rides the scroll loosely, on top of its sway
  const hungLag = useScrollLag<HTMLDivElement>(0.16)

  return (
    <section id="works" className="works">
      <div className="works-sheet">
        <div className="works-sheet-dot" />
        <div className="works-sheet-square" />
      </div>

      <div className="works-inner">
        <div className="works-head">
          <div>
            <span className="works-tag">GALLERY II</span>
            <h2 className="works-title">
              Selected
              <br />
              Works
            </h2>
          </div>
        </div>

        <div className="works-row">
          {/* 1 · pinned poster */}
          <div className="work work--pinned">
            <div className="work-pin" />
            <FrameButton onOpen={() => setActive(pinned)} className="work-poster">
              <div className="work-poster-art">
                {pinned.image ? (
                  <img className="work-art-img" src={pinned.image} alt={pinned.imageAlt ?? pinned.title} />
                ) : (
                  <>
                    <div className="work-poster-halftone" />
                    <div className="work-poster-circle" />
                  </>
                )}
              </div>
              <div className="work-poster-caption">
                <div className="work-name">{pinned.title}</div>
                <div className="work-credit">{pinned.credit}</div>
              </div>
            </FrameButton>
          </div>

          {/* 2 · leaning canvas */}
          <div className="work work--leaning">
            <div className="work-lean-shadow" />
            <FrameButton onOpen={() => setActive(leaning)} className="work-lean-canvas">
              <div className="work-lean-art">
                {leaning.image ? (
                  <img className="work-art-img" src={leaning.image} alt={leaning.imageAlt ?? leaning.title} />
                ) : (
                  <>
                    <div className="work-lean-stripes" />
                    <div className="work-lean-target" />
                  </>
                )}
              </div>
              <div className="work-lean-caption">
                <div className="work-name work-name--yellow">{leaning.title}</div>
                <div className="work-credit work-credit--cream">{leaning.credit}</div>
              </div>
            </FrameButton>
          </div>

          {/* 3 · hung from cables */}
          <div ref={hungLag} className="work work--hung">
            <div className="work-cable work-cable--left" />
            <div className="work-cable work-cable--right" />
            <FrameButton onOpen={() => setActive(hung)} className="work-hung-frame">
              <div className="work-hung-art">
                {hung.image ? (
                  <img className="work-art-img" src={hung.image} alt={hung.imageAlt ?? hung.title} />
                ) : (
                  <>
                    <div className="work-hung-stripes" />
                    <div className="work-hung-glyph">hard to picture</div>
                  </>
                )}
              </div>
              <div className="work-hung-caption">
                <div className="work-name work-name--white">{hung.title}</div>
                <div className="work-credit work-credit--yellow">{hung.credit}</div>
              </div>
            </FrameButton>
          </div>

          {/* 4 · text only */}
          <div className="work work--text">
            <div className="work-manifesto">
              <span className="work-manifesto-black">more</span>
              <span className="work-manifesto-red">coming</span>
              <span className="work-manifesto-blue">soon</span>
            </div>
            <div className="work-manifesto-note">
              pieces get hung when they're ready!
            </div>
          </div>

          {/* 5 · almost invisible */}
          <div className="work work--ghost">
            <div className="work-ghost-frame">
              <div className="work-ghost-label">
                Untitled
                <br />
                (in progress)
              </div>
            </div>
          </div>
        </div>
      </div>

      {active && <WorkPanel work={active} onClose={() => setActive(null)} />}
    </section>
  )
}
