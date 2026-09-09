import { site, links } from '../data/site'
import Pegs from './Pegs'
import Webring from './Webring'
export default function IdentityPanel() {
  return (
    <div className="wall-panel wall-panel--identity">
      <Pegs />
      <h1 className="identity-name">
        {site.nameLines.map((line, i) => (
          <span key={i}>
            {line}
            {i < site.nameLines.length - 1 && <br />}
          </span>
        ))}
      </h1>
      <div className="panel-rule" />
      <p className="identity-bio">{site.bio}</p>
      <div className="identity-status">{site.status}</div>
      <div className="panel-rule panel-rule--tight" />
      {links.map((l) => (
        <a
          key={l.label}
          href={l.href}
          target={l.href.startsWith('http') ? '_blank' : undefined}
          rel="noreferrer"
          className="identity-link"
        >
          <span className="identity-link-label">{l.label}</span>
          <span className="identity-link-handle">
            {l.handle}
            <span className="identity-link-arrow">↗</span>
          </span>
        </a>
      ))}
      <Webring></Webring>
    </div>
  )
}
