import React from 'react';

export default function WordHuntDialog({ onClose }) {
  const board = 'STAREONERLITVESP'.split('');
  function handleBackdropMouseDown(event) {
    if (event.target === event.currentTarget) {
      onClose();
    }
  }

  return (
    <div className="modal-backdrop" onMouseDown={handleBackdropMouseDown}>
      <section
        className="word-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="word-title"
      >
        <div className="dialog-head">
          <div>
            <div className="eyebrow">A small project</div>
            <h2 id="word-title">Word Hunt, solved.</h2>
          </div>
          <button className="close" onClick={onClose} aria-label="Close">×</button>
        </div>

        <div className="dialog-body">
          <div className="board" aria-label="Word Hunt board">
            {board.map((letter, index) => (
              <div className="tile" key={index}>{letter}</div>
            ))}
          </div>

          <div className="solver-placeholder">
            <div className="score">—</div>
            <p>The solver is waiting for its backend.</p>
            <p className="muted">
              This is the spot to connect your board reader, dictionary search, and solution playback.
            </p>
            <code>POST /api/wordhunt/solve</code>
          </div>
        </div>

        <button
          className="button"
          disabled
          title="Implement the solver endpoint to enable this"
        >
          Solver coming soon
        </button>
      </section>
    </div>
  );
}
