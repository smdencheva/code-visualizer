'use client';

import React from 'react';
import ForLoop from '@/components/ForLoop';

/** Snapshot for each iteration of the palindrome check algorithm */
interface Snapshot {
  left: number;
  right: number;
  leftChar: string;
  rightChar: string;
  match: boolean;
  description: string;
}

/** Pseudocode snippet for reference */
const PALINDROME_CODE_SNIPPET = `
function isPalindrome(s):
  left = 0
  right = s.length - 1
  while left < right:
    if s[left] != s[right]:
      return false
    left++
    right--
  return true
`;

/**
 * Compute snapshots for the palindrome check.
 * At each step, we compare the characters at the left and right pointers,
 * record the result, and move the pointers inward.
 */
function computePalindromeSnapshots(s: string): Snapshot[] {
  let left = 0;
  let right = s.length - 1;
  const snapshots: Snapshot[] = [];

  while (left < right) {
    const leftChar = s[left];
    const rightChar = s[right];
    const match = leftChar === rightChar;
    let description = '';

    if (match) {
      description = `Characters match: '${leftChar}' == '${rightChar}'. Moving inward.`;
    } else {
      description = `Characters do not match: '${leftChar}' != '${rightChar}'. Not a palindrome.`;
    }

    snapshots.push({
      left,
      right,
      leftChar,
      rightChar,
      match,
      description,
    });

    if (!match) {
      break;
    }
    left++;
    right--;
  }

  return snapshots;
}

export default function PalindromePage() {
  // Example input string.
  const inputString = "racecar"; // Change this to try with a non-palindrome (e.g., "hello")
  const snapshots = computePalindromeSnapshots(inputString);

  // If any snapshot indicates a mismatch, the string is not a palindrome.
  const finalResult = snapshots.some(snapshot => !snapshot.match) ? false : true;

  return (
    <main style={{ padding: '1rem', fontFamily: 'sans-serif' }}>
      <h1>Palindrome Check Visualization</h1>
      <p>
        This algorithm checks whether a given string is a palindrome by comparing characters from the beginning
        and end, moving inward until they meet. If all corresponding characters match, the string is a palindrome.
      </p>

      <pre
        style={{
          background: '#f8f8f8',
          padding: '1rem',
          whiteSpace: 'pre-wrap',
          borderRadius: '4px',
        }}
      >
        {PALINDROME_CODE_SNIPPET}
      </pre>

      <p>
        Input String: <strong>"{inputString}"</strong>
      </p>
      <p>
        Final Result: <strong>{finalResult ? "Palindrome" : "Not a Palindrome"}</strong>
      </p>

      <ForLoop start={0} end={snapshots.length - 1} variableName="step">
        {({ step }) => {
          const snapshot = snapshots[step];
          // Visualize the string by mapping each character to a box. Highlight the left and right pointers.
          const charVisual = inputString.split("").map((char, idx) => {
            let background = '#eee';
            if (idx === snapshot.left || idx === snapshot.right) {
              background = snapshot.match ? '#d0f0c0' : '#f0a0a0'; // green if match, red if mismatch
            }
            return (
              <span
                key={idx}
                style={{
                  display: 'inline-block',
                  width: '2rem',
                  height: '2rem',
                  lineHeight: '2rem',
                  textAlign: 'center',
                  marginRight: '4px',
                  background,
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                }}
                title={`Index: ${idx}, Character: ${char}`}
              >
                {char}
              </span>
            );
          });

          return (
            <div
              style={{
                border: '1px dashed #aaa',
                margin: '1rem 0',
                padding: '1rem',
                borderRadius: '4px',
              }}
            >
              <p>
                <strong>
                  Step {step + 1} of {snapshots.length}
                </strong>
              </p>
              <p>{snapshot.description}</p>
              <div style={{ marginBottom: '0.5rem' }}>{charVisual}</div>
              <p>
                <strong>Left Index:</strong> {snapshot.left} ({snapshot.leftChar}) &nbsp;&nbsp;
                <strong>Right Index:</strong> {snapshot.right} ({snapshot.rightChar})
              </p>
            </div>
          );
        }}
      </ForLoop>
    </main>
  );
}
