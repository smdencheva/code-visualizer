import React from 'react';

interface SwitchCase {
  label: string;
  body: string;
}

export interface SwitchData {
  type: 'switch';
  expression: string;
  cases: SwitchCase[];
}

interface SwitchComponentProps {
  switchData: SwitchData;
  children?: React.ReactNode;
}

const SwitchComponent: React.FC<SwitchComponentProps> = ({ switchData, children }) => {
  return (
    <div style={{ marginBottom: '20px' }}>
      <a
        style={{
          cursor: 'pointer',
          color: '#007BFF',
          textDecoration: 'underline',
          fontFamily: 'monospace',
          whiteSpace: 'pre',
        }}
      >
        {`switch (${switchData.expression}) {`}
      </a>
      <div
        style={{
          marginLeft: '30px',
          fontFamily: 'monospace',
          color: '#6c757d',
        }}
      >
        {switchData.cases.map((c, index) => (
          <div key={index}>
            {`case ${c.label}: ${c.body}`}
          </div>
        ))}
      </div>
      <a
        style={{
          cursor: 'pointer',
          color: '#007BFF',
          textDecoration: 'underline',
          fontFamily: 'monospace',
          whiteSpace: 'pre',
        }}
      >
        {`}`}
      </a>
      {children}
    </div>
  );
};

export default SwitchComponent;

