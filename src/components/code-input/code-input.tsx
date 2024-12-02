import React, { useState } from 'react';
import LoopComponent from '@/components/for-loop/for-loop';

interface LoopData {
  label: string;
  iterator: number;
  step: number;
  limit: number;
  children?: LoopData[];
}

const CodeParserInputComponent: React.FC = () => {
  const [codeSnippet, setCodeSnippet] = useState('');
  const [parsedLoops, setParsedLoops] = useState<LoopData[] | null>(null);

  // Function to parse nested for-loops from code
  const parseCode = (code: string): LoopData[] => {
    const loopRegex =
      /for\s*\(\s*let\s+(\w+)\s*=\s*(\d+)\s*;\s*\1\s*<\s*(\d+)\s*;\s*\1\s*\+=\s*(\d+)\s*\)\s*{/;

    const findMatchingBraces = (code: string, startIndex: number): string => {
      let openBraces = 0;
      let i = startIndex;

      for (; i < code.length; i++) {
        if (code[i] === '{') openBraces++;
        if (code[i] === '}') openBraces--;

        if (openBraces === 0) {
          return code.substring(startIndex, i + 1); // Return the full body up to the matching closing brace
        }
      }

      return ''; // If no matching brace is found
    };

    const loops: LoopData[] = [];
    let match;

    while ((match = loopRegex.exec(code)) !== null) {
      const [, label, iterator, limit, step] = match;

      // Find the start of the body
      const startIndex = match.index + match[0].length;
      const fullBody = findMatchingBraces(code, startIndex);

      // Recursively parse nested loops
      const nestedLoops = parseCode(fullBody);

      loops.push({
        label,
        iterator: parseInt(iterator, 10),
        step: parseInt(step, 10),
        limit: parseInt(limit, 10),
        children: nestedLoops,
      });

      // Move to the next loop
      code = code.substring(startIndex + fullBody.length);
    }

    return loops;
  };

  // Generate code from loop data
  const generateCode = (loops: LoopData[]): string => {
    return loops
      .map(
        (loop) =>
          `for (let ${loop.label} = ${loop.iterator}; ${loop.label} < ${loop.limit}; ${loop.label} += ${loop.step}) {\n${generateCode(
            loop.children || [],
          )}\n}`,
      )
      .join('\n');
  };

  // Handle Run Code button
  const handleRunCode = () => {
    const parsed = parseCode(codeSnippet);
    setParsedLoops(parsed);
  };

  // Handle updates from LoopComponent
  const handleUpdateLoops = (updatedLoops: LoopData[]) => {
    setParsedLoops(updatedLoops);
    setCodeSnippet(generateCode(updatedLoops));
  };

  return (
    <div style={{ textAlign: 'center', margin: '20px' }}>
      <h1 className="text-center font-bold">Code Parser</h1>
      <textarea
        value={codeSnippet}
        onChange={(e) => setCodeSnippet(e.target.value)}
        placeholder="Paste or type your for-loop snippet here..."
        style={{ width: '100%', height: '150px', marginBottom: '20px' }}
        rows={10}
      />
      <button
        onClick={handleRunCode}
        className="rounded bg-slate-600 p-2 text-white font-mono mt-2 mr-2"
      >
        Run Code
      </button>
      {parsedLoops && (
        <div style={{ marginTop: '20px' }}>
          {parsedLoops.map((loop, index) => (
            <LoopComponent
              key={`${loop.label}-${index}`} // Use a unique key combining the label and index
              loopData={loop}
              onUpdate={(updatedLoop) => {
                const updatedLoops = [...parsedLoops];
                updatedLoops[index] = updatedLoop;
                handleUpdateLoops(updatedLoops);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CodeParserInputComponent;
