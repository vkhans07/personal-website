import { site } from '../data/site'
import '../styles/colophon.css'

// The didactic wall text + brass plaque that closes the gallery.
export default function Colophon() {
  const statement = site.aboutStatement
  const first = statement.charAt(0)
  const rest = statement.slice(1)

  return (
    <section id="note" className="colophon">
      <div className="colophon-glow" />
      <div className="colophon-inner">
        <div className="colophon-kicker">About the Artist</div>
        <div className="colophon-rule" />
        <p className="colophon-statement">
          <span className="colophon-dropcap">{first}</span>
          {rest}
        </p>
        <div className="colophon-signature">— {site.name}</div>
      </div>
      <div className="colophon-plaque-row">
        <div className="colophon-plaque">
          <span className="colophon-plaque-title">{site.plaque.title}</span>
          <span className="colophon-plaque-sub">{site.plaque.subtitle}</span>
        </div>
      </div>
    </section>
  )
}
