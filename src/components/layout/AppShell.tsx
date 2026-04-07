'use client';

import { type ReactNode } from 'react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import Footer from '@/components/layout/Footer';

interface AppShellProps {
  children: ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex h-screen flex-col bg-surface-primary text-white">
      {/* Header */}
      <Header />

      {/* Body: sidebar + main */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* Main content area */}
        <main className="flex flex-1 flex-col overflow-y-auto">
          <div className="flex-1">
            {children}
          </div>

          {/* Footer */}
          <Footer />
        </main>
      </div>
    </div>
  );
}
