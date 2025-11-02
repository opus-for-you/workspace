// Reference: javascript_auth_all_persistance blueprint for routing setup
import { BrowserRouter, Routes, Route, useLocation, useNavigate, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import { Navigation } from "@/components/navigation";
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth-page";
import OnboardingPage from "@/pages/onboarding-page";
import DashboardPage from "@/pages/dashboard-page";
import GoalsPage from "@/pages/goals-page";
import TasksPage from "@/pages/tasks-page";
import ConnectionsPage from "@/pages/connections-page";
import WeeklyReviewPage from "@/pages/weekly-review-page";

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Check if user needs to complete onboarding (3 questions: vision, energy, direction)
  const needsOnboarding = user && (!user.vision || !user.energy || !user.direction);

  // Redirect to onboarding if needed (unless already there)
  useEffect(() => {
    if (needsOnboarding && location.pathname !== "/onboarding") {
      navigate("/onboarding", { replace: true });
    }
  }, [needsOnboarding, location.pathname, navigate]);

  if (!user) {
    return (
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/" element={<AuthPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    );
  }

  // Show onboarding without navigation
  if (location.pathname === "/onboarding") {
    return <OnboardingPage />;
  }

  return (
    <div className="min-h-screen bg-ivory">
      <Navigation />
      <main>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/goals" element={<GoalsPage />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/connections" element={<ConnectionsPage />} />
          <Route path="/reviews" element={<WeeklyReviewPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}

function Router() {
  return <AppContent />;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <AuthProvider>
            <BrowserRouter>
              <Toaster />
              <Router />
            </BrowserRouter>
          </AuthProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
