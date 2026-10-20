import React from 'react';
import {awards, coursework, experience} from '../data.jsx';
import {RecordList} from '../ui.jsx';

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
      {items.map(({ organization, role, date, bullets }) => (
        <details className="experience-item" key={organization}>
          <summary className="experience-summary">
            <span className="row-name">{organization}</span>
            <span className="row-desc">{role}</span>
            <span className="row-date">{date}</span>
          </summary>
          <ul className="experience-bullets">
            {bullets.map(bullet => <li key={bullet}>{bullet}</li>)}
          </ul>
        </details>
      ))}
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
