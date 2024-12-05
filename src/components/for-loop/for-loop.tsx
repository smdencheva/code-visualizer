import React, { useState } from 'react';

interface LoopData {
  label: string;
  iterator: number; // Initial iterator value
  step: number;
  limit: number;
  children?: React.ReactNode;
}

interface LoopComponentProps {
  loopData: LoopData;
  onUpdate: (updatedLoop: LoopData) => void;
  key?: string;
}

const LoopComponent: React.FC<LoopComponentProps> = ({
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

  const toggleSlider = () => setShowSlider((prev) => !prev); // Toggle slider visibility

  const generateTicks = () => {
    const ticks = [];
    for (let i = loopData.iterator; i <= loopData.limit; i += loopData.step) {
      ticks.push(i);
    }
    return ticks;
  };

  return (
    <div
      style={{
        marginBottom: '20px', // Add space between loops
      }}
    >
      {/* Loop clickable link */}
      <a
        onClick={toggleSlider}
        style={{
          cursor: 'pointer',
          color: '#007BFF',
          textDecoration: 'underline',
          fontFamily: 'monospace', // Mimic code style
        }}
      >
        for (let {currentData.label} = {loopData.iterator}; {currentData.label}{' '}
        {'<'} {loopData.limit}; {currentData.label} += {loopData.step})
      </a>
      {/* Comment with loop data */}
      <span style={{ marginLeft: '30px', color: '#6c757d' }}>
        // Iterator: {currentData.iterator}, Step: {currentData.step}, Limit:{' '}
        {currentData.limit}
      </span>
      <br />
      {showSlider && (
        <div style={{ position: 'relative', marginBottom: '100px' }}>
          {/* Slider */}
          <input
            type="range"
            min={loopData.iterator} // Initial iterator value
            max={loopData.limit} // Limit value
            step={loopData.step} // Increment step
            value={currentData.iterator} // Current iterator value
            onInput={(e) =>
              handleSliderChange(parseInt(e.currentTarget.value, 10))
            }
            style={{
              display: 'block',
              width: '100%', // Full width
              height: '8px', // Thickness
              background: 'linear-gradient(to right, #ddd, #ccc)', // Track gradient
              borderRadius: '5px', // Rounded edges
              cursor: 'pointer', // Pointer cursor for better UX
            }}
          />
          {/* Tick Marks */}
          <div
            style={{
              position: 'absolute',
              top: '20px', // Place the ticks below the slider
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
                <span
                  style={{
                    position: 'relative',
                    top: '12px', // Position the labels below the ticks
                  }}
                >
                  {tick}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
      {'{'}
      {children}
      {'}'}
    </div>
  );
};

export default LoopComponent;
