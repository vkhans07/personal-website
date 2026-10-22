const MIN_LEN = 3;
const MAX_LEN = 16;

class TrieNode {
  constructor() {
    this.children = Object.create(null);
    this.isWord = false;
  }
}

class Trie {
  constructor() {
    this.head = new TrieNode();
  }

  insert(word) {
    let node = this.head;
    for (const character of word) {
      node.children[character] ??= new TrieNode();
      node = node.children[character];
    }
    node.isWord = true;
  }
}

let dictionaryPromise;

async function loadDictionary() {
  dictionaryPromise ??= fetch('/wordhunt/words.txt')
    .then(response => {
      if (!response.ok) throw new Error('Could not load the Word Hunt dictionary.');
      return response.text();
    })
    .then(contents => {
      const trie = new Trie();
      for (const line of contents.split(/\r?\n/u)) {
        const word = line.trim().toLowerCase();
        if (word.length >= MIN_LEN && word.length <= MAX_LEN && /^[a-z]+$/u.test(word)) trie.insert(word);
      }
      return trie;
    })
    .catch(error => {
      dictionaryPromise = undefined;
      throw error;
    });
  return dictionaryPromise;
}

// Port of wordhunt/solver.py: one first-found path per word, 8-way adjacency,
// no tile reuse, trie-prefix pruning, then longest-first/alphabetical sorting.
export async function solveBoard(grid) {
  if (!Array.isArray(grid) || grid.length !== 4 || grid.some(row => !Array.isArray(row) || row.length !== 4)) {
    throw new Error('Enter exactly 16 letters in a 4 × 4 board.');
  }
  const board = grid.map(row => row.map(letter => String(letter).toLowerCase()));
  if (board.some(row => row.some(letter => !/^(?:[a-z]|qu)$/u.test(letter)))) {
    throw new Error('Each tile must contain one letter from A to Z (or QU).');
  }

  const trie = await loadDictionary();
  const found = new Map();

  function dfs(parent, row, column, word, path, used) {
    const tile = board[row][column];
    let node = parent;
    for (const letter of tile) {
      node = node.children[letter];
      if (!node) return;
    }

    const nextWord = word + tile;
    const nextPath = [...path, [row, column]];
    const nextUsed = used | (1 << (row * 4 + column));
    if (node.isWord && !found.has(nextWord)) found.set(nextWord, nextPath);

    for (const rowDelta of [-1, 0, 1]) {
      for (const columnDelta of [-1, 0, 1]) {
        if (rowDelta === 0 && columnDelta === 0) continue;
        const nextRow = row + rowDelta;
        const nextColumn = column + columnDelta;
        if (nextRow >= 0 && nextRow < 4 && nextColumn >= 0 && nextColumn < 4
          && !(nextUsed & (1 << (nextRow * 4 + nextColumn)))) {
          dfs(node, nextRow, nextColumn, nextWord, nextPath, nextUsed);
        }
      }
    }
  }

  for (let row = 0; row < 4; row += 1) {
    for (let column = 0; column < 4; column += 1) dfs(trie.head, row, column, '', [], 0);
  }

  return [...found].map(([word, path]) => ({word, path}))
    .sort((left, right) => right.word.length - left.word.length || (left.word < right.word ? -1 : left.word > right.word ? 1 : 0));
}
