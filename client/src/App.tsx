// Reference: javascript_auth_all_persistance blueprint for routing setup
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Target, 
  CheckSquare, 
  Users, 
  PenLine, 
  LogOut 
} from "lucide-react";
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth-page";
import DashboardPage from "@/pages/dashboard-page";
import GoalsPage from "@/pages/goals-page";
import TasksPage from "@/pages/tasks-page";
import ConnectionsPage from "@/pages/connections-page";
import WeeklyReviewPage from "@/pages/weekly-review-page";

function AppContent() {
  const [location, setLocation] = useLocation();
  const { user, logoutMutation } = useAuth();

  const navItems = [
    { path: "/", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/goals", icon: Target, label: "Goals" },
    { path: "/tasks", icon: CheckSquare, label: "Tasks" },
    { path: "/connections", icon: Users, label: "Connections" },
    { path: "/reviews", icon: PenLine, label: "Reviews" },
  ];

  if (!user) {
    return (
      <Switch>
        <Route path="/auth" component={AuthPage} />
        <Route path="/" component={AuthPage} />
        <Route component={NotFound} />
      </Switch>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-card flex flex-col">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">O</span>
            </div>
            Opus
          </h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.path;
            
            return (
              <Button
                key={item.path}
                variant={isActive ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => setLocation(item.path)}
                data-testid={`nav-${item.label.toLowerCase()}`}
              >
                <Icon className="h-4 w-4 mr-3" />
                {item.label}
              </Button>
            );
          })}
        </nav>

        <div className="p-4 border-t space-y-2">
          <div className="px-3 py-2">
            <p className="text-sm font-medium truncate" data-testid="text-username">
              {user.username}
            </p>
            <p className="text-xs text-muted-foreground">Professional</p>
          </div>
          <div className="flex gap-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="sm"
              className="flex-1"
              onClick={() => {
                logoutMutation.mutate(undefined, {
                  onSuccess: () => setLocation("/auth")
                });
              }}
              disabled={logoutMutation.isPending}
              data-testid="button-logout"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto p-6 md:p-8 max-w-7xl">
          <Switch>
            <Route path="/" component={DashboardPage} />
            <Route path="/goals" component={GoalsPage} />
            <Route path="/tasks" component={TasksPage} />
            <Route path="/connections" component={ConnectionsPage} />
            <Route path="/reviews" component={WeeklyReviewPage} />
            <Route component={NotFound} />
          </Switch>
        </div>
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
      <ThemeProvider defaultTheme="dark">
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
