// All the words on the site live here — swap in your real name, links,
// and writing without touching the components.

// Artwork for the selected works. Importing (rather than a path string) lets
// Vite bundle the file and rewrite the URL for production.
import muscelDemo from '../assets/muscel_demo.png'
import raytraceOutput from '../assets/output.png'

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
  // Optional custom artwork: import the file at the top of this module (Vite
  // bundles it and rewrites the URL) or use an external URL. When omitted,
  // the piece falls back to its generated pop-art placeholder.
  image?: string
  imageAlt?: string
  // Shown in the frosted-glass panel that opens when the piece is clicked.
  description?: string
}

// The three hero pieces in the pop-art room; their bespoke visual treatments
// (pinned / leaning / hung) live in SelectedWorks.tsx.
export const works: Work[] = [
  {
    title: 'Muscel',
    credit: 'CONSUMER — 2026',
    image: muscelDemo,
    href: 'https://muscel.net',
    description:
      'Empowering your workout goals with machine learning. Built with React Native, Python, Supabase, and SQLite.',
  },
  {
    title: 'CPU Raytracing',
    credit: 'PHYSICS — 2026',
    image: raytraceOutput,
    href: 'https://github.com/vkhans07/raytracing_project',
    description:
      'Emulates light travel in a 3D world for a maximally realistic visual. Built in C++.',
  },
  {
    title: 'LLM Coursework Generation',
    credit: 'AI IN EDTECH — 2026',
    href: 'https://github.com/vkhans07/oa-tutor-workflow-automation',
    description:
      'An LLM pipeline that drafts coursework — problem sets, solutions, and rubrics — for instructors to refine. Built in Python with the Gemini SDK.',
  },
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
    title: 'The Handshake Problem',
    blurb: 'How the American Revolution restructured its upper class, summarized in our most iconic greeting.',
    year: '2026',
    align: 'left',
    accent: '#c56a4a',
    href: "https://substack.com/profile/290641001-vijay-hans/note/c-294185659",
  },
  {
    title: 'Write-Only Character Assessments',
    blurb: 'The internet forgot how to forget.',
    year: '2026',
    align: 'right',
    accent: '#8a9a6b',
    href: "https://substack.com/home/post/p-207386590"
  },
  {
    title: 'Ulysses S. Grant & Masculinity',
    blurb: 'Coming Soon!',
    year: '2026',
    align: 'center',
    accent: '#d8a24a',
  },
]
