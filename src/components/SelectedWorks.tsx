import { works } from '../data/site'
import '../styles/works.css'

// Gallery II — the pop-art room. A torn cream sheet slapped over the two
// dark rooms; each piece gets a bespoke hanging treatment.
export default function SelectedWorks() {
  const [pinned, leaning, hung] = works

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
          <div className="works-caption">// pinned · leaning · hung · whispered</div>
        </div>

        <div className="works-row">
          {/* 1 · pinned poster */}
          <div className="work work--pinned">
            <div className="work-pin" />
            <div className="work-poster">
              <div className="work-poster-art">
                <div className="work-poster-halftone" />
                <div className="work-poster-circle" />
              </div>
              <div className="work-poster-caption">
                <div className="work-name">{pinned.title}</div>
                <div className="work-credit">{pinned.credit}</div>
              </div>
            </div>
          </div>

          {/* 2 · leaning canvas */}
          <div className="work work--leaning">
            <div className="work-lean-shadow" />
            <div className="work-lean-canvas">
              <div className="work-lean-art">
                <div className="work-lean-stripes" />
                <div className="work-lean-target" />
              </div>
              <div className="work-lean-caption">
                <div className="work-name work-name--yellow">{leaning.title}</div>
                <div className="work-credit work-credit--cream">{leaning.credit}</div>
              </div>
            </div>
          </div>

          {/* 3 · hung from cables */}
          <div className="work work--hung">
            <div className="work-cable work-cable--left" />
            <div className="work-cable work-cable--right" />
            <div className="work-hung-frame">
              <div className="work-hung-art">
                <div className="work-hung-stripes" />
                <div className="work-hung-glyph">C++</div>
              </div>
              <div className="work-hung-caption">
                <div className="work-name work-name--white">{hung.title}</div>
                <div className="work-credit work-credit--yellow">{hung.credit}</div>
              </div>
            </div>
          </div>

          {/* 4 · text only */}
          <div className="work work--text">
            <div className="work-manifesto">
              <span className="work-manifesto-black">Make</span>
              <span className="work-manifesto-red">it</span>
              <span className="work-manifesto-blue">fast.</span>
            </div>
            <div className="work-manifesto-note">
              An ongoing manifesto — low-latency &amp; graphics experiments,
              published when they work.
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
    </section>
  )
}
