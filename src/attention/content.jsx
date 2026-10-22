import React from 'react';
import {experience, projects} from '../data.jsx';

export const HERO_ATTENTION_QUERY =
  'Interested in machine learning systems, learning theory, games, and art.';

export function textFromReactNode(node) {
  if (node == null || typeof node === 'boolean') return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(textFromReactNode).join('');
  if (React.isValidElement(node)) {
    if (node.type === 'br') return '\n';
    return textFromReactNode(node.props.children);
  }
  return '';
}

// This is also used by the offline score generator, so model offsets always
// come from the same React content that the page renders.
export function getAttentionBlocks() {
  return [
    ...projects.map(project => ({
      id: `project.${project.id}.description`,
      text: textFromReactNode(project.description),
    })),
    ...experience.flatMap(item => item.bullets.map((bullet, index) => ({
      id: `experience.${item.id}.bullet.${index + 1}`,
      text: bullet,
    }))),
  ];
}

export function getAttentionCorpusText(blocks = getAttentionBlocks(), heroQuery = HERO_ATTENTION_QUERY) {
  return [...blocks.flatMap(block => [block.id, block.text]), '$hero', heroQuery].join('\0');
}
