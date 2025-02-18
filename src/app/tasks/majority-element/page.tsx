'use client';

import React from 'react';
import ForLoop from '@/components/ForLoop';

/** Snapshot for each iteration of the Boyer-Moore Voting Algorithm */
interface Snapshot {
  index: number;
  currentValue: number;
  candidate: number;
  count: number;
  description: string;
}

/** Pseudocode snippet for reference */
const MAJORITY_ELEMENT_CODE_SNIPPET = `
// Boyer-Moore Voting Algorithm:
function majorityElement(nums):
  candidate = None
  count = 0
  for num in nums:
    if count == 0:
      candidate = num
      count = 1
    else if candidate == num:
      count += 1
    else:
      count -= 1
  return candidate
`;

/**
 * Compute snapshots for the Boyer-Moore Voting Algorithm.
 * For each element in the array, we update the candidate and count,
 * and record a snapshot of the current state.
 */
function computeMajoritySnapshots(nums: number[]): Snapshot[] {
  let candidate: number | null = null;
  let count = 0;
  const snapshots: Snapshot[] = [];

  for (let i = 0; i < nums.length; i++) {
    const currentValue = nums[i];
    let description = '';

    if (count === 0) {
      candidate = currentValue;
      count = 1;
      description = `Reset candidate to ${currentValue} and set count to 1.`;
    } else if (candidate === currentValue) {
      count++;
      description = `Encountered ${currentValue} which equals candidate ${candidate}, increment count to ${count}.`;
    } else {
      count--;
      description = `Encountered ${currentValue} which does not equal candidate ${candidate}, decrement count to ${count}.`;
    }

    snapshots.push({
      index: i,
      currentValue,
      candidate: candidate!,
      count,
      description,
    });
  }

  return snapshots;
}

export default function MajorityElementPage() {
  // Example input array for the majority element task.
  const nums = [2, 2, 1, 1, 1, 2, 2];
  const snapshots = computeMajoritySnapshots(nums);

  return (
    <main style={{ padding: '1rem', fontFamily: 'sans-serif' }}>
      <h1>Majority Element Visualization (Boyer‑Moore Voting Algorithm)</h1>
      <p>
        The majority element is the element that appears more than ⌊n / 2⌋ times. Using the Boyer‑Moore Voting
        Algorithm, we determine the majority element by maintaining a candidate and a count while iterating through the
        array.
      </p>

      <pre
        style={{
          background: '#f8f8f8',
          padding: '1rem',
          whiteSpace: 'pre-wrap',
          borderRadius: '4px',
        }}
      >
        {MAJORITY_ELEMENT_CODE_SNIPPET}
      </pre>

      <p>
        Array: <strong>[{nums.join(', ')}]</strong>
      </p>

      <ForLoop start={0} end={snapshots.length - 1} variableName="step">
        {({ step }) => {
          const snapshot = snapshots[step];

          // Visualize the array and highlight the current element being processed.
          const arrayVisual = nums.map((num, idx) => {
            let background = '#eee';
            if (idx === snapshot.index) {
              background = '#add8e6'; // Highlight current element.
            }
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
                title={`Index: ${idx}, Value: ${num}`}
              >
                {num}
              </span>
            );
          });

          return (
            <div
              style={{
                border: '1px dashed #aaa',
                margin: '1rem 0',
                padding: '1rem',
                borderRadius: '4px',
              }}
            >
              <p>
                <strong>
                  Step {step + 1} of {snapshots.length}
                </strong>
              </p>
              <p>{snapshot.description}</p>
              <div style={{ marginBottom: '0.5rem' }}>{arrayVisual}</div>
              <p>
                <strong>Candidate:</strong> {snapshot.candidate} &nbsp;&nbsp;
                <strong>Count:</strong> {snapshot.count}
              </p>
            </div>
          );
        }}
      </ForLoop>
    </main>
  );
}
