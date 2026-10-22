import React from 'react';
import {Mark} from './ui.jsx';

export const projects = [
  {
    id: 'tinyserve',
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
    id: 'ray-tracer',
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
    id: 'muscel',
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
    id: 'word-hunt-solver',
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
  {
    id: 'cs-61a',
    organization: 'CS 61A, UC Berkeley',
    role: 'Course Staff (UCS1)',
    date: 'Fall 2026',
    bullets: [
      'Help students prepare for exams.',
      'Lead course discussions and office hours.',
    ],
  },
  {
    id: 'cs-mentors',
    organization: 'CS Mentors',
    role: 'Tech committee',
    date: 'Fall 2026',
    bullets: ['Contribute to backend development and scheduling.'],
  },
  {
    id: 'bids',
    organization: 'Berkeley Institute for Data Science',
    role: 'Research Intern',
    date: 'Fall 2026',
    bullets: ['Work on AI pipelines and fine-tuning.'],
  },
  {
    id: 'stellarsleep',
    organization: 'StellarSleep (YC S23)',
    role: 'Software & Data Engineering Intern',
    date: 'Summer 2026',
    bullets: [
      'Built a clinician availability forecasting model using discrete-time survival analysis.',
      'Fit and evaluated the model on 2,400 provider-weeks.',
      'Backtests reduced error on total available hours by 54%.',
    ],
  },
  {
    id: 'cahlr',
    organization: 'CAHLR',
    role: 'Content Team Intern',
    date: 'Spring 2026',
    bullets: ['Contributed to the content team.'],
  },
  {
    id: 'mu-alpha-theta',
    organization: 'Mu Alpha Theta',
    role: 'Math & Stats Test Writer',
    date: '2025 & 2026',
    bullets: ['Write math and statistics test questions.'],
  },
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

