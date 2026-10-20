import React from 'react';

export default function SiteHeader() {
  return (
    <header className="site-header">
      <a className="brand" href="#top">Vijay Kumar Hans</a>
      <nav aria-label="Main navigation">
        <a href="#work">Work</a>
        <a href="#experience">Experience</a>
        <a href="#writing">Writing</a>
        <a href="#resume">Resume</a>
      </nav>
    </header>
  );
}
