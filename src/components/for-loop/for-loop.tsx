import React, { useState, useEffect } from 'react';

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

  // Sync local state with parent updates (when parent state changes)
  useEffect(() => {
    setCurrentData(loopData);
  }, [loopData]);

  // Notify parent only when relevant changes occur
  useEffect(() => {
    // Compare current state with the parent state to prevent redundant updates
    if (
      currentData.iterator !== loopData.iterator ||
      currentData.step !== loopData.step ||
      currentData.limit !== loopData.limit
    ) {
      onUpdate(currentData);
    }
  }, [currentData.iterator, currentData.step, currentData.limit]);

  const handleNext = () => {
    if (currentData.iterator + currentData.step <= currentData.limit) {
      setCurrentData((prev) => ({
        ...prev,
        iterator: prev.iterator + prev.step,
      }));
    }
  };

  const handlePrevious = () => {
    if (currentData.iterator - currentData.step >= loopData.iterator) {
      setCurrentData((prev) => ({
        ...prev,
        iterator: prev.iterator - prev.step,
      }));
    }
  };

  return (
    <div
      style={{
        marginBottom: '20px',
        paddingLeft: '20px',
        borderLeft: '2px solid #ccc',
      }}
    >
      <table className="border-collapse border border-slate-400 text-left w-full p-5">
        <thead>
          <tr>
            <th className="border border-slate-300 p-5">Iterator</th>
            <th className="border border-slate-300 p-5">Step</th>
            <th className="border border-slate-300 p-5">Limit</th>
            <th className="border border-slate-300 p-5">Controls</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-slate-300 p-5">
              {currentData.iterator}
            </td>
            <td className="border border-slate-300 p-5">{currentData.step}</td>
            <td className="border border-slate-300 p-5">{currentData.limit}</td>
            <td className="border border-slate-300 p-5">
              <button
                onClick={handlePrevious}
                disabled={currentData.iterator <= loopData.iterator}
                className="rounded bg-slate-600 p-2 text-white font-mono mt-2 mr-2"
              >
                Previous
              </button>
              <button
                onClick={handleNext}
                disabled={currentData.iterator >= currentData.limit}
                className="rounded bg-slate-600 p-2 text-white font-mono mt-2"
              >
                Next
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      {children}
    </div>
  );
};

export default LoopComponent;
