import React from 'react';
import { Mark } from '../ui.jsx';

export default function SiteFooter() {
  return <footer id="resume"><div className="footer-links"><a href="mailto:hello@vijayhans.com">Email</a><a href="https://github.com/">GitHub</a><a href="https://linkedin.com/">LinkedIn</a><a href="#resume">Resume (PDF)</a></div><div className="footer-bottom"><span>Berkeley, CA</span><a href="https://collection.vijayhans.com">The old site, <Mark>The Collection</Mark>, lives on at collection.vijayhans.com ↗</a></div></footer>;
}
