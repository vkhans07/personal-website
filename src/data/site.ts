// All the words on the site live here — swap in your real name, links,
// and writing without touching the components.

export const site = {
  name: 'Your Name',
  nameLines: ['Your', 'Name'],
  navBrand: 'Your Name — The Collection',
  bio: "Hi! I'm studying EECS + Business at Berkeley, graduating 2026. I like the machinery under hard things — model internals, physics, and the low-latency edges of systems.",
  status: "Recruiting for '26 · lifting heavy · low-latency & graphics",
  plaque: {
    title: 'The Collection of Your Name',
    subtitle: 'Berkeley · MMXXVI · say hello',
  },
}

export interface SocialLink {
  label: string
  handle: string
  href: string
}

export const links: SocialLink[] = [
  { label: 'GitHub', handle: '@your-handle', href: 'https://github.com/your-handle' },
  { label: 'LinkedIn', handle: '/in/your-name', href: 'https://linkedin.com/in/your-name' },
  { label: 'Résumé', handle: 'pdf', href: '/resume.pdf' },
  { label: 'Email', handle: 'you@berkeley.edu', href: 'mailto:you@berkeley.edu' },
]

export interface Work {
  title: string
  credit: string
  href?: string
}

// The three hero pieces in the pop-art room; their bespoke visual treatments
// (pinned / leaning / hung) live in SelectedWorks.tsx.
export const works: Work[] = [
  { title: 'Attention, Rendered', credit: 'INTERPRETABILITY — 2026' },
  { title: 'N-Body, After Nature', credit: 'WEBGL PHYSICS — 2025' },
  { title: 'The Latency Room', credit: 'SYSTEMS — 2025' },
]

export interface Post {
  title: string
  blurb: string
  year: string
  align: 'left' | 'right' | 'center'
  accent: string
  href?: string
}

export const posts: Post[] = [
  {
    title: 'On rewriting the same particle system, forever',
    blurb: 'Why I keep rebuilding the same two thousand dots — and what quietly changes each time.',
    year: '2026',
    align: 'left',
    accent: '#c56a4a',
  },
  {
    title: 'Making attention feel like a physical thing',
    blurb: 'Notes toward an intuition for what a transformer is actually doing under the hood.',
    year: '2026',
    align: 'right',
    accent: '#8a9a6b',
  },
  {
    title: 'The cost of a cache miss, felt',
    blurb: 'Measuring the memory hierarchy until the nanoseconds turned into something I could feel.',
    year: '2025',
    align: 'center',
    accent: '#d8a24a',
  },
]
