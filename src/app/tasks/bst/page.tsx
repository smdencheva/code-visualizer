'use client';

import React from 'react';
import ForLoop from '@/components/ForLoop';

interface BSTNode {
    value: number;
    left?: BSTNode;
    right?: BSTNode;
}

/** Build a sample BST (hard-coded). */
function buildSampleBST(): BSTNode {
    // Tree shape:
    //           (8)
    //         /     \
    //       (3)     (10)
    //      /   \       \
    //    (1)   (6)     (14)
    //        /   \    /
    //      (4)   (7)(13)

    return {
        value: 8,
        left: {
            value: 3,
            left: { value: 1 },
            right: {
                value: 6,
                left: { value: 4 },
                right: { value: 7 },
            },
        },
        right: {
            value: 10,
            right: {
                value: 14,
                left: { value: 13 },
            },
        },
    };
}

/**
 * BFS as an array of levels (2D array).
 * We do an actual queue-based BFS first,
 * then store nodes by "levels," e.g.:
 * [[8], [3,10], [1,6,14], [4,7,13]].
 */
function getBfsLevels(root: BSTNode): number[][] {
    const result: number[][] = [];
    const queue: Array<{ node: BSTNode; level: number }> = [{ node: root, level: 0 }];

    while (queue.length > 0) {
        const { node, level } = queue.shift()!;
        if (!result[level]) {
            result[level] = [];
        }
        result[level].push(node.value);

        if (node.left) {
            queue.push({ node: node.left, level: level + 1 });
        }
        if (node.right) {
            queue.push({ node: node.right, level: level + 1 });
        }
    }
    return result;
}

/**
 * Draw an ASCII representation of our specific BST,
 * highlighting visited nodes with '*'.
 */
function drawBstAscii(root: BSTNode, visitedSet: Set<number>): string[] {
    const lines: string[] = [];
    const highlight = (val: number) => (visitedSet.has(val) ? `(${val}*)` : `(${val})`);

    // Hard-coded for this specific BST shape:
    lines.push(`              ${highlight(root.value)}`);
    lines.push(`             /       \\`);

    // Level 2
    const leftVal = root.left ? highlight(root.left.value) : '   ';
    const rightVal = root.right ? highlight(root.right.value) : '   ';
    lines.push(`           ${leftVal}       ${rightVal}`);

    lines.push(`          /   \\         \\`);

    // Level 3
    const leftLeft = root.left?.left ? highlight(root.left.left.value) : '   ';
    const leftRight = root.left?.right ? highlight(root.left.right.value) : '   ';
    const rightRight = root.right?.right ? highlight(root.right.right.value) : '   ';
    lines.push(`        ${leftLeft}   ${leftRight}         ${rightRight}`);

    lines.push(`            /   \\       /`);

    // Level 4
    const leftRightLeft  = root.left?.right?.left  ? highlight(root.left.right.left.value) : '   ';
    const leftRightRight = root.left?.right?.right ? highlight(root.left.right.right.value) : '   ';
    const rightRightLeft = root.right?.right?.left ? highlight(root.right.right.left.value) : '   ';
    lines.push(`          ${leftRightLeft}   ${leftRightRight}     ${rightRightLeft}`);

    return lines;
}

/** The BFS code as a two-loop "solution" we want to show to the user. */
const BFS_CODE_STRING = `
for (int level = 0; level < levels.length; level++) {
    // for each node in levels[level]
    for (int index = 0; index < levels[level].length; index++) {
        // node value = levels[level][index]
        // process node...
    }
}
`;

export default function BstAsciiTraversalPage() {
    const root = buildSampleBST();
    const bfsLevels = getBfsLevels(root);
    // e.g. [[8], [3,10], [1,6,14], [4,7,13]]
    const totalLevels = bfsLevels.length;

    return (
        <main style={{ padding: '1rem', fontFamily: 'monospace' }}>
            <h1>BST ASCII Traversal with 2 Loops</h1>
            <p>
                Below is a BFS solution using two loops: one for the levels, and one for the nodes in each level.
                We'll highlight visited nodes in ASCII as we move through "level" and "index."
            </p>

            <pre style={{ background: '#f8f8f8', padding: '1rem' }}>{BFS_CODE_STRING}</pre>

            <ForLoop start={0} end={totalLevels - 1} variableName="level">
                {({ level }) => (
                    <ForLoop start={0} end={bfsLevels[level].length - 1} variableName="index">
                        {({ index }) => {
                            // All BFS nodes up to current (level, index) are considered "visited."
                            // That means every level < 'level' is fully visited,
                            // plus from 0..index in the current level.
                            const visitedNodes: number[] = [];
                            for (let lvl = 0; lvl < totalLevels; lvl++) {
                                if (lvl < level) {
                                    // entire level visited
                                    visitedNodes.push(...bfsLevels[lvl]);
                                } else if (lvl === level) {
                                    // up to 'index' in this level
                                    visitedNodes.push(...bfsLevels[lvl].slice(0, index + 1));
                                }
                            }
                            const visitedSet = new Set(visitedNodes);

                            // Generate ASCII lines, highlight visited nodes
                            const lines = drawBstAscii(root, visitedSet);

                            return (
                                <div
                                    style={{
                                        border: '1px dashed #aaa',
                                        margin: '1rem 0',
                                        padding: '0.5rem',
                                    }}
                                >
                                    <p>
                                        <strong>Current BFS Step:</strong> level={level}, index={index}
                                        <br />
                                        Visited nodes so far: [{[...visitedSet].join(', ')}]
                                    </p>
                                    {lines.map((line, idx) => (
                                        <div key={idx}>{line}</div>
                                    ))}
                                    <p style={{ marginTop: '0.5rem', fontStyle: 'italic' }}>
                                        (Nodes like <code>(8*)</code> have been visited.)
                                    </p>
                                </div>
                            );
                        }}
                    </ForLoop>
                )}
            </ForLoop>
        </main>
    );
}
