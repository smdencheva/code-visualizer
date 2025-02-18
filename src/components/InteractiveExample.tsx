'use client';
import React, { useState } from 'react';

interface InteractiveExampleProps {
    code: string;
}

export default function InteractiveExample({ code }: InteractiveExampleProps) {
    const [step, setStep] = useState(0);
    const totalSteps = 5;

    const handleNext = () => setStep((prev) => (prev < totalSteps - 1 ? prev + 1 : prev));
    const handlePrev = () => setStep((prev) => (prev > 0 ? prev - 1 : prev));

    return (
        <section style={{ border: '1px solid #ccc', padding: '1rem', marginTop: '1rem' }}>
            <h3>Code:</h3>
            <pre>{code}</pre>

            <h4>Step {step + 1} of {totalSteps}</h4>
            <button onClick={handlePrev} disabled={step === 0}>Previous</button>
            <button onClick={handleNext} disabled={step === totalSteps - 1}>Next</button>

            <div style={{ marginTop: '1rem' }}>
                <h4>Variable States</h4>
                <p>Current step: {step}</p>
            </div>
        </section>
    );
}
