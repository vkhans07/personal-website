import React, {useEffect, useMemo, useRef, useState} from 'react';
import {solveBoard} from '../wordhunt/solver.js';

const ROUND_SECONDS = 120;
const DICE = [
  ['a', 'a', 'e', 'e', 'g', 'n'], ['a', 'b', 'b', 'j', 'o', 'o'],
  ['a', 'c', 'h', 'o', 'p', 's'], ['a', 'f', 'f', 'k', 'p', 's'],
  ['a', 'o', 'o', 't', 't', 'w'], ['c', 'i', 'm', 'o', 't', 'u'],
  ['d', 'e', 'i', 'l', 'r', 'x'], ['d', 'e', 'l', 'r', 'v', 'y'],
  ['d', 'i', 's', 't', 't', 'y'], ['e', 'e', 'g', 'h', 'n', 'w'],
  ['e', 'e', 'i', 'n', 's', 'u'], ['e', 'h', 'r', 't', 'v', 'w'],
  ['e', 'i', 'o', 's', 's', 't'], ['e', 'l', 'r', 't', 't', 'y'],
  ['h', 'i', 'm', 'n', 'qu', 'u'], ['a', 'a', 'f', 'i', 'r', 's'],
];

function randomBoard() {
  const board = [...DICE].map(faces => faces[Math.floor(Math.random() * faces.length)]);
  for (let index = board.length - 1; index > 0; index -= 1) {
    const other = Math.floor(Math.random() * (index + 1));
    [board[index], board[other]] = [board[other], board[index]];
  }
  return board;
}

function pointsFor(word) {
  if (word.length === 3) return 100;
  if (word.length === 4) return 400;
  if (word.length === 5) return 800;
  if (word.length === 6) return 1400;
  if (word.length === 7) return 1800;
  return 2200 + Math.max(0, word.length - 8) * 400;
}

