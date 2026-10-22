import React from 'react';
export default function NowSection() {
  return <section className="now" aria-label="What I'm doing now">
    <div className="eyebrow now-label">Now</div>
    <div><strong>Incrementing on tinyserve</strong>
      <div className="muted">A small vLLM-style inference server</div>
    </div>
    <div><strong>CS 61A Course Staff</strong>
      <div className="muted">Exam prep, discussion, office hours</div>
    </div>
    <div><strong>Research @ BIDS</strong>
      <div className="muted">AI pipelines & fine tuning</div>
    </div>
  </section>;
}
