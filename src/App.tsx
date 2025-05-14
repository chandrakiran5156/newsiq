
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/context/ThemeContext";
import { MainLayout } from "@/components/layout/MainLayout";
import { AuthProvider, useAuth } from "@/lib/supabase-auth";
import { useState, createContext, useContext } from "react";

// Pages
import LandingPage from "./pages/LandingPage";
import HomePage from "./pages/HomePage";
import ArticlePage from "./pages/article";
import QuizPage from "./pages/QuizPage";
import ProfilePage from "./pages/ProfilePage";
import Auth from "./pages/Auth";
import Onboarding from "./pages/Onboarding";
import Discover from "./pages/Discover";
import Library from "./pages/Library";
import LeaderboardAndAchievements from "./pages/LeaderboardAndAchievements";
import NotFound from "./pages/NotFound";
import Features from "./pages/Features";
import Contact from "./pages/Contact";

const queryClient = new QueryClient();

// Create a context for guest mode
type GuestModeContextType = {
  isGuestMode: boolean;
  setIsGuestMode: React.Dispatch<React.SetStateAction<boolean>>;
};

const GuestModeContext = createContext<GuestModeContextType | undefined>(undefined);

export const useGuestMode = () => {
  const context = useContext(GuestModeContext);
  if (!context) {
    throw new Error("useGuestMode must be used within a GuestModeProvider");
  }
  return context;
};

// Modified protected route component that allows guest mode
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const { isGuestMode } = useGuestMode();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Allow access if authenticated or in guest mode
  if (!isAuthenticated && !isGuestMode) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();
  const { isGuestMode } = useGuestMode();

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={
        isAuthenticated || isGuestMode ? <Navigate to="/home" /> : <LandingPage />
      } />
      <Route path="/auth" element={
        isAuthenticated || isGuestMode ? <Navigate to="/home" /> : <Auth />
      } />
      <Route path="/features" element={<Features />} />
      <Route path="/contact" element={<Contact />} />

      {/* Protected routes */}
      <Route path="/onboarding" element={
        <ProtectedRoute>
          <Onboarding />
        </ProtectedRoute>
      } />

      {/* Main app routes with layout */}
      <Route path="/home" element={
        <ProtectedRoute>
          <MainLayout><HomePage /></MainLayout>
        </ProtectedRoute>
      } />
      <Route path="/article/:articleId" element={
        <ProtectedRoute>
          <MainLayout><ArticlePage /></MainLayout>
        </ProtectedRoute>
      } />
      <Route path="/quiz/:articleId" element={
        <ProtectedRoute>
          <MainLayout><QuizPage /></MainLayout>
        </ProtectedRoute>
      } />
      <Route path="/discover" element={
        <ProtectedRoute>
          <MainLayout><Discover /></MainLayout>
        </ProtectedRoute>
      } />
      <Route path="/library" element={
        <ProtectedRoute>
          <MainLayout><Library /></MainLayout>
        </ProtectedRoute>
      } />
      <Route path="/leaderboard-achievements" element={
        <ProtectedRoute>
          <MainLayout><LeaderboardAndAchievements /></MainLayout>
        </ProtectedRoute>
      } />
      {/* Add redirects for the old routes */}
      <Route path="/achievements" element={
        <ProtectedRoute>
          <Navigate to="/leaderboard-achievements" replace />
        </ProtectedRoute>
      } />
      <Route path="/leaderboard" element={
        <ProtectedRoute>
          <Navigate to="/leaderboard-achievements" replace />
        </ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute>
          <MainLayout><ProfilePage /></MainLayout>
        </ProtectedRoute>
      } />

      {/* Catch-all route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => {
  const [isGuestMode, setIsGuestMode] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <GuestModeContext.Provider value={{ isGuestMode, setIsGuestMode }}>
            <AuthProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <AppRoutes />
              </BrowserRouter>
            </AuthProvider>
          </GuestModeContext.Provider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
