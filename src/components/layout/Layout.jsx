import React from 'react';
import { Bell } from 'lucide-react';
import SearchBar from '../common/SearchBar';

export default function Layout({ children, title, LeftSidebar, RightSidebar }) {
  return (
    <div className="flex h-screen bg-background">
      {LeftSidebar && <LeftSidebar />}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-background border-b border-border p-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">{title}</h1>
          <div className="flex items-center space-x-4">
            <SearchBar />
            <Bell className="h-6 w-6 text-muted-foreground" />
          </div>
        </header>
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </main>
      {RightSidebar}
    </div>
  );
}