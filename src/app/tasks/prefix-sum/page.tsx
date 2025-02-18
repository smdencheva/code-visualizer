'use client';

import React from 'react';
import ForLoop from '@/components/ForLoop';

/** We'll store each step of building the prefix sum array as a Snapshot. */
interface Snapshot {
  index: number;
  prefixSums: number[];
}

/** Pseudocode snippet for reference. */
const PREFIX_SUM_CODE_SNIPPET = `
// Compute Prefix Sum Array:
// 1) Let prefixSums[0] = arr[0]
// 2) For i = 1 to arr.length - 1:
//      prefixSums[i] = prefixSums[i-1] + arr[i]
// 3) Return prefixSums
`;

/**
 * Compute all snapshots of the prefix sum algorithm so that
 * we can visualize each step with a slider.
 */
function computePrefixSumSnapshots(arr: number[]): Snapshot[] {
  const snapshots: Snapshot[] = [];
  const prefixSums: number[] = [];

  for (let i = 0; i < arr.length; i++) {
    if (i === 0) {
      prefixSums.push(arr[0]);
    } else {
      prefixSums.push(prefixSums[i - 1] + arr[i]);
    }
    // Record a snapshot at this step (make a copy of prefixSums)
    snapshots.push({
      index: i,
      prefixSums: [...prefixSums],
    });
  }

  return snapshots;
}

export default function PrefixSumPage() {
  // Example input array
  const arr = [2, 3, 5, 1, 4, 7, 6, 9, 4];
  // Compute each step in building the prefix sum array
  const snapshots = computePrefixSumSnapshots(arr);

  return (
    <main style={{ padding: '1rem', fontFamily: 'sans-serif' }}>
      <h1>Prefix Sum Algorithm</h1>
      <p>
        Given an array of numbers, the prefix sum algorithm computes a new array where each element at index{' '}
        <code>i</code> is the sum of all numbers from index <code>0</code> to <code>i</code> in the original array.
      </p>

      <pre
        style={{
          background: '#f8f8f8',
          padding: '1rem',
          whiteSpace: 'pre-wrap',
          borderRadius: '4px',
        }}
      >
        {PREFIX_SUM_CODE_SNIPPET}
      </pre>

      <p>
        Original Array: <strong>[{arr.join(', ')}]</strong>
      </p>

      <ForLoop start={0} end={snapshots.length - 1} variableName="step">
        {({ step }) => {
          const snapshot = snapshots[step];
          const currentIndex = snapshot.index;

          return (
            <div
              style={{
                border: '1px dashed #aaa',
                margin: '1rem 0',
                padding: '0.5rem',
                borderRadius: '4px',
              }}
            >
              <p>
                <strong>
                  Step {step + 1} of {snapshots.length}
                </strong>
                : Computing prefix sum for index <code>{currentIndex}</code>
              </p>
              <div>
                <div style={{ marginBottom: '0.5rem' }}>
                  <strong>Original Array:</strong>
                  <div>
                    {arr.map((val, idx) => {
                      const background = idx === currentIndex ? '#add8e6' : '#eee';
                      return (
                        <span
                          key={idx}
                          style={{
                            display: 'inline-block',
                            width: '2rem',
                            height: '2rem',
                            lineHeight: '2rem',
                            textAlign: 'center',
                            marginRight: '4px',
                            background,
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                          }}
                        >
                          {val}
                        </span>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <strong>Prefix Sum Array (so far):</strong>
                  <div>
                    {snapshot.prefixSums.map((val, idx) => {
                      const background = idx === currentIndex ? '#ffdead' : '#f0f0f0';
                      return (
                        <span
                          key={idx}
                          style={{
                            display: 'inline-block',
                            width: '2rem',
                            height: '2rem',
                            lineHeight: '2rem',
                            textAlign: 'center',
                            marginRight: '4px',
                            background,
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                          }}
                        >
                          {val}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          );
        }}
      </ForLoop>
    </main>
  );
}
