import React, { useState } from 'react';
import LoopComponent from '@/components/for-loop/for-loop';

interface LoopData {
  label: string;
  iterator: number;
  limit: number;
  step: number;
  children: LoopData[];
}

const CodeParserInputComponent: React.FC = () => {
  const [codeSnippet, setCodeSnippet] = useState('');
  const [parsedLoops, setParsedLoops] = useState<LoopData[] | null>(null);

  // Function to parse nested for-loops from code
  function parseCode(code: string): LoopData[] {
    const loopRegex = /for\s*\(\s*let\s+(\w+)\s*=\s*(\d+)\s*;\s*\1\s*<\s*(\d+)\s*;\s*(?:(?:\1\s*\+\+)|(?:\+\+\s*\1)|(?:\1\s*\+=\s*(\d+)))\s*\)\s*{/;


    function extractBalancedBody(
      code: string,
      startIndex: number,
    ): [string, number] {
      let stack = 0;
      let i = startIndex;
      console.log(code);
      while (i < code.length) {
        if (code[i] === '{') {
          stack++;
        } else if (code[i] === '}') {
          stack--;
          if (stack === 0) {
            return [code.slice(startIndex + 1, i), i + 1];
          }
        }
        i++;
      }

      throw new Error('Unbalanced brackets in the code.');
    }

    function parseLoops(fullCode: string): LoopData[] {
      const matches: LoopData[] = [];
      let match;

      while ((match = loopRegex.exec(fullCode)) !== null) {
        const [, label, iterator, limit, step] = match;
        const loopStartIndex = match.index + match[0].length - 1;

        // Extract the balanced body for this loop
        const [body, bodyEndIndex] = extractBalancedBody(
          fullCode,
          loopStartIndex,
        );
        console.log(body);
        matches.push({
          label,
          iterator: parseInt(iterator, 10),
          step: parseInt(step, 10),
          limit: parseInt(limit, 10),
          children: parseLoops(body), // Recursively parse nested loops
        });

        // Remove the processed loop from the code
        fullCode = fullCode.slice(bodyEndIndex);
      }

      return matches;
    }

    return parseLoops(code);
  }

  // Recursive rendering function
  const renderLoops = (loops: LoopData[]): React.ReactNode => {
    return loops.map((loop, index) => (
      <LoopComponent key={index} loopData={loop}>
        {/* Recursively render children */}
        {renderLoops(loop.children)}
      </LoopComponent>
    ));
  };

  // Handle Run Code button
  const handleRunCode = () => {
    const parsed = parseCode(codeSnippet);
    setParsedLoops(parsed);
  };

  return (
    <div>
      <h1>Code Parser</h1>
      <textarea
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
        <div style={{ marginTop: '20px' }}>{renderLoops(parsedLoops)}</div>
      )}
    </div>
  );
};

export default CodeParserInputComponent;
