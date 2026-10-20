import React from 'react';
import SiteHeader from './SiteHeader.jsx';
import SiteFooter from './SiteFooter.jsx';

export default function BlogPage() {
  return (
    <div className="site-shell">
      <SiteHeader isBlogPage />

      <main className="blog-page">
        <section className="blog-intro">
          <div className="eyebrow">Notes and essays</div>
          <h1>Blog</h1>
          <p>Writing about things I’m learning, building, and thinking through.</p>
        </section>

        <section className="blog-posts" aria-label="Blog posts">
          <div className="blog-empty-state">
            <h2>More soon.</h2>
            <p>New writing will show up here.</p>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
