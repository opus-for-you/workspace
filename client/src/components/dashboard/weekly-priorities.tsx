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
      <Card className="animate-slide-up">
        <CardHeader>
          <CardTitle className="font-serif text-xl tracking-tight flex items-center gap-2">
            <ListTodo className="h-5 w-5 text-sage" />
            Weekly Priorities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="animate-slide-up">
      <CardHeader className="section-header-editorial">
        <CardTitle className="section-title-editorial flex items-center gap-2">
          This Week
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        {priorityTasks.length === 0 ? (
          <div className="text-center py-12">
            <CheckCircle2 className="h-12 w-12 mx-auto mb-3 text-sage/50" />
            <p className="text-muted-foreground">No priority tasks this week</p>
          </div>
        ) : (
          <div className="space-y-0">
            {priorityTasks.map((task, index) => (
              <div
                key={task.id}
                className="flex gap-6 pb-6 mb-6 border-b border-pearl last:border-0 last:mb-0 last:pb-0 priority-item-hover"
                data-testid={`priority-task-${task.id}`}
              >
                <span className="priority-rank">{String(index + 1).padStart(2, '0')}</span>
                <div className="flex-1 min-w-0">
                  <h4 className="text-lg font-normal text-charcoal mb-2 leading-snug">
                    {task.title}
                  </h4>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-graphite capitalize">{task.status.replace('-', ' ')}</span>
                    {task.dueDate && (
                      <>
                        <span className="text-fog">•</span>
                        <span className="text-stone font-mono text-xs">
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
      </CardContent>
    </Card>
  );
}
