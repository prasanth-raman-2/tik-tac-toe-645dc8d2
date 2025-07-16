import React, { useState, useEffect } from 'react';
import './App.css';

/**
 * PUBLIC_INTERFACE
 * A simple Tic Tac Toe game with theme toggle.
 * - 3x3 board
 * - Two-player local turn-based
 * - Winner and draw detection
 * - Light/Dark theme toggle
 */
function App() {
  const [theme, setTheme] = useState('light');
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [draw, setDraw] = useState(false);

  // Apply theme to the document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  // PUBLIC_INTERFACE
  function handleClick(index) {
    // Ignore if game is won/drawn or square taken
    if (winner || board[index]) return;

    // Create new board state
    const boardCopy = board.slice();
    boardCopy[index] = xIsNext ? 'X' : 'O';
    setBoard(boardCopy);

    // Next player
    setXIsNext(!xIsNext);

    // Check game state after update (in useEffect to ensure board is latest)
  }

  // PUBLIC_INTERFACE
  function calculateWinner(b) {
    const lines = [
      [0,1,2],[3,4,5],[6,7,8], // rows
      [0,3,6],[1,4,7],[2,5,8], // cols
      [0,4,8],[2,4,6]          // diags
    ];
    for (let line of lines) {
      const [a, b1, c] = line;
      if (b[a] && b[a] === b[b1] && b[a] === b[c]) {
        return b[a];
      }
    }
    return null;
  }

  useEffect(() => {
    const win = calculateWinner(board);
    setWinner(win);

    // Draw if board full and no winner
    if (!win && board.every(v => v)) setDraw(true);
    else setDraw(false);
  }, [board]);

  // PUBLIC_INTERFACE
  function restartGame() {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
    setWinner(null);
    setDraw(false);
  }

  return (
    <div className="App">
      <header className="App-header">
        <button 
          className="theme-toggle" 
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
        <div style={{marginBottom: 24}}>
          <h1 style={{margin: '0.5em 0'}}>Tic Tac Toe</h1>
          <p className="App-description" style={{ margin: 0, fontSize: '16px', color: 'var(--text-secondary)' }}>
            Simple React 3x3 Game | Local Two Player
          </p>
        </div>
        <TicTacToeBoard 
          board={board} 
          onClick={handleClick} 
          disabled={Boolean(winner) || draw}
        />
        <div style={{ minHeight: 32, marginTop: 16 }}>
          {winner ? (
            <h2 style={{color: 'var(--button-bg)'}}>Winner: {winner}!</h2>
          ) : draw ? (
            <h2 style={{color: 'var(--text-secondary)'}}>It's a draw!</h2>
          ) : (
            <h3>Next turn: {xIsNext ? "X" : "O"}</h3>
          )}
        </div>
        {(winner || draw) && (
          <button
            style={{
              marginTop: 12,
              padding: "8px 20px",
              background: "var(--button-bg)",
              color: "var(--button-text)",
              border: 0,
              borderRadius: 8,
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "1rem"
            }}
            onClick={restartGame}
          >
            Restart Game
          </button>
        )}
      </header>
    </div>
  );
}

// PUBLIC_INTERFACE
function TicTacToeBoard({ board, onClick, disabled }) {
  /**
   * Renders the 3x3 tic tac toe board UI
   */
  return (
    <div 
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 80px)",
        gridTemplateRows: "repeat(3, 80px)",
        gap: "8px",
        justifyContent: "center"
      }}
    >
      {board.map((val, i) => (
        <Square 
          value={val}
          key={i}
          onClick={() => onClick(i)}
          disabled={disabled || Boolean(val)}
        />
      ))}
    </div>
  );
}

// PUBLIC_INTERFACE
function Square({ value, onClick, disabled }) {
  /**
   * Renders an individual square in the tic tac toe board.
   */
  return (
    <button
      className="tictactoe-square"
      aria-label={`Tic tac toe square ${value || 'empty'}`}
      style={{
        width: 80,
        height: 80,
        fontSize: "2.2rem",
        background: "var(--bg-secondary)",
        color: value === 'X' ? "#E87A41" : value === 'O' ? "#007bff" : "var(--text-primary)",
        border: '2px solid var(--border-color)',
        borderRadius: "12px",
        cursor: disabled ? "not-allowed" : "pointer",
        fontWeight: 'bold',
        outline: "none",
        transition: "background .2s"
      }}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
    >
      {value}
    </button>
  );
}

export default App;
