'use client'; // <-- This is key!

import ForLoop from '@/components/ForLoop';

export default function NestedLoopsPage() {
    return (
        <main style={{ padding: '1rem' }}>
            <h1>Nested Loops Example</h1>
            <p>Adjust the sliders to see i and j (1..10).</p>

            {/* Outer loop for i */}
            <ForLoop start={1} end={10} variableName="i">
                {({ i }) => (
                    // Inner loop for j
                    <ForLoop start={1} end={10} variableName="j">
                        {({ j }) => (
                            <div style={{ marginTop: '1rem' }}>
                                <p>
                                    Current i: <strong>{i}</strong>, Current j: <strong>{j}</strong>
                                </p>
                                <p>
                                    i * j = <strong>{i * j}</strong>
                                </p>
                            </div>
                        )}
                    </ForLoop>
                )}
            </ForLoop>
        </main>
    );
}
