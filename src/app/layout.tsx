import type { Metadata } from "next";
import { Roboto } from 'next/font/google';
import "./globals.css";
import React from 'react';
import Image from 'next/image';
import TaskNavigation from '@/components/task-navigation/TaskNavigation';
import Link from 'next/link';

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '700'],
});

export const metadata: Metadata = {
  title: "Algorithm Visualizer",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="font-mono">
      <body>
      <div className="container mx-auto bg-slate-100">
        <header>
          <Link href={"/"}>
            <Image
              src="/logo1.png"
              alt="Logo"
              width={100}
              height={100}
              className="logo"
            />
          </Link>
        </header>
        <nav ><TaskNavigation /></nav>
        <main>{children}</main>
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

      </body>
    </html>
  );
}
