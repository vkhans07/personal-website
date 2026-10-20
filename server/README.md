# Server logic starter

There is no server implementation yet. Keep the API contract and implementation in this folder as you build the interactive parts.

## Word Hunt

Suggested route: `POST /api/wordhunt/solve`

```json
{ "board": ["S", "T", "A", "R", "E", "O", "N", "E", "R", "L", "I", "T", "V", "E", "S", "P"] }
```

Decide how to load a dictionary, validate a 4×4 board, search adjacent tiles, score the results, and return paths for playback. The current dialog deliberately does not call this endpoint.

## Attention interaction

The reference links hero words and portfolio highlights with a hand-authored attention map. Implement the model/data you want in `src/main.jsx` and decide whether any behavior belongs behind an API before wiring it up.
