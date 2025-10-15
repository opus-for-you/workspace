import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Target, CheckSquare, Users, TrendingUp, Calendar, Clock } from "lucide-react";
import { format, parseISO, differenceInDays } from "date-fns";
import type { Goal, Task, Connection } from "@shared/schema";

export default function DashboardPage() {
  const { data: goals = [], isLoading: goalsLoading } = useQuery<Goal[]>({
    queryKey: ["/api/goals"],
  });

  const { data: tasks = [], isLoading: tasksLoading } = useQuery<Task[]>({
    queryKey: ["/api/tasks"],
  });

  const { data: connections = [], isLoading: connectionsLoading } = useQuery<Connection[]>({
    queryKey: ["/api/connections"],
  });

  const incompleteTasks = tasks.filter(t => t.status !== "done");
  const upcomingTasks = incompleteTasks.filter(t => t.dueDate).slice(0, 5);
  const activeGoals = goals.filter(g => g.progress < 100).slice(0, 3);
  
  const needsAttention = connections.filter(c => {
    if (!c.lastTouch) return true;
    const daysSince = differenceInDays(new Date(), parseISO(c.lastTouch));
    return daysSince > 30;
  }).slice(0, 3);

  const completedTasks = tasks.filter(t => t.status === "done").length;
  const avgGoalProgress = goals.length > 0 
    ? Math.round(goals.reduce((sum, g) => sum + g.progress, 0) / goals.length) 
    : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2" data-testid="text-dashboard-title">
          Dashboard
        </h1>
        <p className="text-muted-foreground">Welcome back! Here's your overview.</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover-elevate">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Goals</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-active-goals">
              {goalsLoading ? "..." : goals.filter(g => g.progress < 100).length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {avgGoalProgress}% average progress
            </p>
          </CardContent>
        </Card>

        <Card className="hover-elevate">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Tasks</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-open-tasks">
              {tasksLoading ? "..." : incompleteTasks.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {completedTasks} completed
            </p>
          </CardContent>
        </Card>

        <Card className="hover-elevate">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Connections</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-connections-count">
              {connectionsLoading ? "..." : connections.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {needsAttention.length} need attention
            </p>
          </CardContent>
        </Card>

        <Card className="hover-elevate">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Productivity</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-productivity">
              {tasksLoading ? "..." : `${completedTasks}/${tasks.length}`}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Tasks completed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Upcoming Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            {tasksLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading...</div>
            ) : upcomingTasks.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CheckSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No upcoming tasks</p>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-start justify-between gap-4 p-3 rounded-lg hover-elevate"
                    data-testid={`task-${task.id}`}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{task.title}</p>
                      {task.description && (
                        <p className="text-sm text-muted-foreground truncate">{task.description}</p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      {task.dueDate && (
                        <span className="text-xs font-mono text-muted-foreground whitespace-nowrap">
                          {format(parseISO(task.dueDate), "MMM d")}
                        </span>
                      )}
                      <Badge variant="secondary" className="text-xs">
                        {task.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Goal Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Goal Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            {goalsLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading...</div>
            ) : activeGoals.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Target className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No active goals</p>
              </div>
            ) : (
              <div className="space-y-4">
                {activeGoals.map((goal) => (
                  <div key={goal.id} className="space-y-2" data-testid={`goal-${goal.id}`}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{goal.title}</p>
                        {goal.targetDate && (
                          <p className="text-xs font-mono text-muted-foreground">
                            Due: {format(parseISO(goal.targetDate), "MMM d, yyyy")}
                          </p>
                        )}
                      </div>
                      <span className="text-sm font-semibold">{goal.progress}%</span>
                    </div>
                    <Progress value={goal.progress} className="h-2" />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Connection Reminders */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Connection Reminders
            </CardTitle>
          </CardHeader>
          <CardContent>
            {connectionsLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading...</div>
            ) : needsAttention.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>All connections are up to date!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {needsAttention.map((connection) => {
                  const daysSince = connection.lastTouch 
                    ? differenceInDays(new Date(), parseISO(connection.lastTouch)) 
                    : null;
                  
                  return (
                    <div
                      key={connection.id}
                      className="p-4 border rounded-lg hover-elevate"
                      data-testid={`connection-reminder-${connection.id}`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{connection.name}</p>
                          <p className="text-sm text-muted-foreground">{connection.relationship}</p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {daysSince ? `${daysSince}d ago` : "Never"}
                        </Badge>
                      </div>
                      {connection.notes && (
                        <p className="text-xs text-muted-foreground line-clamp-2">{connection.notes}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
