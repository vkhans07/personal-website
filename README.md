# The Collection — museum-themed personal site

A personal website styled as a gallery walk: a dark exhibit room where a
Monet is reassembled from ~2,600 physics-simulated points of light inside a
gilt frame, a torn-paper pop-art room for selected works, a color-field room
for writing, and a wall-text colophon.

Scaffolded from the design prototype in `Homepage.dc.html` (+ `screenshots/`
for reference iterations).

## Stack

Vite + React 19 + TypeScript. No other runtime dependencies — the particle
painting is hand-rolled Canvas 2D.

## Run it

```sh
npm install
npm run dev      # dev server
npm run build    # typecheck + production build → dist/
```

## Where things live

- `src/data/site.ts` — **all the words**: your name, bio, links, works,
  posts, and the `paintings` carousel (title/artist/origin/url per work).
  Start here; the components read from it.
- `src/hooks/useMonetEngine.ts` — the hero painting: particle sim, spotlight
  cone, pointer interaction, artwork swapping. Tuning knobs at the top
  (`PAINTING`), plus the gilt-frame image URL.
- `src/components/` — one component per room: `Hero` (with `IdentityPanel` /
  `LightPanel`), `SelectedWorks`, `Catalogue`, `Colophon`, `GalleryNav`.
- `src/styles/` — one stylesheet per room; shared tokens and the frosted
  wall-panel treatment in `global.css`.

## Notes / TODO

- The paintings and the gilt-frame PNG load from Wikimedia Commons (public
  domain). Self-host them under `public/` before launch — the sim reads
  pixels via `getImageData`, so images must be same-origin or CORS-enabled.
  (Visitor uploads use `blob:` URLs, which are always same-origin.)
- `links` in `site.ts` point at placeholder handles; `/resume.pdf` doesn't
  exist yet (drop one in `public/`).
- The catalogue entries link back to `#reading` — wire them to real posts
  when there's somewhere to go.
