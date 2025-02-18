'use client';

import Link from 'next/link';
import React from 'react';
import styles from './TaskNavigation.module.css';
import { usePathname } from 'next/navigation';

export interface TaskLink {
  label: string;
  href: string;
}

// Default task links for all folders under /tasks
const defaultTaskLinks: TaskLink[] = [
  { label: 'Nested Loops', href: '/tasks/nested-loops' },
  { label: 'Prefix Sum', href: '/tasks/prefix-sum' },
  { label: 'Sliding Window', href: '/tasks/sliding-window' },
  { label: 'Heap', href: '/tasks/heap' },
  { label: 'Binary Search', href: '/tasks/binary-search' },
  { label: 'Binary Search Tree', href: '/tasks/bst' },
  { label: 'Binary Tree Traversal', href: '/tasks/binary-tree-traversal' },
  { label: 'Matrix', href: '/tasks/matrix' },
  { label: 'Water Containers', href: '/tasks/water' },
  { label: 'Majority Element', href: '/tasks/majority-element' },
  { label: 'Palindrome', href: '/tasks/palindrome' },
];

interface TaskNavigationProps {
  links?: TaskLink[];
}

const TaskNavigation: React.FC<TaskNavigationProps> = ({ links = defaultTaskLinks }) => {
  const pathname = usePathname();

  return (
    <nav className={styles.nav}>
      <ul className={styles.navList}>
        {links.map((link, idx) => {
          // Check if the link matches the current path
          const isActive = pathname === link.href;
          return (
            <li key={idx}>
              <Link
                href={link.href}
                className={`${styles.navLink} ${isActive ? styles.active : ''}`}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default TaskNavigation;
