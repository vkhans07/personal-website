import React from 'react';
import {HERO_ATTENTION_QUERY} from '../attention/content.jsx';
import {useAttention} from '../attention/AttentionContext.jsx';

export default function HeroSection() {
  const {activeQuery, setActiveQuery, activeMode, setActiveMode, pinned, setPinned} = useAttention();
  const words = [...HERO_ATTENTION_QUERY.matchAll(/\S+/gu)];

  return (
    <section className="hero">
      <h1 aria-label={HERO_ATTENTION_QUERY}>
        {words.map(([word], index) => {
          const start = words[index].index;
          const end = start + word.length;
          const queryId = `hero-word-${index}`;
          const priorEnd = index === 0 ? 0 : words[index - 1].index + words[index - 1][0].length;
          return <React.Fragment key={queryId}>
            {HERO_ATTENTION_QUERY.slice(priorEnd, start)}
            <button
              type="button"
              className="hero-word"
              aria-label={`Attend to “${word}”`}
              aria-pressed={activeQuery === queryId}
              onPointerEnter={() => { if (!pinned) setActiveQuery(queryId); }}
              onPointerLeave={() => { if (!pinned) setActiveQuery(null); }}
              onFocus={() => setActiveQuery(queryId)}
              onBlur={() => { if (!pinned) setActiveQuery(null); }}
              onClick={() => {
                if (pinned && activeQuery === queryId) setPinned(false);
                else { setActiveQuery(queryId); setPinned(true); }
              }}
            >
              {HERO_ATTENTION_QUERY.slice(start, end)}
            </button>
          </React.Fragment>;
        })}
      </h1>
      <p className="hint attention-mode-picker">
        <button
          type="button"
          className="attention-mode-option"
          aria-pressed={activeMode === 'attention'}
          onClick={() => setActiveMode('attention')}
        >
          Hover over a word and pay attention.
        </button>
        <span aria-hidden="true"> | </span>
        <button
          type="button"
          className="attention-mode-option"
          aria-pressed={activeMode === 'similarity'}
          onClick={() => setActiveMode('similarity')}
        >
          See relationships in my work.
        </button>
      </p>
      <p className="intro">
        Studying in Berkeley's M.E.T. program. Background in competition math and physics, developing in CS and ML.
      </p>
    </section>
  );
}
