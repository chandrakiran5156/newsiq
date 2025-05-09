
import React from 'react';
import ThemeToggle from '@/components/ui-custom/ThemeToggle';
import { Link } from 'react-router-dom';

type MainLayoutProps = {
  children: React.ReactNode;
};

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-background border-b">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/home" className="text-xl font-bold">
            LearnApp
          </Link>
          <div className="flex items-center space-x-2">
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 container mx-auto px-4 py-6">
        {children}
      </main>
      
      {/* Mobile navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t py-2 z-10">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <Link to="/home" className="flex flex-col items-center p-2">
              <span className="text-xs">Home</span>
            </Link>
            <Link to="/discover" className="flex flex-col items-center p-2">
              <span className="text-xs">Discover</span>
            </Link>
            <Link to="/library" className="flex flex-col items-center p-2">
              <span className="text-xs">Library</span>
            </Link>
            <Link to="/profile" className="flex flex-col items-center p-2">
              <span className="text-xs">Profile</span>
            </Link>
          </div>
        </div>
      </nav>
      
      {/* Desktop sidebar */}
      <div className="hidden md:block fixed top-16 bottom-0 left-0 w-64 bg-background border-r p-4">
        <div className="space-y-2">
          <Link to="/home" className="flex items-center p-2 hover:bg-accent rounded-md">
            Home
          </Link>
          <Link to="/discover" className="flex items-center p-2 hover:bg-accent rounded-md">
            Discover
          </Link>
          <Link to="/library" className="flex items-center p-2 hover:bg-accent rounded-md">
            Library
          </Link>
          <Link to="/achievements" className="flex items-center p-2 hover:bg-accent rounded-md">
            Achievements
          </Link>
          <Link to="/leaderboard" className="flex items-center p-2 hover:bg-accent rounded-md">
            Leaderboard
          </Link>
          <Link to="/profile" className="flex items-center p-2 hover:bg-accent rounded-md">
            Profile
          </Link>
        </div>
      </div>
      
      {/* Main content container with proper padding for sidebar */}
      <div className="md:ml-64">
        {/* This is empty because we already have the main content above,
            but this div provides proper spacing for the sidebar */}
      </div>
    </div>
  );
};
