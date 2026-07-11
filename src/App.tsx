import GalleryNav from './components/GalleryNav'
import Hero from './components/Hero'
import SelectedWorks from './components/SelectedWorks'
import Catalogue from './components/Catalogue'
import Colophon from './components/Colophon'

export default function App() {
  return (
    <div className="site">
      <GalleryNav />
      <Hero />
      <SelectedWorks />
      <Catalogue />
      <div className="catalogue-fade" />
      <Colophon />
    </div>
  )
}
