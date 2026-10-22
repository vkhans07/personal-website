import React, {createContext, useContext, useEffect, useMemo, useState} from 'react';
import {getAttentionBlocks, getAttentionCorpusText, HERO_ATTENTION_QUERY} from './content.jsx';

const AttentionContext = createContext(null);
const MANIFEST_URL = '/attention-scores.json';
const MIN_RELATIVE_ATTENTION = 0.2;
const MIN_RELATIVE_SIMILARITY = 0.78;
const NON_DISTINCTIVE_TERMS = new Set(['a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from', 'in', 'is', 'it', 'of', 'on', 'or', 'the', 'to', 'with']);

async function sha256(text) {
  const bytes = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return `sha256:${Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('')}`;
}

export function AttentionProvider({children}) {
  const [manifest, setManifest] = useState(null);
  const [activeQuery, setActiveQuery] = useState(null);
  const [activeMode, setActiveMode] = useState('attention');
  const [pinned, setPinned] = useState(false);

  // Read the word under the pointer from the page's existing text, so every
  // visible word can be a similarity source without changing its markup.
  useEffect(() => {
    const wordAt = event => {
      const interactive = event.target.closest('button, input, textarea, select, [contenteditable="true"]');
      if (interactive) return null;
      const doc = event.target.ownerDocument;
      const range = doc.caretRangeFromPoint?.(event.clientX, event.clientY)
        ?? doc.caretPositionFromPoint?.(event.clientX, event.clientY);
      const node = range?.startContainer ?? range?.offsetNode;
      const offset = range?.startOffset ?? range?.offset;
      if (!node || node.nodeType !== Node.TEXT_NODE) return null;
      const text = node.textContent ?? '';
      const match = [...text.matchAll(/[\p{L}\p{N}][\p{L}\p{N}'’_-]*/gu)]
        .find(item => item.index <= offset && item.index + item[0].length >= offset);
      return match?.[0] ?? null;
    };
    const onMove = event => {
      if (activeMode !== 'similarity' || pinned) return;
      const word = wordAt(event);
      const term = word?.normalize('NFKC').toLocaleLowerCase('en-US');
      setActiveQuery(term && !NON_DISTINCTIVE_TERMS.has(term) ? `term:${term}` : null);
    };
    const onClick = event => {
      if (activeMode !== 'similarity') return;
      const word = wordAt(event);
      if (!word) return;
      const query = `term:${word.normalize('NFKC').toLocaleLowerCase('en-US')}`;
      if (NON_DISTINCTIVE_TERMS.has(query.slice(5))) return;
      if (pinned && activeQuery === query) setPinned(false);
      else { setActiveQuery(query); setPinned(true); }
    };
    document.addEventListener('pointermove', onMove, true);
    document.addEventListener('click', onClick, true);
    return () => {
      document.removeEventListener('pointermove', onMove, true);
      document.removeEventListener('click', onClick, true);
    };
  }, [activeMode, activeQuery, pinned]);

  useEffect(() => {
    let cancelled = false;

    async function loadScores() {
      try {
        const response = await fetch(MANIFEST_URL, {cache: 'no-cache'});
        if (!response.ok) return;
        const candidate = await response.json();
        if (candidate.schemaVersion !== 2 || candidate.method?.offsetUnit !== 'utf16' || !candidate.queries?.attention || !candidate.queries?.similarity || !candidate.contentHashes) return;

        const blocks = getAttentionBlocks();
        const expected = new Map(await Promise.all([
          ...blocks.map(async block => [block.id, await sha256(block.text)]),
          ['$hero', await sha256(HERO_ATTENTION_QUERY)],
        ]));
        if (candidate.contentHash !== await sha256(getAttentionCorpusText(blocks))) return;
        const validHashes = new Set(
          [...expected].filter(([id, hash]) => candidate.contentHashes[id] === hash).map(([id]) => id),
        );

        if (!cancelled) setManifest({...candidate, validHashes});
      } catch {
        // A missing artifact or hashing/fetch failure leaves the page unhighlighted.
      }
    }

    loadScores();
    return () => { cancelled = true; };
  }, []);

  const value = useMemo(() => ({
    activeQuery,
    setActiveQuery,
    pinned,
    setPinned,
    activeMode,
    setActiveMode,
    getSpans(contentId) {
      if (!manifest?.validHashes.has(contentId)) return [];
      const modeQueries = manifest.queries[activeMode];
      const isActive = Boolean(activeQuery && (modeQueries?.[activeQuery] || (activeMode === 'similarity' && activeQuery.startsWith('term:'))));
      // Keep the same text wrappers mounted while idle so highlights can fade out.
      let query = isActive ? modeQueries[activeQuery] : modeQueries?.[Object.keys(modeQueries ?? {})[0]];
      if (activeMode === 'similarity' && activeQuery?.startsWith('term:')) {
        const term = activeQuery.slice(5);
        const blocks = getAttentionBlocks();
        query = Object.fromEntries(blocks.map(block => [block.id,
          [...block.text.matchAll(/[\p{L}\p{N}][\p{L}\p{N}'’_-]*/gu)]
            .filter(match => match[0].normalize('NFKC').toLocaleLowerCase('en-US') === term)
            .map(match => ({start: match.index, end: match.index + match[0].length, score: 1})),
        ]));
      }
      if (!query) return [];
      const spans = query?.[contentId] ?? [];
      const maxScore = Math.max(0, ...Object.values(query ?? {}).flat().map(span => span.score));
      if (maxScore <= 0) return [];

      return spans
        .map(span => ({span, relativeScore: Math.max(0, span.score) / maxScore}))
        .map(({span, relativeScore}) => ({
          ...span,
          opacity: isActive && relativeScore >= (activeMode === 'similarity' ? MIN_RELATIVE_SIMILARITY : MIN_RELATIVE_ATTENTION)
            ? activeMode === 'similarity'
              ? 0.12 + Math.pow(relativeScore, 5) * 0.5
              : 0.06 + Math.sqrt(relativeScore) * 0.36
            : 0,
        }));
    },
  }), [activeMode, activeQuery, manifest]);

  return <AttentionContext.Provider value={value}>{children}</AttentionContext.Provider>;
}

export function useAttention() {
  const context = useContext(AttentionContext);
  if (!context) throw new Error('Attention components must be inside AttentionProvider.');
  return context;
}
