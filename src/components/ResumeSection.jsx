import React from 'react';
import { awards, coursework, experience } from '../data.jsx';
import { RecordList } from '../ui.jsx';

function ResumeSection({ id, title, items }) { return <section id={id} className="section"><h2>{title}</h2><RecordList items={items} /></section>; }

export default function ResumeSections() {
  return <><ResumeSection id="experience" title="Experience" items={experience} /><ResumeSection title="Awards" items={awards} /><ResumeSection title="Selected coursework" items={coursework} /></>;
}
