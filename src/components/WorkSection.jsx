import React, {useState} from 'react';
import {projects} from '../data.jsx';
import {Mark, SectionHeading} from '../ui.jsx';

function ProjectCard({ project, onPreview, onWordHunt }) {
  function handleClick(event) {
    event.preventDefault();

    if (project.wordHunt) {
      onWordHunt();
    }
  }

  return (
    <a
      href={project.wordHunt ? '#wordhunt' : '#work'}
      className="project"
      onMouseEnter={() => onPreview(project.preview)}
      onMouseLeave={() => onPreview(null)}
      onClick={handleClick}
    >
      <span className="project-title">{project.title}</span>
      <span className="project-description">{project.description}</span>
      <span className="project-meta">{project.meta}</span>
    </a>
  );
}

export default function WorkSection({ onWordHunt }) {
  const [preview, setPreview] = useState(null);
  return (
    <section id="work" className="section work-section">
      <SectionHeading aside="Hover for a preview">Selected work</SectionHeading>

      <div className="project-list">
        {projects.map(project => (
          <ProjectCard
            key={project.title}
            project={project}
            onPreview={setPreview}
            onWordHunt={onWordHunt}
          />
        ))}
      </div>

      {preview && (
        <div className="preview-card" aria-hidden="true">
          <span className="eyebrow">Preview</span>
          <span>{preview}</span>
        </div>
      )}

      <p className="also">
        Also: <Mark>Timer Duels</Mark> (Roblox, Lua dev), an{' '}
        <Mark>LLM curriculum pipeline</Mark> for OATutor, an{' '}
        <Mark>M&amp;A pairs-trade event study</Mark>.
      </p>
    </section>
  );
}
