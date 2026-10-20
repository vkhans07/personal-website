import React from 'react';

export default function SiteHeader({ isBlogPage = false }) {
  return (
    <header className="site-header">
      <a className="brand" href="/">Vijay Kumar Hans</a>
      <nav aria-label="Main navigation">
        {isBlogPage ? (
          <a href="/">Home</a>
        ) : (
          <>
            <a href="#work">Work</a>
            <a href="#experience">Experience</a>
            <a href="/blog/">Writing</a>
            <a href="#resume">Resume</a>
          </>
        )}
      </nav>
    </header>
  );
}
