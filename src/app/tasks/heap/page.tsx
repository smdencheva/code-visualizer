'use client';

import React from 'react';
import ForLoop from '@/components/ForLoop';

/** We'll store each step (snapshot) during heap insertion and bubble-up. */
interface Snapshot {
  insertedValue: number;
  currentIndex: number; // the index in the original input array for this insertion
  heap: number[];
  bubbleUpIndex?: number; // index where the inserted element is currently bubbling up
  description: string;
}

/** Pseudocode snippet for reference. */
const HEAP_USAGE_CODE_SNIPPET = `
function insertIntoHeap(heap, value):
  heap.append(value)
  i = heap.length - 1
  while i > 0:
    parent = floor((i - 1) / 2)
    if heap[parent] < heap[i]:
      swap(heap[parent], heap[i])
      i = parent
    else:
      break
`;

/**
 * Build a max-heap by inserting elements one by one and bubbling them up.
 * We record a snapshot after inserting an element and after each swap.
 */
function computeHeapSnapshots(arr: number[]): Snapshot[] {
  const snapshots: Snapshot[] = [];
  const heap: number[] = [];

  for (let i = 0; i < arr.length; i++) {
    const value = arr[i];
    // Insert the new value at the end of the heap.
    heap.push(value);
    let currentIndex = heap.length - 1;
    snapshots.push({
      insertedValue: value,
      currentIndex: i,
      heap: [...heap],
      bubbleUpIndex: currentIndex,
      description: `Inserted ${value} at heap index ${currentIndex}`,
    });

    // Bubble up the inserted value to maintain the max-heap property.
    while (currentIndex > 0) {
      const parent = Math.floor((currentIndex - 1) / 2);
      if (heap[parent] < heap[currentIndex]) {
        // Record the swap details.
        const oldParent = heap[parent];
        const oldCurrent = heap[currentIndex];
        [heap[parent], heap[currentIndex]] = [heap[currentIndex], heap[parent]];
        snapshots.push({
          insertedValue: value,
          currentIndex: i,
          heap: [...heap],
          bubbleUpIndex: parent,
          description: `Swapped ${oldCurrent} with parent ${oldParent}; ${value} bubbled up to index ${parent}`,
        });
        currentIndex = parent;
      } else {
        break;
      }
    }
  }

  return snapshots;
}

export default function HeapUsagePage() {
  // Example input array.
  const arr = [3, 1, 6, 5, 2, 4];
  // Compute snapshots of building a max‑heap.
  const snapshots = computeHeapSnapshots(arr);

  return (
    <main style={{ padding: '1rem', fontFamily: 'sans-serif' }}>
      <h1>Heap Usage Visualization (Max‑Heap Insertion)</h1>
      <p>
        In a <strong>max‑heap</strong> each parent node is greater than its children. Here we demonstrate
        how to build a max‑heap by inserting elements one by one and “bubbling them up” until the heap property is maintained.
      </p>

      <pre
        style={{
          background: '#f8f8f8',
          padding: '1rem',
          whiteSpace: 'pre-wrap',
          borderRadius: '4px',
        }}
      >
        {HEAP_USAGE_CODE_SNIPPET}
      </pre>

      <p>
        Input Array: <strong>[{arr.join(', ')}]</strong>
      </p>

      <ForLoop start={0} end={snapshots.length - 1} variableName="step">
        {({ step }) => {
          const snapshot = snapshots[step];
          const { heap, bubbleUpIndex, description } = snapshot;

          // Visualize the heap as an array of boxes.
          const boxes = heap.map((value, idx) => {
            // Default styling.
            let background = '#eee';
            let borderColor = '#ccc';

            // Highlight the element that's currently bubbling up.
            if (bubbleUpIndex !== undefined && idx === bubbleUpIndex) {
              background = '#add8e6'; // lightblue
              borderColor = 'blue';
            }

            return (
              <div
                key={idx}
                style={{
                  display: 'inline-block',
                  marginRight: '4px',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    width: '2.5rem',
                    height: '2.5rem',
                    lineHeight: '2.5rem',
                    border: `2px solid ${borderColor}`,
                    background,
                    borderRadius: '4px',
                  }}
                  title={`Heap Index: ${idx}`}
                >
                  {value}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#555' }}>Idx {idx}</div>
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
              <div>
                <strong>Heap Array:</strong>
                <div style={{ marginTop: '0.5rem' }}>{boxes}</div>
              </div>
            </div>
          );
        }}
      </ForLoop>
    </main>
  );
}
