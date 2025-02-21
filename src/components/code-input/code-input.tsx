import React, { useState } from 'react';
import LoopComponent from '@/components/for-loop/for-loop';
import { Tab, Disclosure } from '@headlessui/react';

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
  const [ifElseSnippet, setIfElseSnippet] = useState('');
  const [switchSnippet, setSwitchSnippet] = useState('');
  const [genericLoopSnippet, setGenericLoopSnippet] = useState('');

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

  const handleReset = () => {
    setCodeSnippet('');
    setParsedLoops(null);
  };

  return (
    <div>
      <div>
        {/* Desktop View: Tabs for md and above */}
        <div className="hidden md:block">
          <Tab.Group>
            <Tab.List className="flex space-x-1 border-b">
              {['For Loop', 'If/else Statement', 'Switch', 'Generic Loop'].map((label) => (
                <Tab
                  key={label}
                  className={({ selected }) =>
                    selected
                      ? 'bg-white py-2 px-4 text-blue-700 border border-b-0 rounded-t'
                      : 'bg-gray-100 py-2 px-4 text-gray-600 rounded-t'
                  }
                >
                  {label}
                </Tab>
              ))}
            </Tab.List>
            <Tab.Panels>
              <Tab.Panel className="p-4 border border-t-0 rounded-b">
              <textarea
                value={codeSnippet}
                onChange={(e) => setCodeSnippet(e.target.value)}
                placeholder="Paste or type your for-loop snippet here..."
                className="w-full h-40 mb-5 p-2 border rounded"
                rows={10}
              />
              </Tab.Panel>
              <Tab.Panel className="p-4 border border-t-0 rounded-b">
              <textarea
                value={ifElseSnippet}
                onChange={(e) => setIfElseSnippet(e.target.value)}
                placeholder="Paste or type your if/else snippet here..."
                className="w-full h-40 mb-5 p-2 border rounded"
                rows={10}
              />
              </Tab.Panel>
              <Tab.Panel className="p-4 border border-t-0 rounded-b">
              <textarea
                value={switchSnippet}
                onChange={(e) => setSwitchSnippet(e.target.value)}
                placeholder="Paste or type your switch snippet here..."
                className="w-full h-40 mb-5 p-2 border rounded"
                rows={10}
              />
              </Tab.Panel>
              <Tab.Panel className="p-4 border border-t-0 rounded-b">
              <textarea
                value={genericLoopSnippet}
                onChange={(e) => setGenericLoopSnippet(e.target.value)}
                placeholder="Paste or type your generic loop snippet here..."
                className="w-full h-40 mb-5 p-2 border rounded"
                rows={10}
              />
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>

        {/* Mobile View: Accordions for screens below md */}
        <div className="block md:hidden space-y-4">
          <Disclosure>
            {({ open }) => (
              <div>
                <Disclosure.Button
                  as="button"
                  className="w-full text-left py-2 px-4 bg-gray-200 rounded-md focus:outline-none"
                >
                  For Loop {open ? '-' : '+'}
                </Disclosure.Button>
                <Disclosure.Panel
                  as="div"
                  className="mt-2 p-4 border rounded-md"
                >
                <textarea
                  value={codeSnippet}
                  onChange={(e) => setCodeSnippet(e.target.value)}
                  placeholder="Paste or type your for-loop snippet here..."
                  className="w-full h-40 mb-5 p-2 border rounded"
                  rows={10}
                />
                </Disclosure.Panel>
              </div>
            )}
          </Disclosure>

          <Disclosure>
            {({ open }) => (
              <div>
                <Disclosure.Button
                  as="button"
                  className="w-full text-left py-2 px-4 bg-gray-200 rounded-md focus:outline-none"
                >
                  If/else Statement {open ? '-' : '+'}
                </Disclosure.Button>
                <Disclosure.Panel
                  as="div"
                  className="mt-2 p-4 border rounded-md"
                >
                <textarea
                  value={ifElseSnippet}
                  onChange={(e) => setIfElseSnippet(e.target.value)}
                  placeholder="Paste or type your if/else snippet here..."
                  className="w-full h-40 mb-5 p-2 border rounded"
                  rows={10}
                />
                </Disclosure.Panel>
              </div>
            )}
          </Disclosure>

          <Disclosure>
            {({ open }) => (
              <div>
                <Disclosure.Button
                  as="button"
                  className="w-full text-left py-2 px-4 bg-gray-200 rounded-md focus:outline-none"
                >
                  Switch {open ? '-' : '+'}
                </Disclosure.Button>
                <Disclosure.Panel
                  as="div"
                  className="mt-2 p-4 border rounded-md"
                >
                <textarea
                  value={switchSnippet}
                  onChange={(e) => setSwitchSnippet(e.target.value)}
                  placeholder="Paste or type your switch snippet here..."
                  className="w-full h-40 mb-5 p-2 border rounded"
                  rows={10}
                />
                </Disclosure.Panel>
              </div>
            )}
          </Disclosure>

          <Disclosure>
            {({ open }) => (
              <div>
                <Disclosure.Button
                  as="button"
                  className="w-full text-left py-2 px-4 bg-gray-200 rounded-md focus:outline-none"
                >
                  Generic Loop {open ? '-' : '+'}
                </Disclosure.Button>
                <Disclosure.Panel
                  as="div"
                  className="mt-2 p-4 border rounded-md"
                >
                <textarea
                  value={genericLoopSnippet}
                  onChange={(e) => setGenericLoopSnippet(e.target.value)}
                  placeholder="Paste or type your generic loop snippet here..."
                  className="w-full h-40 mb-5 p-2 border rounded"
                  rows={10}
                />
                </Disclosure.Panel>
              </div>
            )}
          </Disclosure>
        </div>
      </div>
      <button
        onClick={handleRunCode}
        className="rounded bg-slate-600 p-2 text-white font-mono mt-2 mr-2"
      >
        Run Code
      </button>
      <button
        onClick={handleReset}
        className="rounded bg-green-600 p-2 text-white font-mono mt-2"
      >
        Reset
      </button>
      {parsedLoops && (
        <div style={{ marginTop: '20px' }}>{renderLoops(parsedLoops)}</div>
      )}
    </div>
  );
};

export default CodeParserInputComponent;
