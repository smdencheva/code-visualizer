'use client';

import React from 'react';
import ForLoop from '@/components/ForLoop';

/** Snapshot of each binary search step */
interface Snapshot {
  low: number;
  high: number;
  mid: number;
  description: string;
}

/** Pseudocode snippet for reference */
const BINARY_SEARCH_SNIPPET = `
function integerSqrt(x):
  if x < 2: return x
  low = 0
  high = x
  while low <= high:
    mid = floor((low + high) / 2)
    if mid * mid <= x:
      low = mid + 1
    else:
      high = mid - 1
  return high
`;

const sampleX = 10; // Change this to visualize different inputs

/**
 * Computes snapshots for integer square root via binary search.
 * Records low, high, mid, and a description at each iteration.
 */
function computeSqrtSnapshots(x: number): Snapshot[] {
  const snaps: Snapshot[] = [];
  if (x < 2) {
    snaps.push({ low: 0, high: x, mid: x, description: `Trivial case: x = ${x}` });
    return snaps;
  }
  let low = 0;
  let high = x;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const square = mid * mid;
    const desc =
      square === x
        ? `mid = ${mid}, mid*mid = x (${square}), found exact sqrt.`
        : square < x
          ? `mid = ${mid}, mid*mid = ${square} < x (${x}), move low up.`
          : `mid = ${mid}, mid*mid = ${square} > x (${x}), move high down.`;

    snaps.push({ low, high, mid, description: desc });

    if (square <= x) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }

  return snaps;
}

const snapshots = computeSqrtSnapshots(sampleX);

/**
 * Visualizes low, mid, high pointers for the current snapshot.
 */
interface SearchVisProps {
  snapshot: Snapshot;
}

function SearchVisualization({ snapshot }: SearchVisProps) {
  const { low, high, mid } = snapshot;
  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', margin: '1rem 0' }}>
      {['low', 'mid', 'high'].map((label) => {
        const value = label === 'low' ? low : label === 'mid' ? mid : high;
        const isCurrent = label === 'mid';
        return (
          <div
            key={label}
            style={{
              padding: '0.5rem 1rem',
              border: `2px solid ${isCurrent ? 'orange' : '#ccc'}`,
              borderRadius: '8px',
              backgroundColor: isCurrent ? '#ffebcd' : '#eee',
              minWidth: '4rem',
              textAlign: 'center',
            }}
          >
            {`${label}: ${value}`}
          </div>
        );
      })}
    </div>
  );
}

export default function SqrtVisualizationPage() {
  return (
    <main style={{ padding: '1rem', fontFamily: 'sans-serif' }}>
      <h1>Integer Square Root Visualization (Binary Search)</h1>
      <p>
        This visualization shows how binary search narrows down the integer square root of x ={' '}
        <strong>{sampleX}</strong>. At each step, we compute <em>mid</em> and compare mid² to x,
        then move <em>low</em> or <em>high</em> accordingly.
      </p>

      <pre
        style={{
          background: '#f8f8f8',
          padding: '1rem',
          whiteSpace: 'pre-wrap',
          borderRadius: '4px',
        }}
      >
        {BINARY_SEARCH_SNIPPET}
      </pre>

      <p>Initial pointers before any iteration:</p>
      <SearchVisualization snapshot={{ low: 0, high: sampleX, mid: -1, description: '' }} />

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
              <SearchVisualization snapshot={snap} />
            </div>
          );
        }}
      </ForLoop>
    </main>
  );
}
