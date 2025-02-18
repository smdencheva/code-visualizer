'use client';

import React from 'react';
import ForLoop from '@/components/ForLoop';

/** We'll store each snapshot of the binary search algorithm */
interface Snapshot {
  low: number;
  high: number;
  mid: number;
  midValue: number;
  description: string;
}

/** Pseudocode snippet for reference. */
const BINARY_SEARCH_CODE_SNIPPET = `
function binarySearch(arr, target):
  low = 0
  high = arr.length - 1
  while low <= high:
    mid = floor((low + high) / 2)
    if arr[mid] == target:
      return mid
    else if arr[mid] < target:
      low = mid + 1
    else:
      high = mid - 1
  return -1
`;

/**
 * Compute snapshots of the binary search algorithm on a sorted array.
 *
 * @param arr Sorted array to search within.
 * @param target The value we're searching for.
 * @returns An array of snapshots representing each iteration.
 */
function computeBinarySearchSnapshots(arr: number[], target: number): Snapshot[] {
  let low = 0;
  let high = arr.length - 1;
  const snapshots: Snapshot[] = [];

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const midValue = arr[mid];

    let description = `Searching in indices [${low}, ${high}]. `;
    description += `Mid index is ${mid} with value ${midValue}. `;
    if (midValue === target) {
      description += "Found the target!";
    } else if (midValue < target) {
      description += `${midValue} is less than ${target}, so search right half.`;
    } else {
      description += `${midValue} is greater than ${target}, so search left half.`;
    }

    snapshots.push({
      low,
      high,
      mid,
      midValue,
      description,
    });

    if (midValue === target) {
      break;
    } else if (midValue < target) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }

  return snapshots;
}

export default function BinarySearchPage() {
  // Example sorted array and target value.
  const arr = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19];
  const target = 11;
  // Compute each step of the binary search.
  const snapshots = computeBinarySearchSnapshots(arr, target);

  return (
    <main style={{ padding: '1rem', fontFamily: 'sans-serif' }}>
      <h1>Binary Search Visualization</h1>
      <p>
        Binary search is an efficient algorithm to find a target value within a{' '}
        <strong>sorted array</strong>. At each step, we compare the target with the middle element,
        then reduce the search space by half.
      </p>
      <pre
        style={{
          background: '#f8f8f8',
          padding: '1rem',
          whiteSpace: 'pre-wrap',
          borderRadius: '4px',
        }}
      >
        {BINARY_SEARCH_CODE_SNIPPET}
      </pre>

      <p>
        Sorted Array: <strong>[{arr.join(', ')}]</strong>
      </p>
      <p>
        Target: <strong>{target}</strong>
      </p>

      <ForLoop start={0} end={snapshots.length - 1} variableName="step">
        {({ step }) => {
          const { low, high, mid, midValue, description } = snapshots[step];

          // Visualize the array with highlighted low, mid, and high indices.
          const arrayVisual = arr.map((value, idx) => {
            // Default styling.
            let background = '#eee';
            let borderColor = '#ccc';

            // Highlight the current low, mid, and high indices.
            if (idx === mid) {
              background = '#ffebcd'; // light orange for mid
              borderColor = 'orange';
            } else if (idx === low) {
              background = '#d0f0c0'; // light green for low
              borderColor = 'green';
            } else if (idx === high) {
              background = '#add8e6'; // light blue for high
              borderColor = 'blue';
            }

            return (
              <div
                key={idx}
                style={{
                  display: 'inline-block',
                  width: '2rem',
                  height: '2rem',
                  lineHeight: '2rem',
                  textAlign: 'center',
                  marginRight: '4px',
                  background,
                  border: `2px solid ${borderColor}`,
                  borderRadius: '4px',
                }}
                title={`Index: ${idx}, Value: ${value}`}
              >
                {value}
              </div>
            );
          });

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
              </p>
              <p>{description}</p>
              <div style={{ marginTop: '0.5rem' }}>{arrayVisual}</div>
            </div>
          );
        }}
      </ForLoop>
    </main>
  );
}
