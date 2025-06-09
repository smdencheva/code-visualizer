'use client';

import React from 'react';
import ForLoop from '@/components/ForLoop';

/** Snapshot of each generation */
interface Snapshot {
  generation: number;
  board: number[][];
  description: string;
}

/** Pseudocode snippet for reference */
const GAME_OF_LIFE_SNIPPET = `
function gameOfLife(board):
  m = rows of board
  n = cols of board
  next = new m x n board
  for i in 0 to m-1:
    for j in 0 to n-1:
      count = number of live neighbors around board[i][j]
      if board[i][j] is live:
        next[i][j] = (count < 2 || count > 3) ? dead : live
      else:
        next[i][j] = (count == 3) ? live : dead
  board = next  // update all simultaneously
`;

// Sample initial configuration: a glider
const sampleBoard: number[][] = [
  [0, 1, 0, 0, 0],
  [0, 0, 1, 0, 0],
  [1, 1, 1, 0, 0],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
];
const generations = 4;

/**
 * Computes snapshots for Game of Life over a number of generations.
 */
function computeGameOfLifeSnapshots(board: number[][], steps: number): Snapshot[] {
  const snaps: Snapshot[] = [];
  let current = board.map(row => row.slice());

  for (let gen = 0; gen <= steps; gen++) {
    snaps.push({
      generation: gen,
      board: current.map(row => row.slice()),
      description: gen === 0 ? 'Initial state' : `Generation ${gen}`,
    });

    const m = current.length;
    const n = current[0].length;
    const next = Array.from({ length: m }, () => Array(n).fill(0));

    for (let i = 0; i < m; i++) {
      for (let j = 0; j < n; j++) {
        let count = 0;
        for (let dx = -1; dx <= 1; dx++) {
          for (let dy = -1; dy <= 1; dy++) {
            if (dx === 0 && dy === 0) continue;
            const x = i + dx;
            const y = j + dy;
            if (x >= 0 && x < m && y >= 0 && y < n) {
              count += current[x][y];
            }
          }
        }

        if (current[i][j] === 1) {
          next[i][j] = count < 2 || count > 3 ? 0 : 1;
        } else {
          next[i][j] = count === 3 ? 1 : 0;
        }
      }
    }

    current = next;
  }

  return snaps;
}

const snapshots = computeGameOfLifeSnapshots(sampleBoard, generations);

/**
 * Visualizes the board state.
 */
interface BoardVisualizationProps {
  board: number[][];
}

function BoardVisualization({ board }: BoardVisualizationProps) {
  const rows = board.length;
  const cols = board[0].length;
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, 1.5rem)`,
        gap: '0.2rem',
        justifyContent: 'center',
        margin: '0.5rem 0',
      }}
    >
      {board.flatMap((row, i) =>
        row.map((cell, j) => (
          <div
            key={`${i}-${j}`}
            style={{
              width: '1.5rem',
              height: '1.5rem',
              backgroundColor: cell === 1 ? '#4CAF50' : '#eee',
              border: '1px solid #ccc',
            }}
          />
        ))
      )}
    </div>
  );
}

export default function GameOfLifeVisualizationPage() {
  return (
    <main style={{ padding: '1rem', fontFamily: 'sans-serif' }}>
      <h1>Conway’s Game of Life Visualization</h1>
      <p>
        This shows how a glider evolves over <strong>{generations}</strong> generations
        following Conway’s four rules of Life.
      </p>

      <pre
        style={{
          background: '#f8f8f8',
          padding: '1rem',
          whiteSpace: 'pre-wrap',
          borderRadius: '4px',
        }}
      >
        {GAME_OF_LIFE_SNIPPET}
      </pre>

      <ForLoop start={0} end={snapshots.length - 1} variableName="step">
        {({ step }) => {
          const snap = snapshots[step];
          return (
            <div
              style={{
                border: '1px dashed #aaa',
                margin: '1rem 0',
                padding: '1rem',
                borderRadius: '8px',
              }}
            >
              <p>
                <strong>
                  Step {step + 1} of {snapshots.length}
                </strong>
                : {snap.description}
              </p>
              <BoardVisualization board={snap.board} />
            </div>
          );
        }}
      </ForLoop>
    </main>
  );
}
