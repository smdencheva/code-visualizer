'use client';

import React from 'react';
import ForLoop from '@/components/ForLoop';

/** This is the code snippet we'll display to the user as "the solution." */
const DEQUE_CODE_SNIPPET = `
// Pseudocode for O(n) Sliding Window Maximum (window size k):
// We'll iterate i from 0..arr.length-1:
// 1) Pop from back of deque while arr[i] >= arr[deque.back()]
// 2) Push i to the back of deque
// 3) Pop from front if deque.front() <= i - k
//    (meaning it's out of this window)
// 4) If i >= k - 1, arr[deque.front()] is the max for window [i-k+1..i].
`;

export default function SlidingWindowPage() {
    const arr = [2, 3, 1, 5, 4, 9];
    const k = 3;

    return (
        <main style={{ padding: '1rem', fontFamily: 'sans-serif' }}>
            <h1>Sliding Window Maximum</h1>
            <p>
                We have an array: <strong>{JSON.stringify(arr)}</strong> and a window size: <strong>{k}</strong>.
                Below is the <strong>O(n)</strong> deque-based approach for finding the max in each window.
            </p>

            <pre
                style={{
                    background: '#f8f8f8',
                    padding: '1rem',
                    whiteSpace: 'pre-wrap',
                    fontSize: '0.9rem',
                }}
            >
        {DEQUE_CODE_SNIPPET}
      </pre>

            <ForLoop start={0} end={arr.length - 1} variableName="i">
                {({ i }) => {
                    // We'll simulate the deque-based algorithm up to index i,
                    // then highlight the current window if i >= k-1.

                    // Deque will store indices of elements, largest in front
                    const deque: number[] = [];
                    const maxInWindows: Array<{ startIdx: number; maxValue: number }> = [];

                    // We'll run a single loop from 0..i to fill the deque
                    // and record any windows that end at j (0..i).
                    for (let j = 0; j <= i; j++) {
                        // 1) Pop from back if arr[j] >= arr[deque.back()]
                        while (deque.length > 0 && arr[j] >= arr[deque[deque.length - 1]]) {
                            deque.pop();
                        }

                        // 2) Push j
                        deque.push(j);

                        // 3) Pop from front if it's out of range
                        const windowStart = j - k + 1;
                        if (deque[0] < windowStart) {
                            deque.shift();
                        }

                        // 4) If we have a complete window, record its max
                        if (j >= k - 1) {
                            const maxVal = arr[deque[0]];
                            maxInWindows.push({ startIdx: windowStart, maxValue: maxVal });
                        }
                    }

                    // Now we know the max for each valid window up to i.
                    // The *latest* window ends at i -> start = i-k+1
                    const windowStart = i - k + 1;
                    const isValidWindow = windowStart >= 0;

                    // If valid, the max is arr[deque[0]] for the current window [windowStart..i].
                    let currentMax: number | null = null;
                    if (isValidWindow && deque.length > 0) {
                        currentMax = arr[deque[0]];
                    }

                    // Let's visualize the array in 1 row of boxes.
                    // We'll highlight the window portion in lightblue,
                    // and highlight the max element in gold or something.
                    const boxes = arr.map((val, idx) => {
                        let background = '#eee';
                        if (isValidWindow && idx >= windowStart && idx <= i) {
                            background = '#add8e6'; // highlight the window
                        }
                        if (currentMax !== null && val === currentMax && idx === deque[0]) {
                            // specifically highlight the max
                            background = '#ffd700';
                        }
                        return (
                            <div
                                key={idx}
                                style={{
                                    display: 'inline-block',
                                    width: '3rem',
                                    height: '3rem',
                                    lineHeight: '3rem',
                                    textAlign: 'center',
                                    marginRight: '4px',
                                    background,
                                    border: '1px solid #ccc',
                                }}
                            >
                                {val}
                            </div>
                        );
                    });

                    return (
                        <div style={{ border: '1px dashed #aaa', margin: '1rem 0', padding: '0.5rem' }}>
                            <p>
                                <strong>i = {i}</strong> (Current index in the main loop)
                            </p>
                            <div>{boxes}</div>

                            {isValidWindow ? (
                                <p style={{ marginTop: '0.5rem' }}>
                                    Current window = [{windowStart}..{i}] → size {k},
                                    <br />
                                    Window values = {arr.slice(windowStart, i + 1).join(', ')}
                                    <br />
                                    Max in this window = <strong>{currentMax}</strong>
                                </p>
                            ) : (
                                <p style={{ marginTop: '0.5rem' }}>
                                    Window not yet of size {k} (need i ≥ {k - 1})
                                </p>
                            )}
                        </div>
                    );
                }}
            </ForLoop>
        </main>
    );
}
