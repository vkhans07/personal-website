import { posts } from '../data/site'
import '../styles/catalogue.css'

// Gallery III — the color-field room. Writing entries drift left / right /
// center under huge ghost numerals.
export default function Catalogue() {
  return (
    <section id="reading" className="catalogue">
      <div className="catalogue-wash catalogue-wash--1" />
      <div className="catalogue-wash catalogue-wash--2" />
      <div className="catalogue-wash catalogue-wash--3" />
      <div className="catalogue-vignette" />

      <div className="catalogue-inner">
        <div className="catalogue-head">
          <div className="catalogue-kicker">Gallery III</div>
          <h2 className="catalogue-title">The Catalogue</h2>
        </div>

        {posts.map((post, i) => (
          <a
            key={post.title}
            href={post.href ?? '#reading'}
            className={`cat-entry cat-entry--${post.align}`}
          >
            <div className="cat-entry-num">{String(i + 1).padStart(2, '0')}</div>
            <div className="cat-entry-body">
              <div className="cat-entry-rule" style={{ background: post.accent }} />
              <h3 className="cat-entry-title">{post.title}</h3>
              <p className="cat-entry-blurb">{post.blurb}</p>
              <div className="cat-entry-year">{post.year} &nbsp;→</div>
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}
