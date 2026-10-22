import React from 'react';
import {awards, coursework, experience} from '../data.jsx';
import {RecordList} from '../ui.jsx';
import AttentionText from '../attention/AttentionText.jsx';

function ResumeSection({ id, title, items }) {
  return (
    <section id={id} className="section">
      <h2>{title}</h2>
      <RecordList items={items} />
    </section>
  );
}

function ExperienceList({ items }) {
  return (
    <div className="experience-list">
      {items.map(({ id, organization, role, date, bullets }) => (
        <ExperienceItem key={id} {...{id, organization, role, date, bullets}} />
      ))}
    </div>
  );
}

function ExperienceItem({id, organization, role, date, bullets}) {
  const [open, setOpen] = React.useState(false);
  const triggerId = `experience-trigger-${id}`;
  const panelId = `experience-panel-${id}`;

  return (
    <div className="experience-item" data-open={open}>
      <button
        id={triggerId}
        className="experience-summary"
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen(value => !value)}
      >
        <span className="row-name">{organization}</span>
        <span className="row-desc">{role}</span>
        <span className="row-date">{date}</span>
      </button>
      <div
        id={panelId}
        className="experience-content"
        role="region"
        aria-labelledby={triggerId}
        aria-hidden={!open}
      >
        <div className="experience-content-inner">
          <ul className="experience-bullets">
            {bullets.map((bullet, index) => (
              <li key={index}>
                <AttentionText id={`experience.${id}.bullet.${index + 1}`}>{bullet}</AttentionText>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function ResumeSections() {
  return (
    <>
      <section id="experience" className="section">
        <h2>Experience</h2>
        <ExperienceList items={experience} />
      </section>
      <ResumeSection title="Awards" items={awards} />
      <ResumeSection title="Selected coursework" items={coursework} />
    </>
  );
}
