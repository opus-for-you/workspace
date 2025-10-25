import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ListTodo, Circle, CheckCircle2 } from "lucide-react";
import type { Task } from "@shared/schema";

export function WeeklyPriorities() {
  const { data: tasks = [], isLoading } = useQuery<Task[]>({
    queryKey: ["/api/tasks"],
  });

  const priorityTasks = tasks
    .filter(t => t.status !== "done")
    .filter(t => t.status === "in-progress" || t.dueDate)
    .sort((a, b) => {
      if (a.status === "in-progress" && b.status !== "in-progress") return -1;
      if (a.status !== "in-progress" && b.status === "in-progress") return 1;
      if (a.dueDate && !b.dueDate) return -1;
      if (!a.dueDate && b.dueDate) return 1;
      if (a.dueDate && b.dueDate) return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      return 0;
    })
    .slice(0, 5);

  if (isLoading) {
    return (
      <div className="editorial-card p-8 animate-slide-up">
        <h3 className="section-title mb-6 flex items-center gap-3">
          <ListTodo className="h-7 w-7 text-accent" />
          Weekly Priorities
        </h3>
        <div className="text-center py-12 text-stone">Loading...</div>
      </div>
    );
  }

  return (
    <div className="editorial-card p-8 animate-slide-up">
      <h3 className="section-title mb-6">This Week</h3>
      <div>
        {priorityTasks.length === 0 ? (
          <div className="text-center py-12">
            <CheckCircle2 className="h-12 w-12 mx-auto mb-3 text-accent opacity-30" />
            <p className="text-stone">No priority tasks this week</p>
          </div>
        ) : (
          <div className="space-y-6">
            {priorityTasks.map((task, index) => (
              <div
                key={task.id}
                className="flex gap-6 pb-6 last:pb-0 priority-item"
                data-testid={`priority-task-${task.id}`}
              >
                <span className="priority-number text-2xl">{String(index + 1).padStart(2, '0')}</span>
                <div className="flex-1 min-w-0">
                  <h4 className="text-base text-charcoal mb-2 leading-snug">
                    {task.title}
                  </h4>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-graphite capitalize">{task.status.replace('-', ' ')}</span>
                    {task.dueDate && (
                      <>
                        <span className="text-stone">•</span>
                        <span className="text-stone text-xs">
                          {new Date(task.dueDate).toLocaleDateString('en-US', { 
                            weekday: 'short',
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
