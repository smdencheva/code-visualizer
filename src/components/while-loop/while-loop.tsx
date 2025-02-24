import React, { useState } from 'react';

interface LoopData {
  label: string;
  iterator: number; // Initial iterator value
  step: number;
  limit: number;
  children?: React.ReactNode;
}

interface WhileLoopComponentProps {
  loopData: LoopData;
  onUpdate: (updatedLoop: LoopData) => void;
  key?: string;
}

const WhileLoopComponent: React.FC<WhileLoopComponentProps> = ({
                                                                 loopData,
                                                                 onUpdate,
                                                                 children,
                                                               }) => {
  const [currentData, setCurrentData] = useState(loopData);
  const [showSlider, setShowSlider] = useState(false); // For slider visibility

  const handleSliderChange = (value: number) => {
    setCurrentData((prev) => ({
      ...prev,
      iterator: value,
    }));
  };

  const toggleSlider = () => setShowSlider((prev) => !prev);

  const generateTicks = () => {
    const ticks = [];
    for (let i = loopData.iterator; i <= loopData.limit; i += loopData.step) {
      ticks.push(i);
    }
    return ticks;
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      {/* While-loop clickable code display */}
      <a
        onClick={toggleSlider}
        style={{
          cursor: 'pointer',
          color: '#007BFF',
          textDecoration: 'underline',
          fontFamily: 'monospace',
          whiteSpace: 'pre-line',
        }}
      >
        {`let ${currentData.label} = ${loopData.iterator};
while (${currentData.label} < ${loopData.limit}) {
  ${currentData.label} += ${loopData.step};
}`}
      </a>
      {/* Comment with loop data */}
      <span style={{ marginLeft: '30px', color: '#6c757d' }}>
        // Iterator: {currentData.iterator}, Step: {currentData.step}, Limit: {currentData.limit}
      </span>
      <br />
      {showSlider && (
        <div style={{ position: 'relative', marginBottom: '100px' }}>
          {/* Slider */}
          <input
            type="range"
            min={loopData.iterator}
            max={loopData.limit}
            step={loopData.step}
            value={currentData.iterator}
            onInput={(e) =>
              handleSliderChange(parseInt(e.currentTarget.value, 10))
            }
            style={{
              display: 'block',
              width: '100%',
              height: '8px',
              background: 'linear-gradient(to right, #ddd, #ccc)',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          />
          {/* Tick Marks */}
          <div
            style={{
              position: 'absolute',
              top: '20px',
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '12px',
              fontFamily: 'monospace',
              color: '#6c757d',
            }}
          >
            {generateTicks().map((tick, index) => (
              <div
                key={index}
                style={{
                  textAlign: 'center',
                  width: '1px',
                  backgroundColor: '#999',
                  height: '10px',
                }}
              >
                <span style={{ position: 'relative', top: '12px' }}>
                  {tick}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Render any child elements passed into the component */}
      {'{'}
      {children}
      {'}'}
    </div>
  );
};

export default WhileLoopComponent;
