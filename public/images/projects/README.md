# Project images

Put project images in a folder named for the project ID, then list them in that
project's `details.images` array in `src/data.jsx`.

Example file: `public/images/projects/tinyserve/kv-cache.png`

```js
images: [
  {
    src: '/images/projects/tinyserve/kv-cache.png',
    alt: 'KV cache utilization during a bursty request workload',
    caption: 'Cache utilization during the burst test',
  },
],
```

The image gallery is responsive and lazy-loads its images. Add as many entries
as needed; `caption` is optional, while `alt` should describe the image.