const formatTime = seconds => `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;

export default function WordHuntDialog({onClose}) {
  const [letters, setLetters] = useState(randomBoard);
  const [solutions, setSolutions] = useState([]);
  const [foundWords, setFoundWords] = useState(() => new Set());
  const [path, setPath] = useState([]);
  const [secondsLeft, setSecondsLeft] = useState(ROUND_SECONDS);
  const [roundState, setRoundState] = useState('loading');
  const [status, setStatus] = useState('Loading the dictionary and preparing a board…');
  const [lastWord, setLastWord] = useState('');
  const selecting = useRef(false);
  const solutionsByWord = useMemo(() => new Map(solutions.map(solution => [solution.word, solution])), [solutions]);
  const foundScore = useMemo(() => [...foundWords].reduce((score, word) => score + pointsFor(word), 0), [foundWords]);
  const solverScore = useMemo(() => solutions.reduce((score, solution) => score + pointsFor(solution.word), 0), [solutions]);
  const activeTiles = useMemo(() => new Set(path), [path]);

  useEffect(() => {
    let cancelled = false;
    setRoundState('loading');
    setStatus('Loading the dictionary and preparing a board…');
    solveBoard(Array.from({length: 4}, (_, row) => letters.slice(row * 4, row * 4 + 4)))
      .then(found => {
        if (cancelled) return;
        setSolutions(found);
        setFoundWords(new Set());
        setSecondsLeft(ROUND_SECONDS);
        setRoundState('ready');
        setStatus(`Board ready. ${found.length.toLocaleString()} words for the solver to find.`);
      })
      .catch(error => {
        if (cancelled) return;
        setRoundState('error');
        setStatus(error instanceof Error ? error.message : 'The solver could not load.');
      });
    return () => { cancelled = true; };
  }, [letters]);

  useEffect(() => {
    if (roundState !== 'playing') return undefined;
    const timer = window.setInterval(() => {
      setSecondsLeft(time => Math.max(0, time - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [roundState]);

  useEffect(() => {
    if (roundState !== 'playing' || secondsLeft !== 0) return;
    selecting.current = false;
    setPath([]);
    setRoundState('finished');
    setStatus('Time. The unsolved words are shown below.');
  }, [roundState, secondsLeft]);

  function handleBackdropMouseDown(event) {
    if (event.target === event.currentTarget) onClose();
  }

  function startRound() {
    setFoundWords(new Set());
    setSecondsLeft(ROUND_SECONDS);
    setLastWord('');
    setRoundState('playing');
    setStatus('Drag across adjacent tiles to spell words.');
  }

  function beginPath(index) {
    if (roundState !== 'playing') return;
    selecting.current = true;
    setPath([index]);
  }

  function extendPath(index) {
    if (!selecting.current || roundState !== 'playing') return;
    setPath(current => {
      if (current.includes(index)) return current;
      const previous = current[current.length - 1];
      const rowGap = Math.abs(Math.floor(previous / 4) - Math.floor(index / 4));
      const columnGap = Math.abs((previous % 4) - (index % 4));
      return rowGap <= 1 && columnGap <= 1 ? [...current, index] : current;
    });
  }

  function finishPath() {
    if (!selecting.current) return;
    selecting.current = false;
    const word = path.map(index => letters[index]).join('');
    setPath([]);
    if (word.length < 3) return;
    setLastWord(word);
    if (!solutionsByWord.has(word)) {
      setStatus(`${word.toUpperCase()} is not on this board.`);
      return;
    }
    if (foundWords.has(word)) {
      setStatus(`${word.toUpperCase()} was already found.`);
      return;
    }
    setFoundWords(current => new Set(current).add(word));
    setStatus(`${word.toUpperCase()} — +${pointsFor(word)} point${pointsFor(word) === 1 ? '' : 's'}.`);
  }

  function newRound() {
    selecting.current = false;
    setPath([]);
    setLastWord('');
    setLetters(randomBoard());
  }

  const showAllWords = roundState === 'finished';

  return (
    <div className="modal-backdrop" onMouseDown={handleBackdropMouseDown}>
      <section
        className="word-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="word-title"
        onPointerUp={finishPath}
        onPointerCancel={finishPath}
        onPointerMove={event => {
          if (!selecting.current) return;
          const tile = document.elementFromPoint(event.clientX, event.clientY)?.closest('[data-tile-index]');
          if (tile) extendPath(Number(tile.dataset.tileIndex));
        }}
      >
        <div className="dialog-head">
          <div>
            <div className="eyebrow">Two-minute challenge</div>
            <h2 id="word-title">Word Hunt vs. solver</h2>
          </div>
          <button className="close" onClick={onClose} aria-label="Close">×</button>
        </div>

        <div className="game-scoreboard" aria-live="polite">
          <div><span className="eyebrow">You</span><strong>{foundScore}</strong><span>{foundWords.size} words</span></div>
          <div className={`round-clock${secondsLeft <= 15 ? ' round-clock-low' : ''}`}>{formatTime(secondsLeft)}</div>
          <div><span className="eyebrow">Solver target</span><strong>{solverScore}</strong><span>{solutions.length} words</span></div>
        </div>

        <div className="dialog-body game-body">
          <div className="board" aria-label="Word Hunt letter board">
            {letters.map((letter, index) => (
              <button
                className={`tile game-tile${activeTiles.has(index) ? ' tile-active' : ''}`}
                key={index}
                data-tile-index={index}
                type="button"
                aria-label={`Row ${Math.floor(index / 4) + 1}, column ${(index % 4) + 1}, ${letter.toUpperCase()}`}
                disabled={roundState !== 'playing'}
                onPointerDown={event => { event.preventDefault(); beginPath(index); }}
                onPointerEnter={() => extendPath(index)}
              >{letter.toUpperCase()}</button>
            ))}
          </div>
          <div className="game-info">
            <p className="solver-status" aria-live="polite">{status}</p>
            <p className="game-instructions">Drag through neighboring letters. A tile can only be used once per word.</p>
            <div className="current-word" aria-label="Current word path">{path.map(index => letters[index]).join('').toUpperCase() || lastWord.toUpperCase() || '—'}</div>
          </div>
        </div>

        <div className="game-actions">
          {roundState === 'ready' && <button className="button" onClick={startRound}>Start 2-minute round</button>}
          {roundState === 'playing' && <button className="button" onClick={() => { selecting.current = false; setPath([]); setRoundState('finished'); setStatus('Round ended. Unsolved words are shown below.'); }}>End round</button>}
          {(roundState === 'finished' || roundState === 'error') && <button className="button" onClick={newRound}>New random board</button>}
          {roundState === 'loading' && <button className="button" disabled>Preparing board…</button>}
        </div>

        {(foundWords.size > 0 || showAllWords) && (
          <section className="word-results" aria-label={showAllWords ? 'Solved and unsolved words' : 'Words you found'}>
            <h3>{showAllWords ? 'Solved and unsolved' : 'Your words'} <span>{showAllWords ? `(${foundWords.size} / ${solutions.length})` : `(${foundWords.size})`}</span></h3>
            <ol className="solution-list">
              {solutions.filter(solution => foundWords.has(solution.word) || showAllWords).map(({word, path: wordPath}) => {
                const found = foundWords.has(word);
                return <li className={found ? 'word-solved' : 'word-unsolved'} key={word}>
                  <span>{word.toUpperCase()}</span>
                  <span>{found ? `+${pointsFor(word)}` : 'missed'}</span>
                  <span className="solution-path">{wordPath.map(([row, column]) => `${row + 1},${column + 1}`).join(' → ')}</span>
                </li>;
              })}
            </ol>
          </section>
        )}
      </section>
    </div>
  );
}
