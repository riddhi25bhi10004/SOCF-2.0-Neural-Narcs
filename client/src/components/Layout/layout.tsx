import React from 'react';
import Navbar from './Navbar';

interface LayoutProps {
  children: React.ReactNode;
}

function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-eco-surface lg:flex lg:items-start">
      <Navbar isSidebar />
      <main className="flex-1 px-6 py-8 lg:py-10">
        {children}
      </main>
    </div>
  );
}

export default Layout;