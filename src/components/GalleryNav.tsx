import { site } from '../data/site'
import { navTo } from '../lib/scroll'
import '../styles/nav.css'

export default function GalleryNav() {
  return (
    <nav className="nav">
      <a href="#top" onClick={navTo('top')} className="nav-brand">
        {site.navBrand}
      </a>
      <div className="nav-links">
        <a href="#works" onClick={navTo('works')}>Works</a>
        <a href="#reading" onClick={navTo('reading')}>Writing</a>
      </div>
    </nav>
  )
}
