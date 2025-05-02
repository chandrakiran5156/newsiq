
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/context/ThemeContext";
import MainLayout from "@/components/layout/MainLayout";
import { AuthProvider, useAuth } from "@/lib/supabase-auth";

// Pages
import LandingPage from "./pages/LandingPage";
import HomePage from "./pages/HomePage";
import ArticlePage from "./pages/ArticlePage";
import QuizPage from "./pages/QuizPage";
import ProfilePage from "./pages/ProfilePage";
import Auth from "./pages/Auth";
import Onboarding from "./pages/Onboarding";
import Discover from "./pages/Discover";
import Library from "./pages/Library";
import Achievements from "./pages/Achievements";
import Leaderboard from "./pages/Leaderboard";
import NotFound from "./pages/NotFound";
import Features from "./pages/Features";
import Contact from "./pages/Contact";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={
        isAuthenticated ? <Navigate to="/home" /> : <LandingPage />
      } />
      <Route path="/auth" element={
        isAuthenticated ? <Navigate to="/home" /> : <Auth />
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
      <Route path="/article/:id" element={
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
      <Route path="/achievements" element={
        <ProtectedRoute>
          <MainLayout><Achievements /></MainLayout>
        </ProtectedRoute>
      } />
      <Route path="/leaderboard" element={
        <ProtectedRoute>
          <MainLayout><Leaderboard /></MainLayout>
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

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
