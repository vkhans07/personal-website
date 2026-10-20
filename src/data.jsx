import React from 'react';
import { Mark } from './ui.jsx';

export const projects = [
  { title: 'tinyserve', description: <>Mini inference server, built up step by step: <Mark>continuous batching</Mark>, <Mark>paged KV cache</Mark>, prefix caching. Main question is cache hit rate vs <Mark>tail latency</Mark> when bursty traffic shares long prompts.</>, meta: <>Python, CUDA<br />In progress</>, preview: 'p99 latency vs. batch size chart' },
  { title: 'Clinician availability forecasting', description: <><Mark>Discrete-time survival model</Mark> fit on 2,400 provider-weeks at StellarSleep. Backtests showed <Mark>54% lower error</Mark> on total available hours, cheap enough to refit constantly.</>, meta: <>Python, SQL<br />Summer 2026</>, preview: 'Backtest: forecast vs. actual hours' },
  { title: 'Ray tracer', description: <>Written from scratch in <Mark>C++</Mark>, multithreaded on the CPU, then <Mark>ported to CUDA</Mark>.</>, meta: <>C++, CUDA</>, preview: 'A render from the tracer' },
  { title: 'Muscel', description: <>Fitness app with <Mark>1RM prediction</Mark> and <Mark>offline-first sync</Mark> through a durable local outbox. Lead engineer; 140 registered users.</>, meta: <>React Native, FastAPI<br />muscel.net</>, preview: 'App screenshots' },
  { title: 'Word Hunt solver', description: <>Reads the board with a <Mark>small CNN</Mark>, searches it with a <Mark>trie and DFS</Mark>, then plays the words itself.</>, meta: <>Python, PyTorch<br />Click to explore</>, preview: 'Word Hunt solver', wordHunt: true },
  { title: 'BS Poker', description: <><Mark>Real-time multiplayer bluffing game</Mark> over <Mark>WebSockets</Mark>, being rebuilt by hand.</>, meta: <>Node, React</>, preview: 'Gameplay clip' },
];

export const experience = [['Aven', 'Engineering intern, incoming', '[Dates]'], ['CS 61A, UC Berkeley', 'Course staff (UCS1)', 'Fall 2026'], ['StellarSleep (YC S23)', 'Software and data engineering intern', 'Summer 2026'], ['CS Mentors', <>Tech committee, <Mark>backend and scheduling</Mark></>, '2026']];
export const awards = [["Dean's List", 'Haas School of Business and College of Engineering', '[Year]'], ['USAPhO Semifinalist', 'US Physics Olympiad', '[Year]'], ['AIME Qualifier', 'American Invitational Mathematics Examination', '[Year]'], ['NACLO Top 100', 'North American Computational Linguistics Olympiad', '[Year]']];
export const coursework = [['CS 170', 'Efficient Algorithms and Intractable Problems', 'In progress'], ['EECS 126', 'Probability and Random Processes', 'In progress'], ['CS 61C', 'Great Ideas in Computer Architecture', 'In progress'], ['CS 70', 'Discrete Mathematics and Probability Theory', 'Completed'], ['CS 61B', 'Data Structures', 'Completed'], ['Math 54', 'Linear Algebra and Differential Equations', 'Completed']];
