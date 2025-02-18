'use client';

import React from 'react';
import ForLoop from '@/components/ForLoop';

/** We'll store each step of the two-pointer approach as a Snapshot. */
interface Snapshot {
    left: number;
    right: number;
    area: number;
    bestSoFar: number;
}

/** Pseudocode snippet for reference. */
const TWO_POINTER_CODE_SNIPPET = `
// Container With Most Water (two-pointer method):
// 1) Initialize left=0, right=n-1, best=0
// 2) While left < right:
//      height = min(arr[left], arr[right])
//      width = right - left
//      area = height * width
//      best = max(best, area)
//
//      if arr[left] < arr[right]:
//         left++
//      else:
//         right--
// 3) best holds the maximum water possible
`;

/**
 * Compute all snapshots of the two-pointer approach so
 * we can visualize each step with a slider.
 */
function computeTwoPointerSnapshots(heights: number[]): Snapshot[] {
    let left = 0;
    let right = heights.length - 1;
    let best = 0;
    const snapshots: Snapshot[] = [];

    while (left < right) {
        const h = Math.min(heights[left], heights[right]);
        const width = right - left;
        const area = h * width;
        best = Math.max(best, area);

        // Record snapshot at this step
        snapshots.push({
            left,
            right,
            area,
            bestSoFar: best,
        });

        // Move the pointer for the smaller height inwards
        if (heights[left] < heights[right]) {
            left++;
        } else {
            right--;
        }
    }

    return snapshots;
}

export default function ContainerWithWaterPage() {
    // Example column heights
    const arr = [2, 3, 5, 1, 4, 7, 6, 9, 4];
    // Collect all steps in the two-pointer approach
    const snapshots = computeTwoPointerSnapshots(arr);

    return (
        <main style={{ padding: '1rem', fontFamily: 'sans-serif' }}>
            <h1>Container With Most Water</h1>
            <p>
                We have an array of positive heights (like vertical columns).
                The max "water" is determined by <strong>two pointers</strong>, left and right.
                The water level is <em>min(height[left], height[right])</em>, and the base is <em>(right - left)</em>.
            </p>

            <pre style={{ background: '#f8f8f8', padding: '1rem', whiteSpace: 'pre-wrap' }}>
        {TWO_POINTER_CODE_SNIPPET}
      </pre>

            <p>Array: <strong>[{arr.join(', ')}]</strong></p>
            <ForLoop start={0} end={snapshots.length - 1} variableName="step">
                {({ step }) => {
                    const { left, right, area, bestSoFar } = snapshots[step];

                    // We want to highlight the region from 'left' to 'right'.
                    // Water level is up to min(arr[left], arr[right]).
                    const waterHeight = Math.min(arr[left], arr[right]);
                    const boxes = arr.map((val, idx) => {
                        // Basic style for each column:
                        let background = '#eee';
                        let borderColor = '#ccc';
                        let color = '#000';

                        // If idx is in [left..right], highlight the region
                        if (idx >= left && idx <= right) {
                            background = '#add8e6'; // lightblue
                        }

                        // If idx == left, color it green:
                        if (idx === left) {
                            borderColor = 'green';
                            color = 'green';
                        }
                        // If idx == right, color it red:
                        if (idx === right) {
                            borderColor = 'red';
                            color = 'red';
                        }

                        // We'll display the "water line" as a partial fill or something
                        // but let's keep it simple: we highlight the entire box from top to waterHeight
                        // in the final version, you might do a more fancy bar chart approach.

                        return (
                            <div key={idx} style={{ display: 'inline-block', marginRight: '4px' }}>
                                <div
                                    style={{
                                        width: '2rem',
                                        height: '3rem',
                                        border: `2px solid ${borderColor}`,
                                        background,
                                        position: 'relative',
                                        textAlign: 'center',
                                        color: color,
                                        lineHeight: '3rem',
                                    }}
                                    title={`Index: ${idx}, Height: ${val}`}
                                >
                                    {val}
                                </div>
                                {/* If idx is within [left..right], we might show "water" level. */}
                                {idx >= left && idx <= right ? (
                                    <div style={{ textAlign: 'center', fontSize: '0.75rem', color: '#555' }}>
                                        {val >= waterHeight ?
                                            `up to ${waterHeight}` :
                                            `only ${val} < water`
                                        }
                                    </div>
                                ) : (
                                    <div style={{ textAlign: 'center', fontSize: '0.75rem', color: '#bbb' }}>
                                        &nbsp;
                                    </div>
                                )}
                            </div>
                        );
                    });

                    return (
                        <div style={{ border: '1px dashed #aaa', margin: '1rem 0', padding: '0.5rem' }}>
                            <p>
                                <strong>Step {step + 1} of {snapshots.length}</strong>:&nbsp;
                                <em>left={left}, right={right}</em>
                                <br />
                                Current area = {area}, Best so far = {bestSoFar}
                            </p>
                            <div>
                                {boxes}
                            </div>
                        </div>
                    );
                }}
            </ForLoop>
        </main>
    );
}
