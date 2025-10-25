import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Target, Plus, Calendar, Pencil, Trash2, TrendingUp } from "lucide-react";
import { format, parseISO } from "date-fns";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Goal, InsertGoal } from "@shared/schema";

export default function GoalsPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [formData, setFormData] = useState<InsertGoal>({
    title: "",
    description: "",
    targetDate: null,
    progress: 0,
  });

  const { toast } = useToast();

  const { data: goals = [], isLoading } = useQuery<Goal[]>({
    queryKey: ["/api/goals"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertGoal) => {
      const res = await apiRequest("POST", "/api/goals", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/goals"] });
      setIsCreateOpen(false);
      resetForm();
      toast({ title: "Goal created successfully" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<InsertGoal> }) => {
      const res = await apiRequest("PATCH", `/api/goals/${id}`, data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/goals"] });
      setEditingGoal(null);
      resetForm();
      toast({ title: "Goal updated successfully" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/goals/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/goals"] });
      toast({ title: "Goal deleted successfully" });
    },
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      targetDate: null,
      progress: 0,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingGoal) {
      updateMutation.mutate({ id: editingGoal.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const openEdit = (goal: Goal) => {
    setEditingGoal(goal);
    setFormData({
      title: goal.title,
      description: goal.description || "",
      targetDate: goal.targetDate,
      progress: goal.progress,
    });
  };

  const activeGoals = goals.filter(g => g.progress < 100);
  const completedGoals = goals.filter(g => g.progress >= 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-serif font-light tracking-tight mb-2" data-testid="text-goals-title">
            Goals
          </h1>
          <p className="text-muted-foreground">Track your personal and professional objectives</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-goal">
              <Plus className="h-4 w-4 mr-2" />
              Add Goal
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Goal</DialogTitle>
              <DialogDescription>Set a new objective to work towards</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  data-testid="input-goal-title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Learn React"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  data-testid="input-goal-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe your goal..."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="targetDate">Target Date</Label>
                <Input
                  id="targetDate"
                  data-testid="input-goal-target-date"
                  type="date"
                  value={formData.targetDate || ""}
                  onChange={(e) => setFormData({ ...formData, targetDate: e.target.value || null })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="progress">Progress: {formData.progress}%</Label>
                <Slider
                  id="progress"
                  data-testid="slider-goal-progress"
                  value={[formData.progress]}
                  onValueChange={([value]) => setFormData({ ...formData, progress: value })}
                  max={100}
                  step={5}
                />
              </div>
              <DialogFooter>
                <Button
                  type="submit"
                  disabled={createMutation.isPending}
                  data-testid="button-submit-goal"
                >
                  Create Goal
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingGoal} onOpenChange={(open) => !open && setEditingGoal(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Goal</DialogTitle>
            <DialogDescription>Update goal details and progress</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Title *</Label>
              <Input
                id="edit-title"
                data-testid="input-edit-goal-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                data-testid="input-edit-goal-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-targetDate">Target Date</Label>
              <Input
                id="edit-targetDate"
                data-testid="input-edit-goal-target-date"
                type="date"
                value={formData.targetDate || ""}
                onChange={(e) => setFormData({ ...formData, targetDate: e.target.value || null })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-progress">Progress: {formData.progress}%</Label>
              <Slider
                id="edit-progress"
                data-testid="slider-edit-goal-progress"
                value={[formData.progress]}
                onValueChange={([value]) => setFormData({ ...formData, progress: value })}
                max={100}
                step={5}
              />
            </div>
            <DialogFooter>
              <Button
                type="submit"
                disabled={updateMutation.isPending}
                data-testid="button-update-goal"
              >
                Update Goal
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Active Goals */}
      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">Loading goals...</div>
      ) : goals.length === 0 ? (
        <div className="editorial-card p-16 flex flex-col items-center justify-center">
          <Target className="h-16 w-16 text-stone mb-6 opacity-30" />
          <h3 className="text-2xl font-display font-light mb-3">No goals yet</h3>
          <p className="text-graphite mb-6">Set your first goal to get started</p>
          <Button onClick={() => setIsCreateOpen(true)} data-testid="button-create-first-goal">
            <Plus className="h-4 w-4 mr-2" />
            Create Your First Goal
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {activeGoals.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Active Goals
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {activeGoals.map((goal) => (
                  <Card key={goal.id} className="hover-elevate" data-testid={`goal-card-${goal.id}`}>
                    <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0 pb-3">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg truncate">{goal.title}</CardTitle>
                        {goal.description && (
                          <CardDescription className="line-clamp-2 mt-1">{goal.description}</CardDescription>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEdit(goal)}
                          data-testid={`button-edit-goal-${goal.id}`}
                        >
                          <Pencil className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteMutation.mutate(goal.id)}
                          data-testid={`button-delete-goal-${goal.id}`}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-semibold">{goal.progress}%</span>
                        </div>
                        <Progress value={goal.progress} className="h-2" />
                      </div>
                      {goal.targetDate && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>Target: {format(parseISO(goal.targetDate), "MMM d, yyyy")}</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {completedGoals.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Target className="h-5 w-5" />
                Completed Goals
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {completedGoals.map((goal) => (
                  <Card key={goal.id} className="hover-elevate opacity-75" data-testid={`goal-card-completed-${goal.id}`}>
                    <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0 pb-3">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg truncate line-through decoration-muted-foreground">
                          {goal.title}
                        </CardTitle>
                        {goal.description && (
                          <CardDescription className="line-clamp-2 mt-1">{goal.description}</CardDescription>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEdit(goal)}
                          data-testid={`button-edit-goal-completed-${goal.id}`}
                        >
                          <Pencil className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteMutation.mutate(goal.id)}
                          data-testid={`button-delete-goal-completed-${goal.id}`}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-2">
                        <Progress value={100} className="h-2" />
                      </div>
                      {goal.targetDate && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>Completed by {format(parseISO(goal.targetDate), "MMM d, yyyy")}</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
