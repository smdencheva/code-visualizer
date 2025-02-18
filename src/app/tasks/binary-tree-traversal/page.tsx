'use client';

import React from 'react';
import ForLoop from '@/components/ForLoop';

/** Tree node definition */
interface TreeNode {
  value: number;
  left?: TreeNode;
  right?: TreeNode;
}

/** Snapshot of each traversal step */
interface Snapshot {
  currentNodeValue: number;
  visited: number[];
  stack: number[];
  description: string;
}

/** Pseudocode snippet for reference */
const PREORDER_CODE_SNIPPET = `
function preOrderTraversal(root):
  if root is null:
    return
  stack = [root]
  visited = []
  while stack is not empty:
    node = stack.pop()
    visited.push(node.value)
    if node.right exists:
      stack.push(node.right)
    if node.left exists:
      stack.push(node.left)
  return visited
`;

/** Sample binary tree:
 *           1
 *         /   \\
 *        2     3
 *       / \\     \\
 *      4   5     6
 */
const sampleTree: TreeNode = {
  value: 1,
  left: {
    value: 2,
    left: { value: 4 },
    right: { value: 5 },
  },
  right: {
    value: 3,
    right: { value: 6 },
  },
};

/**
 * Computes snapshots for an iterative pre‑order traversal.
 * We record the visited nodes, the current stack (by node values),
 * and a description for each step.
 */
function computePreorderSnapshots(root: TreeNode): Snapshot[] {
  const snapshots: Snapshot[] = [];
  const stack: TreeNode[] = [];
  const visited: number[] = [];

  if (root) {
    stack.push(root);
  }

  while (stack.length > 0) {
    const node = stack.pop()!;
    visited.push(node.value);
    snapshots.push({
      currentNodeValue: node.value,
      visited: [...visited],
      stack: stack.map((n) => n.value),
      description: `Visited node ${node.value}.`,
    });

    // Push right child first so that left is processed next.
    if (node.right) {
      stack.push(node.right);
    }
    if (node.left) {
      stack.push(node.left);
    }
  }

  return snapshots;
}

const snapshots = computePreorderSnapshots(sampleTree);

/**
 * A recursive component to visualize the binary tree.
 * It highlights nodes based on whether they have been visited
 * or are the current node being processed.
 */
interface TreeVisualizationProps {
  node: TreeNode;
  visited: number[];
  currentNode: number;
}

function TreeVisualization({ node, visited, currentNode }: TreeVisualizationProps) {
  const isVisited = visited.includes(node.value);
  const isCurrent = node.value === currentNode;

  return (
    <div style={{ textAlign: 'center', margin: '1rem' }}>
      <div
        style={{
          display: 'inline-block',
          padding: '0.5rem 1rem',
          border: `2px solid ${isCurrent ? 'orange' : isVisited ? 'green' : '#ccc'}`,
          borderRadius: '8px',
          backgroundColor: isCurrent ? '#ffebcd' : isVisited ? '#d0f0c0' : '#eee',
          minWidth: '2rem',
        }}
      >
        {node.value}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '0.5rem' }}>
        {node.left && (
          <div style={{ marginRight: '1rem' }}>
            <TreeVisualization node={node.left} visited={visited} currentNode={currentNode} />
          </div>
        )}
        {node.right && (
          <div style={{ marginLeft: '1rem' }}>
            <TreeVisualization node={node.right} visited={visited} currentNode={currentNode} />
          </div>
        )}
      </div>
    </div>
  );
}

export default function BinaryTreeTraversalPage() {
  return (
    <main style={{ padding: '1rem', fontFamily: 'sans-serif' }}>
      <h1>Binary Tree Traversal Visualization (Pre‑order)</h1>
      <p>
        Pre‑order traversal visits the root node first, then recursively traverses the left subtree,
        followed by the right subtree. In this example, we use an iterative approach with a stack.
      </p>

      <pre
        style={{
          background: '#f8f8f8',
          padding: '1rem',
          whiteSpace: 'pre-wrap',
          borderRadius: '4px',
        }}
      >
        {PREORDER_CODE_SNIPPET}
      </pre>

      <p>Sample Binary Tree:</p>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        {/* Initially, nothing is visited. */}
        <TreeVisualization node={sampleTree} visited={[]} currentNode={-1} />
      </div>

      <ForLoop start={0} end={snapshots.length - 1} variableName="step">
        {({ step }) => {
          const snapshot = snapshots[step];

          return (
            <div
              style={{
                border: '1px dashed #aaa',
                margin: '1rem 0',
                padding: '1rem',
                borderRadius: '8px',
              }}
            >
              <p>
                <strong>
                  Step {step + 1} of {snapshots.length}
                </strong>
                : {snapshot.description}
              </p>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <TreeVisualization
                  node={sampleTree}
                  visited={snapshot.visited}
                  currentNode={snapshot.currentNodeValue}
                />
              </div>
              <p>Visited Nodes: [{snapshot.visited.join(', ')}]</p>
              <p>Stack: [{snapshot.stack.join(', ')}]</p>
            </div>
          );
        }}
      </ForLoop>
    </main>
  );
}
