// All the words on the site live here — swap in your real name, links,
// and writing without touching the components.

export const site = {
  name: 'Vijay Kumar Hans',
  nameLines: ['Vijay', 'Hans'],
  navBrand: 'Vijay Kumar Hans — The Collection',
  bio: "Current EECS + Business undergrad at UC Berkeley M.E.T., graduating 2028. Interested in consumer dev, low latency work, and AI applications to natural sciences. Prev @ StellarSleep (YC S23).",
  status: "Recruiting for Spring '27, Summer '27.",
  plaque: {
    title: 'The Collection of Vijay Hans',
    subtitle: 'Berkeley · MMXXVI',
  },
}

export interface Painting {
  title: string
  artist: string
  origin: string // wall-label tail line, e.g. 'after the 1875 oil'
  url: string
}

// The rotating exhibit in the hero frame. All public domain, served by
// Wikimedia with CORS headers (required — the sim reads pixels back out).
export const paintings: Painting[] = [
  {
    title: 'Woman with a Parasol',
    artist: 'Monet',
    origin: 'after the 1875 oil',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Claude_Monet%2C_Woman_with_a_Parasol_-_Madame_Monet_and_Her_Son%2C_1875%2C_NGA_61379.jpg/960px-Claude_Monet%2C_Woman_with_a_Parasol_-_Madame_Monet_and_Her_Son%2C_1875%2C_NGA_61379.jpg',
  },
  {
    title: 'The Fighting Temeraire',
    artist: 'Turner',
    origin: 'after the 1839 oil',
    url: 'https://upload.wikimedia.org/wikipedia/commons/3/30/The_Fighting_Temeraire%2C_JMW_Turner%2C_National_Gallery.jpg',
  },
  {
    title: 'The Great Wave off Kanagawa',
    artist: 'Hokusai',
    origin: 'after the 1831 woodblock',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/The_Great_Wave_off_Kanagawa.jpg/960px-The_Great_Wave_off_Kanagawa.jpg',
  },
  {
    title: 'The Voyage of Life: Old Age',
    artist: 'Cole',
    origin: 'after the 1842 oil',
    url: 'https://upload.wikimedia.org/wikipedia/commons/4/4e/Thomas_Cole_-_The_Voyage_of_Life_Old_Age%2C_1842_%28National_Gallery_of_Art%29.jpg',
  },
  {
    title: 'A Sunday on La Grande Jatte',
    artist: 'Seurat',
    origin: 'after the 1884 oil',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/A_Sunday_on_La_Grande_Jatte%2C_Georges_Seurat%2C_1884.png/960px-A_Sunday_on_La_Grande_Jatte%2C_Georges_Seurat%2C_1884.png',
  },
  {
    title: 'The Kiss',
    artist: 'Klimt',
    origin: 'after the 1908 oil',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/The_Kiss_-_Gustav_Klimt_-_Google_Cultural_Institute.jpg/960px-The_Kiss_-_Gustav_Klimt_-_Google_Cultural_Institute.jpg',
  },
  {
    title: 'Banga Mata',
    artist: 'Tagore',
    origin: 'after the 1905 watercolor',
    url: 'https://upload.wikimedia.org/wikipedia/commons/3/3a/Bharat_Mata_by_Abanindranath_Tagore.jpg',
  },
]

export interface SocialLink {
  label: string
  handle: string
  href: string
}

export const links: SocialLink[] = [
  { label: 'GitHub', handle: '@vkhans07', href: 'https://github.com/vkhans07' },
  { label: 'LinkedIn', handle: '/in/VijayKumarHans', href: 'https://linkedin.com/in/VijayKumarHans' },
  { label: 'Email', handle: 'vkhans@berkeley.edu', href: 'mailto:vkhans@berkeley.edu' },
]

export interface Work {
  title: string
  credit: string
  href?: string
}

// The three hero pieces in the pop-art room; their bespoke visual treatments
// (pinned / leaning / hung) live in SelectedWorks.tsx.
export const works: Work[] = [
  { title: 'Muscel', credit: 'CONSUMER — 2026' },
  { title: 'CPU Raytracing', credit: 'PHYSICS — 2026' },
  { title: 'LLM Coursework Generation', credit: 'AI IN EDTECH — 2026' },
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
