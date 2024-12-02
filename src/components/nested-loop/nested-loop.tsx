import React from 'react';

interface NestedProps {
  iterator: number; // This prop is passed by the parent loop
}

const NestedComponent: React.FC<NestedProps> = ({ iterator }) => {
  return <div>Nested Loop Value: {iterator}</div>;
};

export default NestedComponent;
