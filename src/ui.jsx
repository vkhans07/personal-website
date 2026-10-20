import React from 'react';

export function Mark({ children }) {
  return <span className="mark">{children}</span>;
}

export function SectionHeading({ children, aside }) {
  return (
    <div className="section-heading">
      <h2>{children}</h2>
      {aside && <span className="eyebrow">{aside}</span>}
    </div>
  );
}

export function RecordList({ items }) {
  return (
    <div className="record-list">
      {items.map(([name, description, date]) => (
        <div className="data-row" key={name}>
          <span className="row-name">{name}</span>
          <span className="row-desc">{description}</span>
          <span className="row-date">{date}</span>
        </div>
      ))}
    </div>
  );
}
