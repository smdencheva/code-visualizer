'use client';
import React, { useState } from 'react';

interface ForLoopProps {
    start: number;
    end: number;
    variableName: string;
    children: (vars: Record<string, number>) => React.ReactNode;
}

export default function ForLoop({
                                    start,
                                    end,
                                    variableName,
                                    children
                                }: ForLoopProps) {
    const [current, setCurrent] = useState(start);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCurrent(Number(e.target.value));
    };

    const loopVars: Record<string, number> = {
        [variableName]: current,
    };

    return (
        <div style={{ border: '1px solid #ccc', margin: '1rem 0', padding: '1rem' }}>
            <label>
                <strong>{variableName.toUpperCase()}:</strong>
                &nbsp;
                <input
                    type="range"
                    min={start}
                    max={end}
                    value={current}
                    onChange={handleChange}
                    style={{ verticalAlign: 'middle' }}
                />
                <span style={{ marginLeft: '0.5rem' }}>{current}</span>
            </label>

            <div style={{ marginTop: '1rem' }}>
                {/* Render-prop style, passing the current iteration var(s). */}
                {children(loopVars)}
            </div>
        </div>
    );
}
