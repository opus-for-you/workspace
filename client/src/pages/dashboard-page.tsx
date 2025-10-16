import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Target, CheckSquare, Users, TrendingUp, Calendar, Clock } from "lucide-react";
import { format, parseISO, differenceInDays } from "date-fns";
import type { Goal, Task, Connection } from "@shared/schema";
import { WeeklyPriorities } from "@/components/dashboard/weekly-priorities";
import { ReflectionPrompt } from "@/components/dashboard/reflection-prompt";

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
      <div className="animate-fade-in">
        <h1 className="heading-editorial-lg mb-2" data-testid="text-dashboard-title">
          Dashboard
        </h1>
        <p className="text-muted-foreground">Welcome back! Here's your overview.</p>
      </div>

      {/* Reflection Prompt - New Editorial Component */}
      <ReflectionPrompt />

      {/* Current Chapter - Organic Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-organic shadow-organic p-6 organic-item-hover">
          <div className="flex items-baseline gap-2">
            <span className="stat-number" data-testid="text-active-goals">
              {goalsLoading ? "..." : goals.filter(g => g.progress < 100).length}
            </span>
            <span className="text-sm text-stone">Goals</span>
          </div>
          <p className="stat-label mt-2">{avgGoalProgress}% average progress</p>
        </div>

        <div className="bg-white rounded-organic shadow-organic p-6 organic-item-hover">
          <div className="flex items-baseline gap-2">
            <span className="stat-number" data-testid="text-open-tasks">
              {tasksLoading ? "..." : incompleteTasks.length}
            </span>
            <span className="text-sm text-stone">Tasks</span>
          </div>
          <p className="stat-label mt-2">{completedTasks} completed</p>
        </div>

        <div className="bg-white rounded-organic shadow-organic p-6 organic-item-hover">
          <div className="flex items-baseline gap-2">
            <span className="stat-number" data-testid="text-connections-count">
              {connectionsLoading ? "..." : connections.length}
            </span>
            <span className="text-sm text-stone">People</span>
          </div>
          <p className="stat-label mt-2">{needsAttention.length} need attention</p>
        </div>

        <div className="bg-white rounded-organic shadow-organic p-6 organic-item-hover">
          <div className="flex items-baseline gap-2">
            <span className="stat-number" data-testid="text-productivity">
              {tasksLoading ? "..." : completedTasks}
            </span>
            <span className="text-sm text-stone">Done</span>
          </div>
          <p className="stat-label mt-2">Out of {tasks.length} total</p>
        </div>
      </div>

      {/* Weekly Priorities - New Editorial Component */}
      <WeeklyPriorities />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Tasks */}
        <div className="bg-white rounded-organic shadow-organic p-8">
          <h3 className="section-title-organic">Upcoming Tasks</h3>
          <div>
            {tasksLoading ? (
              <div className="text-center py-12 text-stone">Loading...</div>
            ) : upcomingTasks.length === 0 ? (
              <div className="text-center py-12 text-stone">
                <CheckSquare className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p>No upcoming tasks</p>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-start justify-between gap-4"
                    data-testid={`task-${task.id}`}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-base text-charcoal mb-1">{task.title}</p>
                      {task.description && (
                        <p className="text-sm text-graphite truncate">{task.description}</p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      {task.dueDate && (
                        <span className="text-xs text-stone whitespace-nowrap">
                          {format(parseISO(task.dueDate), "MMM d")}
                        </span>
                      )}
                      <span className="text-xs text-stone capitalize">{task.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Goal Progress */}
        <div className="bg-white rounded-organic shadow-organic p-8">
          <h3 className="section-title-organic">Goal Progress</h3>
          <div>
            {goalsLoading ? (
              <div className="text-center py-12 text-stone">Loading...</div>
            ) : activeGoals.length === 0 ? (
              <div className="text-center py-12 text-stone">
                <Target className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p>No active goals</p>
              </div>
            ) : (
              <div className="space-y-6">
                {activeGoals.map((goal) => (
                  <div key={goal.id} className="space-y-3" data-testid={`goal-${goal.id}`}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-base text-charcoal mb-1">{goal.title}</p>
                        {goal.targetDate && (
                          <p className="text-xs text-stone">
                            Due: {format(parseISO(goal.targetDate), "MMM d, yyyy")}
                          </p>
                        )}
                      </div>
                      <span className="text-2xl font-serif font-light text-primary">{goal.progress}%</span>
                    </div>
                    <Progress value={goal.progress} className="h-1" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Connection Reminders */}
      <div className="bg-white rounded-organic shadow-organic p-8">
        <h3 className="section-title-organic">Connection Reminders</h3>
        <div>
          {connectionsLoading ? (
            <div className="text-center py-12 text-stone">Loading...</div>
          ) : needsAttention.length === 0 ? (
            <div className="text-center py-12 text-stone">
              <Users className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>All connections are up to date!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {needsAttention.map((connection) => {
                const daysSince = connection.lastTouch 
                  ? differenceInDays(new Date(), parseISO(connection.lastTouch)) 
                  : null;
                
                return (
                  <div
                    key={connection.id}
                    className="bg-alabaster rounded-organic-sm p-6 organic-item-hover"
                    data-testid={`connection-reminder-${connection.id}`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-base text-charcoal mb-1">{connection.name}</p>
                        <p className="text-sm text-stone">{connection.relationship}</p>
                      </div>
                      <span className="text-xs text-stone">
                        {daysSince ? `${daysSince}d ago` : "Never"}
                      </span>
                    </div>
                    {connection.notes && (
                      <p className="text-sm text-graphite line-clamp-2">{connection.notes}</p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
