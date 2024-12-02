'use client';

import CodeInput from '@/components/code-input/code-input';
import ForLoop from '@/components/for-loop/for-loop';
import GenericLoop from '@/components/generic-loop/generic-loop';
import IfElseStatement from '@/components/if-else-statements/if-else-statements';
import Switch from '@/components/switch/switch';
import FoorLoop from '@/components/for-loop/for-loop';
import CodeParserInputComponent from '@/components/code-input/code-input';

export default function Home() {
  const handleTextChange = (text: string) => {
    console.log('Text changed:', text);
  };
  return (
    <div className="font-mono">
      <header className="bg-slate-300 p-5">
        <h1 className="text-center font-bold">Code Visualizer</h1>
      </header>
      <main className="bg-slate-100 p-5 flex flex-row">
        <div className="basis-1/2 p-5">
          <CodeParserInputComponent />
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center bg-slate-800 p-5 text-white"></footer>
    </div>
  );
}
