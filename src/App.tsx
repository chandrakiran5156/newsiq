
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/context/ThemeContext";
import MainLayout from "@/components/layout/MainLayout";

// Pages
import LandingPage from "./pages/LandingPage";
import HomePage from "./pages/HomePage";
import ArticlePage from "./pages/ArticlePage";
import QuizPage from "./pages/QuizPage";
import ProfilePage from "./pages/ProfilePage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Onboarding from "./pages/Onboarding";
import Discover from "./pages/Discover";
import Library from "./pages/Library";
import Achievements from "./pages/Achievements";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Temporary auth check for demo purposes
const isAuthenticated = false;

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={
              isAuthenticated ? <Navigate to="/home" /> : <LandingPage />
            } />
            <Route path="/login" element={
              isAuthenticated ? <Navigate to="/home" /> : <Login />
            } />
            <Route path="/signup" element={
              isAuthenticated ? <Navigate to="/home" /> : <Signup />
            } />
            <Route path="/onboarding" element={<Onboarding />} />

            {/* Main app routes with layout */}
            <Route path="/home" element={
              <MainLayout><HomePage /></MainLayout>
            } />
            <Route path="/article/:id" element={
              <MainLayout><ArticlePage /></MainLayout>
            } />
            <Route path="/quiz/:articleId" element={
              <MainLayout><QuizPage /></MainLayout>
            } />
            <Route path="/discover" element={
              <MainLayout><Discover /></MainLayout>
            } />
            <Route path="/library" element={
              <MainLayout><Library /></MainLayout>
            } />
            <Route path="/achievements" element={
              <MainLayout><Achievements /></MainLayout>
            } />
            <Route path="/profile" element={
              <MainLayout><ProfilePage /></MainLayout>
            } />

            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
