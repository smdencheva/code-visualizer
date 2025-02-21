'use client';

import CodeParserInputComponent from '@/components/code-input/code-input';
import React from 'react';

export default function Home() {
  const handleTextChange = (text: string) => {
    console.log('Text changed:', text);
  };
  return (
    <div>
      <div className="bg-slate-100 p-5 flex flex-row">
        <div>
            <h1>Programming Problem Solutions</h1>
          <section>
            <p className="paragraph">
              Welcome to our page where we showcase a variety of solutions to common programming challenges.
              Here you'll find detailed explanations, code examples, and best practices to help you tackle your coding problems.
              If you want to test a problem of your own, paste it bellow.
            </p>
          </section>
          <section className="example">
            <CodeParserInputComponent />
          </section>
        </div>
      </div>
    </div>
  );
}
