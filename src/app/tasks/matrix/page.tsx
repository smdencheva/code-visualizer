'use client';

import React from 'react';
import ForLoop from '@/components/ForLoop';

export default function MatrixNestedLoopsPage() {
    const matrixSize = 10;

    // We'll nest ForLoop for i, then ForLoop for j.
    // i slider: 1..10
    // j slider: 1..10
    // In the "children", we display a 10x10 table.
    return (
        <main style={{ padding: '1rem' }}>
            <h1>Matrix Fill via 2 Nested Loops</h1>
            <p>
                We have two sliders: one for <strong>i</strong>, one for <strong>j</strong>.
                A cell (r,c) is considered "filled" if <code>r &lt; i</code> or
                <code> (r == i and c &lt;= j)</code>.
                That matches the typical row-major iteration for
                <code>for (i = 1..10) {'{}'} for (j = 1..10) {'{}'}</code>.
            </p>

            <ForLoop start={1} end={matrixSize} variableName="i">
                {({ i }) => (
                    <ForLoop start={1} end={matrixSize} variableName="j">
                        {({ j }) => {
                            // Build the 10x10 table:
                            const rows = [];
                            for (let row = 1; row <= matrixSize; row++) {
                                const cells = [];
                                for (let col = 1; col <= matrixSize; col++) {
                                    // Determine if (row, col) is "visited" up to (i, j).
                                    let filled = false;
                                    // row < i means fully filled
                                    // row == i means columns up to j are filled
                                    if (row < i) {
                                        filled = true;
                                    } else if (row === i && col <= j) {
                                        filled = true;
                                    }

                                    cells.push(
                                        <td
                                            key={col}
                                            style={{
                                                border: '1px solid #ccc',
                                                width: '3rem',
                                                height: '3rem',
                                                textAlign: 'center',
                                                backgroundColor: filled ? '#add8e6' : 'transparent',
                                            }}
                                        >
                                            {filled ? `${row},${col}` : ''}
                                        </td>
                                    );
                                }
                                rows.push(<tr key={row}>{cells}</tr>);
                            }

                            return (
                                <table style={{ borderCollapse: 'collapse', marginTop: '1rem' }}>
                                    <tbody>{rows}</tbody>
                                </table>
                            );
                        }}
                    </ForLoop>
                )}
            </ForLoop>
        </main>
    );
}
