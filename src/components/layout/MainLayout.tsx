
import React from 'react';
import ThemeToggle from '@/components/ui-custom/ThemeToggle';
import { Link } from 'react-router-dom';
import { Home, Search, BookOpen, Trophy, User } from 'lucide-react';

type MainLayoutProps = {
  children: React.ReactNode;
};

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-background border-b sticky top-0 z-20">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/home" className="text-xl font-bold">
            News<span className="text-primary">IQ</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/home" className="hover:text-primary transition-colors">Home</Link>
            <Link to="/discover" className="hover:text-primary transition-colors">Discover</Link>
            <Link to="/library" className="hover:text-primary transition-colors">Library</Link>
            <Link to="/leaderboard-achievements" className="hover:text-primary transition-colors">Achievements</Link>
            <Link to="/profile" className="hover:text-primary transition-colors">Profile</Link>
          </div>
          
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
              <Home size={18} />
              <span className="text-xs mt-1">Home</span>
            </Link>
            <Link to="/discover" className="flex flex-col items-center p-2">
              <Search size={18} />
              <span className="text-xs mt-1">Discover</span>
            </Link>
            <Link to="/library" className="flex flex-col items-center p-2">
              <BookOpen size={18} />
              <span className="text-xs mt-1">Library</span>
            </Link>
            <Link to="/profile" className="flex flex-col items-center p-2">
              <User size={18} />
              <span className="text-xs mt-1">Profile</span>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
};
