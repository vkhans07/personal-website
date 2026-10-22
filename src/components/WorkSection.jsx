import React, {useState} from 'react';
import {experience, projects} from '../data.jsx';
import {Mark, SectionHeading} from '../ui.jsx';
import AttentionText from '../attention/AttentionText.jsx';

function ProjectCard({project, open, onToggle, onWordHunt}) {
  const panelId = `project-details-${project.id}`;
  const resumeEntry = project.details?.resumeExperienceId
    ? experience.find(item => item.id === project.details.resumeExperienceId)
    : null;

  return (
    <article className="project-item" data-open={open}>
      <button
        type="button"
        className="project-summary"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={onToggle}
      >
        <span className="project-title">{project.title}</span>
        <span className="project-description">
          <AttentionText id={`project.${project.id}.description`}>{project.description}</AttentionText>
        </span>
        <span className="project-meta">{project.meta}</span>
      </button>

      <div id={panelId} className="project-details" aria-hidden={!open} inert={!open}>
        <div className="project-details-inner">
          {project.details?.paragraphs?.map((paragraph, index) => <p key={index}>{paragraph}</p>)}

          {project.details?.highlights?.length > 0 && (
            <ul className="project-highlights">
              {project.details.highlights.map(highlight => <li key={highlight}>{highlight}</li>)}
            </ul>
          )}

          {resumeEntry && (
            <div className="project-resume-context">
              <div className="eyebrow">From experience · {resumeEntry.organization} · {resumeEntry.date}</div>
              <ul className="project-highlights">
                {resumeEntry.bullets.map(bullet => <li key={bullet}>{bullet}</li>)}
              </ul>
            </div>
          )}

          {project.details?.images?.length > 0 && (
            <div className="project-gallery">
              {project.details.images.map(({src, alt, caption}, index) => (
                <figure key={`${src}-${index}`}>
                  <img src={src} alt={alt} loading="lazy" />
                  {caption && <figcaption>{caption}</figcaption>}
                </figure>
              ))}
            </div>
          )}

          {(project.details?.links?.length > 0 || project.wordHunt) && (
            <div className="project-actions">
              {project.details.links?.map(link => (
                <a key={link.href} href={link.href} target="_blank" rel="noreferrer">{link.label} ↗</a>
              ))}
              {project.wordHunt && <button type="button" onClick={onWordHunt}>Play the Word Hunt challenge →</button>}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

export default function WorkSection({onWordHunt}) {
  const [openProjects, setOpenProjects] = useState(() => new Set());

  function toggleProject(id) {
    setOpenProjects(current => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <section id="work" className="section work-section">
      <SectionHeading aside="Click a project to explore">Selected work</SectionHeading>

      <div className="project-list">
        {projects.map(project => (
          <ProjectCard
            key={project.id}
            project={project}
            open={openProjects.has(project.id)}
            onToggle={() => toggleProject(project.id)}
            onWordHunt={onWordHunt}
          />
        ))}
      </div>

      <p className="also">
        Also: <Mark>Timer Duels</Mark> (Roblox, Lua dev), an{' '}
        <Mark>LLM curriculum pipeline</Mark> for OATutor, an{' '}
        <Mark>M&amp;A pairs-trade event study</Mark>.
      </p>
    </section>
  );
}
