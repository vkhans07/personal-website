import { site } from '../data/site'
import '../styles/colophon.css'

// The brass plaque that closes the gallery.
export default function Colophon() {
  return (
    <section id="note" className="colophon">
      <div className="colophon-glow" />
      <div className="colophon-plaque-row">
        <div className="colophon-plaque">
          <span className="colophon-plaque-title">{site.plaque.title}</span>
          <span className="colophon-plaque-sub">{site.plaque.subtitle}</span>
        </div>
      </div>
    </section>
  )
}
