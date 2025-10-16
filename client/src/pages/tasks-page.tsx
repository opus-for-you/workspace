import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckSquare, Plus, Calendar, Pencil, Trash2, Kanban, List as ListIcon } from "lucide-react";
import { format, parseISO } from "date-fns";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Task, InsertTask, Goal } from "@shared/schema";

export default function TasksPage() {
  const [viewMode, setViewMode] = useState<"list" | "kanban">("list");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [formData, setFormData] = useState<InsertTask>({
    title: "",
    description: "",
    dueDate: null,
    goalId: null,
    status: "todo",
  });

  const { toast } = useToast();

  const { data: tasks = [], isLoading: tasksLoading } = useQuery<Task[]>({
    queryKey: ["/api/tasks"],
  });

  const { data: goals = [] } = useQuery<Goal[]>({
    queryKey: ["/api/goals"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertTask) => {
      const res = await apiRequest("POST", "/api/tasks", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      setIsCreateOpen(false);
      resetForm();
      toast({ title: "Task created successfully" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<InsertTask> }) => {
      const res = await apiRequest("PATCH", `/api/tasks/${id}`, data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      setEditingTask(null);
      resetForm();
      toast({ title: "Task updated successfully" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/tasks/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      toast({ title: "Task deleted successfully" });
    },
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      dueDate: null,
      goalId: null,
      status: "todo",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTask) {
      updateMutation.mutate({ id: editingTask.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const openEdit = (task: Task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description || "",
      dueDate: task.dueDate,
      goalId: task.goalId,
      status: task.status,
    });
  };

  const toggleTaskStatus = (task: Task) => {
    const newStatus = task.status === "done" ? "todo" : "done";
    updateMutation.mutate({ id: task.id, data: { status: newStatus } });
  };

  const todoTasks = tasks.filter(t => t.status === "todo");
  const inProgressTasks = tasks.filter(t => t.status === "in-progress");
  const doneTasks = tasks.filter(t => t.status === "done");

  const getGoalTitle = (goalId: string | null) => {
    if (!goalId) return null;
    const goal = goals.find(g => g.id === goalId);
    return goal?.title;
  };

  const TaskCard = ({ task }: { task: Task }) => (
    <div
      className="p-3 border rounded-lg hover-elevate space-y-2"
      data-testid={`task-card-${task.id}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <Checkbox
            checked={task.status === "done"}
            onCheckedChange={() => toggleTaskStatus(task)}
            data-testid={`checkbox-task-${task.id}`}
            className="mt-1"
          />
          <div className="flex-1 min-w-0">
            <p className={`font-medium truncate ${task.status === "done" ? "line-through text-muted-foreground" : ""}`}>
              {task.title}
            </p>
            {task.description && (
              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{task.description}</p>
            )}
          </div>
        </div>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => openEdit(task)}
            data-testid={`button-edit-task-${task.id}`}
          >
            <Pencil className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => deleteMutation.mutate(task.id)}
            data-testid={`button-delete-task-${task.id}`}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        {task.dueDate && (
          <Badge variant="outline" className="text-xs">
            <Calendar className="h-3 w-3 mr-1" />
            {format(parseISO(task.dueDate), "MMM d")}
          </Badge>
        )}
        {task.goalId && getGoalTitle(task.goalId) && (
          <Badge variant="secondary" className="text-xs truncate max-w-[150px]">
            {getGoalTitle(task.goalId)}
          </Badge>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-serif font-light tracking-tight mb-2" data-testid="text-tasks-title">
            Tasks
          </h1>
          <p className="text-muted-foreground">Manage your to-do list and stay productive</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              data-testid="button-view-list"
            >
              <ListIcon className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "kanban" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("kanban")}
              data-testid="button-view-kanban"
            >
              <Kanban className="h-4 w-4" />
            </Button>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button data-testid="button-add-task">
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Task</DialogTitle>
                <DialogDescription>Add a task to your to-do list</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    data-testid="input-task-title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Review project proposal"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    data-testid="input-task-description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Add details..."
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    data-testid="input-task-due-date"
                    type="date"
                    value={formData.dueDate || ""}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value || null })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="goalId">Associated Goal (Optional)</Label>
                  <Select
                    value={formData.goalId || "none"}
                    onValueChange={(value) => setFormData({ ...formData, goalId: value === "none" ? null : value })}
                  >
                    <SelectTrigger id="goalId" data-testid="select-task-goal">
                      <SelectValue placeholder="Select a goal" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No goal</SelectItem>
                      {goals.map((goal) => (
                        <SelectItem key={goal.id} value={goal.id}>
                          {goal.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger id="status" data-testid="select-task-status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todo">To Do</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="done">Done</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <DialogFooter>
                  <Button
                    type="submit"
                    disabled={createMutation.isPending}
                    data-testid="button-submit-task"
                  >
                    Create Task
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingTask} onOpenChange={(open) => !open && setEditingTask(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogDescription>Update task details</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Title *</Label>
              <Input
                id="edit-title"
                data-testid="input-edit-task-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                data-testid="input-edit-task-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-dueDate">Due Date</Label>
              <Input
                id="edit-dueDate"
                data-testid="input-edit-task-due-date"
                type="date"
                value={formData.dueDate || ""}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value || null })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-goalId">Associated Goal</Label>
              <Select
                value={formData.goalId || "none"}
                onValueChange={(value) => setFormData({ ...formData, goalId: value === "none" ? null : value })}
              >
                <SelectTrigger id="edit-goalId" data-testid="select-edit-task-goal">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No goal</SelectItem>
                  {goals.map((goal) => (
                    <SelectItem key={goal.id} value={goal.id}>
                      {goal.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger id="edit-status" data-testid="select-edit-task-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                disabled={updateMutation.isPending}
                data-testid="button-update-task"
              >
                Update Task
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Tasks Display */}
      {tasksLoading ? (
        <div className="text-center py-12 text-muted-foreground">Loading tasks...</div>
      ) : tasks.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CheckSquare className="h-16 w-16 text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No tasks yet</h3>
            <p className="text-muted-foreground mb-4">Create your first task to get started</p>
            <Button onClick={() => setIsCreateOpen(true)} data-testid="button-create-first-task">
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Task
            </Button>
          </CardContent>
        </Card>
      ) : viewMode === "list" ? (
        <div className="space-y-4">
          {todoTasks.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-3">To Do</h2>
              <div className="space-y-2">
                {todoTasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            </div>
          )}
          {inProgressTasks.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-3">In Progress</h2>
              <div className="space-y-2">
                {inProgressTasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            </div>
          )}
          {doneTasks.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-3">Done</h2>
              <div className="space-y-2">
                {doneTasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <h2 className="text-lg font-semibold mb-3 px-3">To Do</h2>
            <div className="space-y-2">
              {todoTasks.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-sm">No tasks</div>
              ) : (
                todoTasks.map((task) => <TaskCard key={task.id} task={task} />)
              )}
            </div>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-3 px-3">In Progress</h2>
            <div className="space-y-2">
              {inProgressTasks.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-sm">No tasks</div>
              ) : (
                inProgressTasks.map((task) => <TaskCard key={task.id} task={task} />)
              )}
            </div>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-3 px-3">Done</h2>
            <div className="space-y-2">
              {doneTasks.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-sm">No tasks</div>
              ) : (
                doneTasks.map((task) => <TaskCard key={task.id} task={task} />)
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
