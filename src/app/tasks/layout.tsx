import React from 'react';
import Image from 'next/image';
import TaskNavigation from '@/components/task-navigation/TaskNavigation';


export default function TasksLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="layout-container">
      <header>
        <Image
          src="/logo1.png"
          alt="Logo"
          width={100}
          height={100}
          style={{ margin: '20px auto' }}
        />
      </header>
      <nav className="container mx-auto bg-slate-100"><TaskNavigation /></nav>
      <main className="container mx-auto bg-slate-100">{children}</main>
      <footer
        style={{
          backgroundColor: '#282c34',
          color: '#fff',
          textAlign: 'center',
          padding: '1rem',
        }}
      >
        <p>
          &copy; {new Date().getFullYear()} Algorithm Visualizer. All rights
          reserved.
        </p>
      </footer>
    </div>
  );
}
