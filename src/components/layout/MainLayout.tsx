
import { ReactNode, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, Award, User, Search, Menu, X, Sun, Moon } from 'lucide-react';
import ThemeToggle from '../ui-custom/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const location = useLocation();
  const currentPath = location.pathname;
  const isMobile = useIsMobile();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', path: '/home', icon: Home },
    { name: 'Discover', path: '/discover', icon: Search },
    { name: 'Library', path: '/library', icon: BookOpen },
    { name: 'Achievements', path: '/achievements', icon: Award },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <div className="min-h-screen flex flex-col relative pb-16 md:pb-0">
      <header className={`sticky top-0 z-10 bg-background/95 backdrop-blur-md border-b transition-shadow duration-200 ${
        isScrolled ? 'shadow-sm' : ''
      }`}>
        <div className="container flex justify-between items-center py-3">
          <div className="flex items-center">
            <Link to="/home" className="flex items-center">
              <h1 className="text-xl font-bold">
                News<span className="text-primary">IQ</span>
              </h1>
            </Link>
          </div>
          
          {!isMobile && (
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = currentPath === item.path;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                      isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                    }`}
                  >
                    <item.icon size={18} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          )}
          
          <div className="flex items-center gap-2">
            <ThemeToggle />
            
            {!isMobile && (
              <Button asChild variant="outline" size="sm">
                <Link to="/profile">My Account</Link>
              </Button>
            )}
            
            {isMobile && (
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right">
                  <div className="flex flex-col h-full">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-lg font-bold">
                        News<span className="text-primary">IQ</span>
                      </h2>
                      <ThemeToggle />
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      {navItems.map((item) => {
                        const isActive = currentPath === item.path;
                        return (
                          <Link
                            key={item.name}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
                              isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                            }`}
                          >
                            <item.icon size={20} />
                            <span>{item.name}</span>
                          </Link>
                        );
                      })}
                    </div>
                    
                    <div className="mt-auto pt-6">
                      <Button asChild variant="default" className="w-full">
                        <Link to="/login">Logout</Link>
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            )}
          </div>
        </div>
      </header>

      <main className="container flex-1 py-4">
        {children}
      </main>

      {isMobile && (
        <nav className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-md border-t border-border z-10">
          <div className="container flex justify-around py-2">
            {navItems.map((item) => {
              const isActive = currentPath === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex flex-col items-center py-1 px-3 rounded-md ${
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  <item.icon size={20} />
                  <span className="text-xs mt-1">{item.name}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
}
