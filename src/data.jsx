import React from 'react';
import {Mark} from './ui.jsx';

export const projects = [
  {
    title: 'tinyserve',
    description: (
      <>
        Mini inference server, built up step by step: <Mark>continuous batching</Mark>,{' '}
        <Mark>paged KV cache</Mark>, prefix caching. Main question is cache hit rate vs{' '}
        <Mark>tail latency</Mark> when bursty traffic shares long prompts.
      </>
    ),
    meta: <>Python, CUDA<br />In progress</>,
    preview: 'speedup upon KV caching',
  },
  {
    title: 'Ray Tracer',
    description: (
      <>
        Written from scratch in <Mark>C++</Mark>, multithreaded on the CPU, then{' '}
        <Mark>ported to CUDA</Mark>.
      </>
    ),
    meta: <>C++, CUDA</>,
    preview: 'A render from the tracer',
  },
  {
    title: 'Muscel',
    description: (
      <>
        Fitness app with <Mark>1RM prediction</Mark> and <Mark>offline-first sync</Mark> through
        a durable local outbox. Lead engineer; 140 registered users.
      </>
    ),
    meta: <>React Native, FastAPI<br />muscel.net</>,
    preview: 'App screenshots',
  },
  {
    title: 'Word Hunt solver',
    description: (
      <>
        Reads the board with a <Mark>small CNN</Mark>, searches it with a <Mark>trie and DFS</Mark>,
        then plays the words itself.
      </>
    ),
    meta: <>Python, PyTorch<br />Click to explore</>,
    preview: 'Word Hunt solver',
    wordHunt: true,
  },
];

export const experience = [
  ['CS 61A, UC Berkeley', 'Course Staff (UCS1)', 'Fall 2026'],
  [
    'CS Mentors',
    <>Tech committee, <Mark>Backend</Mark></>,
    'Fall 2026',
  ],
    ['Berkeley Institute for Data Science', 'Research Intern', 'Fall 2026'],
  ['StellarSleep (YC S23)', 'Software & Data Engineering Intern', 'Summer 2026'],
    ['CAHLR', 'Content Team Intern', 'Spring 2026'],
    ['Mu Alpha Theta', 'Math & Stats Test Writer', '2025 & 2026']
];

export const awards = [
  ["Dean's List", 'Haas School of Business and College of Engineering', 'Spring 2026'],
  ['USAPhO Semifinalist', 'US Physics Olympiad', '2024'],
  ['AIME Qualifier, AMC Distinction', 'American Invitational Mathematics Examination', '2022-2025'],
  ['NACLO Top 100', 'North American Computational Linguistics Olympiad', '2022-2025'],
];

export const coursework = [
  ['CS 170', 'Efficient Algorithms and Intractable Problems', 'In progress'],
  ['EECS 126', 'Probability and Random Processes', 'In progress'],
  ['CS 61C', 'Great Ideas in Computer Architecture', 'In progress'],
  ['CS 70', 'Discrete Mathematics and Probability Theory', 'A'],
  ['CS 61B', 'Data Structures', 'A'],
  ['PHYS 5B', 'Electromagnetism, Waves, and Optics', 'A+'],
];

