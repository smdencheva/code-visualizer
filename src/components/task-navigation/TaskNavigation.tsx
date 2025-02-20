'use client';

import Link from 'next/link';
import React, { useState } from 'react';
import styles from './TaskNavigation.module.css';
import { usePathname } from 'next/navigation';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';


export interface TaskLink {
  label: string;
  href: string;
}

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
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className={styles.nav}>
      {/* Hamburger Button */}
      <button className={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
      </button>


      {/* Navigation List */}
      <ul className={`${styles.navList} ${menuOpen ? styles.navOpen : ''}`}>
        {links.map((link, idx) => {
          const isActive = pathname === link.href;
          return (
            <li key={idx}>
              <Link
                href={link.href}
                className={`${styles.navLink} ${isActive ? styles.active : ''}`}
                onClick={() => setMenuOpen(false)} // Close menu on click
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
