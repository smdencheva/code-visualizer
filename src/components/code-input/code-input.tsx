import React, { useState } from 'react';
import { Tab, Disclosure } from '@headlessui/react';
import LoopComponent from '@/components/for-loop/for-loop';
import WhileLoopComponent from '@/components/while-loop/while-loop';
import SwitchComponent, { SwitchData } from '@/components/switch/switch';

interface LoopData {
  type: 'for' | 'while';
  label: string;
  iterator: number;
  limit: number;
  step: number;
  children: LoopData[];
}

const CodeParserInputComponent: React.FC = () => {
  // Separate code snippet states for each snippet type
  const [forCodeSnippet, setForCodeSnippet] = useState('');
  const [whileCodeSnippet, setWhileCodeSnippet] = useState('');
  const [switchSnippet, setSwitchSnippet] = useState('');
  const [ifElseSnippet, setIfElseSnippet] = useState('');
  const [genericLoopSnippet, setGenericLoopSnippet] = useState('');

  // Parsed results for for, while, and switch loops/statements
  const [parsedForLoops, setParsedForLoops] = useState<LoopData[] | null>(null);
  const [parsedWhileLoops, setParsedWhileLoops] = useState<LoopData[] | null>(null);
  const [parsedSwitchStatements, setParsedSwitchStatements] = useState<SwitchData[] | null>(null);

  // REGEX for for loops
  const forLoopRegex = /for\s*\(\s*let\s+(\w+)\s*=\s*(\d+)\s*;\s*\1\s*<\s*(\d+)\s*;\s*(?:(?:\1\s*\+\+)|(?:\+\+\s*\1)|(?:\1\s*\+=\s*(\d+)))\s*\)\s*{/;

  // Function to extract the balanced body from a loop or switch statement
  function extractBalancedBody(code: string, startIndex: number): [string, number] {
    let stack = 0;
    let i = startIndex;
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

  // Parser for for loops – sets type to "for"
  function parseForLoops(code: string): LoopData[] {
    const matches: LoopData[] = [];
    let match;
    let workingCode = code;
    while ((match = forLoopRegex.exec(workingCode)) !== null) {
      const [, label, iterator, limit, step] = match;
      const loopStartIndex = match.index + match[0].length - 1;
      const [body, bodyEndIndex] = extractBalancedBody(workingCode, loopStartIndex);
      matches.push({
        type: 'for',
        label,
        iterator: parseInt(iterator, 10),
        step: parseInt(step, 10),
        limit: parseInt(limit, 10),
        children: parseForLoops(body),
      });
      workingCode = workingCode.slice(bodyEndIndex);
    }
    return matches;
  }

  // REGEX for while loops
  // Expects code like:
  // let i = 0;
  // while (i < LIMIT) {
  //   i += STEP;
  //   // ...
  // }
  const whileLoopRegex = /let\s+(\w+)\s*=\s*(\d+);\s*while\s*\(\s*\1\s*<\s*(\d+)\s*\)\s*{/;

  // Parser for while loops – sets type to "while"
  function parseWhileLoops(code: string): LoopData[] {
    const matches: LoopData[] = [];
    let match;
    let workingCode = code;
    while ((match = whileLoopRegex.exec(workingCode)) !== null) {
      const [, label, iterator, limit] = match;
      const loopStartIndex = match.index + match[0].length - 1;
      const [body, bodyEndIndex] = extractBalancedBody(workingCode, loopStartIndex);
      // Extract step from the body: assume "i += STEP;" appears in the loop body
      const stepRegex = new RegExp(label + '\\s*\\+=\\s*(\\d+);');
      const stepMatch = stepRegex.exec(body);
      const step = stepMatch ? parseInt(stepMatch[1], 10) : 1;
      matches.push({
        type: 'while',
        label,
        iterator: parseInt(iterator, 10),
        step,
        limit: parseInt(limit, 10),
        children: parseWhileLoops(body),
      });
      workingCode = workingCode.slice(bodyEndIndex);
    }
    return matches;
  }

  // REGEX for switch statements
  // Expects code like:
  // switch (expression) {
  //   case VALUE: ... break;
  //   default: ...
  // }
  const switchRegex = /switch\s*\(\s*([^)]+)\s*\)\s*{/;

  // Helper: Parse case blocks inside a switch body
  function parseCases(body: string): { label: string; body: string }[] {
    const cases: { label: string; body: string }[] = [];
    const caseRegex = /case\s+([^:]+):([\s\S]*?)(?=case\s+[^:]+:|default:|$)/g;
    let match;
    while ((match = caseRegex.exec(body)) !== null) {
      cases.push({ label: match[1].trim(), body: match[2].trim() });
    }
    // Check for a default case
    const defaultRegex = /default:\s*([\s\S]*)$/;
    const defaultMatch = defaultRegex.exec(body);
    if (defaultMatch) {
      cases.push({ label: 'default', body: defaultMatch[1].trim() });
    }
    return cases;
  }

  // Parser for switch statements – sets type to "switch"
  function parseSwitchStatements(code: string): SwitchData[] {
    const results: SwitchData[] = [];
    let match;
    let workingCode = code;
    while ((match = switchRegex.exec(workingCode)) !== null) {
      const expression = match[1].trim();
      const switchStartIndex = match.index + match[0].length - 1;
      const [body, bodyEndIndex] = extractBalancedBody(workingCode, switchStartIndex);
      const cases = parseCases(body);
      results.push({
        type: 'switch',
        expression,
        cases,
      });
      workingCode = workingCode.slice(bodyEndIndex);
    }
    return results;
  }

  // Recursive rendering function that chooses the proper component based on type
  const renderLoops = (loops: LoopData[]): React.ReactNode => {
    return loops.map((loop, index) => {
      if (loop.type === 'while') {
        return (
          <WhileLoopComponent key={index} loopData={loop}>
            {renderLoops(loop.children)}
          </WhileLoopComponent>
        );
      } else {
        return (
          <LoopComponent key={index} loopData={loop}>
            {renderLoops(loop.children)}
          </LoopComponent>
        );
      }
    });
  };

  // Render parsed switch statements
  const renderSwitchStatements = (switches: SwitchData[]): React.ReactNode => {
    return switches.map((swtch, index) => (
      <SwitchComponent key={index} switchData={swtch} />
    ));
  };

  // Handle Run Code button: parse for, while, and switch snippets
  const handleRunCode = () => {
    const parsedFor = parseForLoops(forCodeSnippet);
    const parsedWhile = parseWhileLoops(whileCodeSnippet);
    const parsedSwitch = parseSwitchStatements(switchSnippet);
    setParsedForLoops(parsedFor);
    setParsedWhileLoops(parsedWhile);
    setParsedSwitchStatements(parsedSwitch);
  };

  const handleReset = () => {
    setForCodeSnippet('');
    setWhileCodeSnippet('');
    setSwitchSnippet('');
    setParsedForLoops(null);
    setParsedWhileLoops(null);
    setParsedSwitchStatements(null);
  };

  return (
    <div>
      <div>
        {/* Desktop View: Tabs for md and above */}
        <div className="hidden md:block">
          <Tab.Group>
            <Tab.List className="flex space-x-1 border-b">
              {[
                'For Loop',
                'While Loop',
                'Switch',
                'If/else Statement',
                'Generic Loop',
              ].map((label) => (
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
              {/* For Loop Panel */}
              <Tab.Panel className="p-4 border border-t-0 rounded-b">
                <textarea
                  value={forCodeSnippet}
                  onChange={(e) => setForCodeSnippet(e.target.value)}
                  placeholder="Paste or type your for-loop snippet here..."
                  className="w-full h-40 mb-5 p-2 border rounded"
                  rows={10}
                />
              </Tab.Panel>
              {/* While Loop Panel */}
              <Tab.Panel className="p-4 border border-t-0 rounded-b">
                <textarea
                  value={whileCodeSnippet}
                  onChange={(e) => setWhileCodeSnippet(e.target.value)}
                  placeholder="Paste or type your while-loop snippet here..."
                  className="w-full h-40 mb-5 p-2 border rounded"
                  rows={10}
                />
              </Tab.Panel>
              {/* Switch Panel */}
              <Tab.Panel className="p-4 border border-t-0 rounded-b">
                <textarea
                  value={switchSnippet}
                  onChange={(e) => setSwitchSnippet(e.target.value)}
                  placeholder="Paste or type your switch snippet here..."
                  className="w-full h-40 mb-5 p-2 border rounded"
                  rows={10}
                />
              </Tab.Panel>
              {/* If/else Panel */}
              <Tab.Panel className="p-4 border border-t-0 rounded-b">
                <textarea
                  value={ifElseSnippet}
                  onChange={(e) => setIfElseSnippet(e.target.value)}
                  placeholder="Paste or type your if/else snippet here..."
                  className="w-full h-40 mb-5 p-2 border rounded"
                  rows={10}
                />
              </Tab.Panel>
              {/* Generic Loop Panel */}
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
          {/* For Loop Accordion */}
          <Disclosure>
            {({ open }) => (
              <div>
                <Disclosure.Button
                  as="button"
                  className="w-full text-left py-2 px-4 bg-gray-200 rounded-md focus:outline-none"
                >
                  For Loop {open ? '-' : '+'}
                </Disclosure.Button>
                <Disclosure.Panel as="div" className="mt-2 p-4 border rounded-md">
                  <textarea
                    value={forCodeSnippet}
                    onChange={(e) => setForCodeSnippet(e.target.value)}
                    placeholder="Paste or type your for-loop snippet here..."
                    className="w-full h-40 mb-5 p-2 border rounded"
                    rows={10}
                  />
                </Disclosure.Panel>
              </div>
            )}
          </Disclosure>
          {/* While Loop Accordion */}
          <Disclosure>
            {({ open }) => (
              <div>
                <Disclosure.Button
                  as="button"
                  className="w-full text-left py-2 px-4 bg-gray-200 rounded-md focus:outline-none"
                >
                  While Loop {open ? '-' : '+'}
                </Disclosure.Button>
                <Disclosure.Panel as="div" className="mt-2 p-4 border rounded-md">
                  <textarea
                    value={whileCodeSnippet}
                    onChange={(e) => setWhileCodeSnippet(e.target.value)}
                    placeholder="Paste or type your while-loop snippet here..."
                    className="w-full h-40 mb-5 p-2 border rounded"
                    rows={10}
                  />
                </Disclosure.Panel>
              </div>
            )}
          </Disclosure>
          {/* Switch Accordion */}
          <Disclosure>
            {({ open }) => (
              <div>
                <Disclosure.Button
                  as="button"
                  className="w-full text-left py-2 px-4 bg-gray-200 rounded-md focus:outline-none"
                >
                  Switch {open ? '-' : '+'}
                </Disclosure.Button>
                <Disclosure.Panel as="div" className="mt-2 p-4 border rounded-md">
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
          {/* If/else Accordion */}
          <Disclosure>
            {({ open }) => (
              <div>
                <Disclosure.Button
                  as="button"
                  className="w-full text-left py-2 px-4 bg-gray-200 rounded-md focus:outline-none"
                >
                  If/else Statement {open ? '-' : '+'}
                </Disclosure.Button>
                <Disclosure.Panel as="div" className="mt-2 p-4 border rounded-md">
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
          {/* Generic Loop Accordion */}
          <Disclosure>
            {({ open }) => (
              <div>
                <Disclosure.Button
                  as="button"
                  className="w-full text-left py-2 px-4 bg-gray-200 rounded-md focus:outline-none"
                >
                  Generic Loop {open ? '-' : '+'}
                </Disclosure.Button>
                <Disclosure.Panel as="div" className="mt-2 p-4 border rounded-md">
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

      {/* Render parsed loops */}
      {parsedForLoops && forCodeSnippet && (
        <div style={{ marginTop: '20px' }}>
          <h3>Parsed For Loops:</h3>
          {renderLoops(parsedForLoops)}
        </div>
      )}
      {parsedWhileLoops && whileCodeSnippet && (
        <div style={{ marginTop: '20px' }}>
          <h3>Parsed While Loops:</h3>
          {renderLoops(parsedWhileLoops)}
        </div>
      )}
      {parsedSwitchStatements && switchSnippet && (
        <div style={{ marginTop: '20px' }}>
          <h3>Parsed Switch Statements:</h3>
          {renderSwitchStatements(parsedSwitchStatements)}
        </div>
      )}
    </div>
  );
};

export default CodeParserInputComponent;
