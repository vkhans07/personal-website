import React from 'react';
import { Mark } from '../ui.jsx';

export default function NowSection() {
  return <section className="now" aria-label="What I'm doing now"><div className="eyebrow now-label">Now</div><div><strong><Mark>Building tinyserve</Mark></strong><div className="muted">A small vLLM-style inference server</div></div><div><strong>CS 61A course staff</strong><div className="muted">Exam prep, discussion, office hours</div></div><div><strong>Incoming at Aven</strong><div className="muted">Engineering internship</div></div></section>;
}
