import React, {cloneElement, isValidElement} from 'react';
import {textFromReactNode} from './content.jsx';
import {useAttention} from './AttentionContext.jsx';

function renderNode(node, spans, cursor) {
  if (node == null || typeof node === 'boolean') return node;

  if (typeof node === 'string' || typeof node === 'number') {
    const text = String(node);
    const start = cursor.value;
    const end = start + text.length;
    cursor.value = end;
    const overlapping = spans.filter(span => span.start < end && span.end > start);
    if (!overlapping.length) return node;

    const pieces = [];
    let position = 0;
    for (const span of overlapping) {
      const localStart = Math.max(0, span.start - start);
      const localEnd = Math.min(text.length, span.end - start);
      if (localStart > position) pieces.push(text.slice(position, localStart));
      if (localEnd > Math.max(position, localStart)) {
        const pieceStart = Math.max(position, localStart);
        pieces.push(
          <span
            className="attention-highlight"
            style={{'--attention-opacity': String(span.opacity)}}
            key={`${pieceStart}-${localEnd}`}
          >
            {text.slice(pieceStart, localEnd)}
          </span>,
        );
        position = localEnd;
      }
    }
    if (position < text.length) pieces.push(text.slice(position));
    return pieces;
  }

  if (Array.isArray(node)) {
    return node.map((child, index) => {
      const rendered = renderNode(child, spans, cursor);
      return isValidElement(rendered) ? cloneElement(rendered, {key: rendered.key ?? index}) : rendered;
    });
  }

  if (isValidElement(node)) {
    return cloneElement(node, {}, renderNode(node.props.children, spans, cursor));
  }
  return node;
}

export default function AttentionText({id, children}) {
  const {getSpans} = useAttention();
  const spans = getSpans(id).filter(span => Number.isFinite(span.start) && Number.isFinite(span.end) && span.end > span.start);

  if (!spans.length) return children;

  const exactText = textFromReactNode(children);
  const validSpans = spans
    .filter(span => span.start >= 0 && span.end <= exactText.length && Number.isFinite(span.score))
    .sort((a, b) => a.start - b.start || a.end - b.end);
  if (!validSpans.length) return children;

  return renderNode(children, validSpans, {value: 0});
}
