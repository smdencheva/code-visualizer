import React, { useState, useEffect } from 'react';
import {
  Accordion,
  AccordionHeader,
  AccordionBody,
} from '@material-tailwind/react';

interface LoopData {
  label: string;
  iterator: number; // Initial iterator value
  step: number;
  limit: number;
  children?: LoopData[];
}

interface LoopComponentProps {
  loopData: LoopData;
  onUpdate: (updatedLoop: LoopData) => void;
}

const LoopComponent: React.FC<LoopComponentProps> = ({
  loopData,
  onUpdate,
}) => {
  const [currentData, setCurrentData] = useState(loopData);
  const [open, setOpen] = useState(false); // Track accordion state
  const [showSlider, setShowSlider] = useState(false); // For slider visibility

  const handleSliderChange = (value: number) => {
    setCurrentData((prev) => ({
      ...prev,
      iterator: value,
    }));
  };

  const handleAccordionToggle = () => setOpen((prev) => !prev); // Toggle accordion state
  const toggleSlider = () => setShowSlider((prev) => !prev); // Toggle slider visibility
  console.log(loopData);
  console.log(currentData);
  return (
    <Accordion
      open={open}
      className="mb-2 rounded-lg border border-blue-gray-100 p-4"
    >
      <AccordionHeader
        onClick={handleAccordionToggle}
        className="border-b-0 transition-colors text-blue-500 hover:!text-blue-700"
      >
        Loop: {currentData.label}
      </AccordionHeader>
      {open && (
        <AccordionBody className="p-4 text-base font-normal">
          <span>Iterator: </span>
          {currentData.iterator}
          <br />
          <span>Step: </span>
          {currentData.step}
          <br />
          <span>Limit: </span>
          {currentData.limit}
          <br />
          <button
            onClick={toggleSlider}
            className="rounded bg-slate-600 p-2 text-white font-mono mt-2 mr-2"
          >
            Adjust Iterator
          </button>
          {showSlider && (
            <input
              type="range"
              min={loopData.iterator} // Initial iterator value
              max={loopData.limit} // Limit value
              step={loopData.step} // Raw slider step, adjustments are handled manually
              value={currentData.iterator} // Current iterator value
              onInput={(e) =>
                handleSliderChange(parseInt(e.currentTarget.value, 10))
              } // Update iterator
              style={{
                appearance: 'none', // Remove browser styles for better customization
                width: '100%', // Full width of the container
                height: '8px', // Thickness of the slider
                margin: '10px 0', // Vertical spacing
                background: 'linear-gradient(to right, #ddd, #ccc)', // Gradient for track
                borderRadius: '5px', // Rounded edges for the track
                cursor: 'pointer', // Pointer cursor for better UX
              }}
            />
          )}
          {/* Render nested loops */}
          {currentData.children &&
            currentData.children.map((childLoop, index) => (
              <LoopComponent
                key={`${childLoop.label}-${index}`}
                loopData={childLoop}
                onUpdate={(updatedChild) => {
                  const updatedChildren = currentData.children!.map(
                    (child, i) => (i === index ? updatedChild : child),
                  );
                  setCurrentData((prev) => ({
                    ...prev,
                    children: updatedChildren,
                  }));
                }}
              />
            ))}
        </AccordionBody>
      )}
    </Accordion>
  );
};

export default LoopComponent;
