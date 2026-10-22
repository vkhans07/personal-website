# Vijay Kumar Hans — personal website

React + Vite recreation of the supplied HTML design reference. The person-facing portfolio is in `src/main.jsx`; styles are in `src/styles.css`.

## Run locally

```sh
npm install
npm run dev
```

## Build

```sh
npm run build
```

The Word Hunt dialog is presentation only. See `server/README.md` for the suggested API seam and implementation notes.

## Model attention experiment

Hero-word attention scores are generated offline and saved to `public/attention-scores.json`; model weights are not sent to the browser. The page renders its regular content if scores are missing or stale.

The initial pipeline uses the pinned `openai-community/gpt2` model revision and places selected project descriptions and experience bullets before the exact hero phrase. The attention option averages all heads in the final four layers; the relationships option compares mean GPT-2 input-token embeddings with cosine similarity. The generator rejects inputs longer than GPT-2's 1,024-token context instead of truncating them.

To regenerate scores, install PyTorch and Transformers in a separate Python environment, then run:

```sh
python scripts/generate_attention_scores.py
```

The script collects text from the existing React data through Vite, runs one local forward pass, and atomically replaces the score file only after generation succeeds. The score renderer is shared by project descriptions and experience bullets in `src/attention/AttentionText.jsx`.
