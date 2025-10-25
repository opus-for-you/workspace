// Reference: javascript_auth_all_persistance blueprint for routing setup
import { Switch, Route, useLocation } from "wouter";
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
  const [location, setLocation] = useLocation();
  const { user } = useAuth();

  if (!user) {
    return (
      <Switch>
        <Route path="/auth" component={AuthPage} />
        <Route path="/" component={AuthPage} />
        <Route component={NotFound} />
      </Switch>
    );
  }

  // Check if user needs to complete onboarding
  const needsOnboarding = !user.vision || !user.energy || !user.direction || !user.obstacles;
  
  // Redirect to onboarding if needed (unless already there)
  if (needsOnboarding && location !== "/onboarding") {
    setLocation("/onboarding");
    return null;
  }

  // Show onboarding without navigation
  if (location === "/onboarding") {
    return <OnboardingPage />;
  }

  return (
    <div className="min-h-screen bg-ivory">
      <Navigation />
      <main>
        <Switch>
          <Route path="/" component={DashboardPage} />
          <Route path="/goals" component={GoalsPage} />
          <Route path="/tasks" component={TasksPage} />
          <Route path="/connections" component={ConnectionsPage} />
          <Route path="/reviews" component={WeeklyReviewPage} />
          <Route component={NotFound} />
        </Switch>
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
            <Toaster />
            <Router />
          </AuthProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
