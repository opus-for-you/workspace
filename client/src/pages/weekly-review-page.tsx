import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { PenLine, Plus, Calendar, Trash2 } from "lucide-react";
import { format, parseISO, startOfWeek } from "date-fns";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { WeeklyReview, InsertWeeklyReview } from "@shared/schema";

export default function WeeklyReviewPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formData, setFormData] = useState<InsertWeeklyReview>({
    weekStart: format(startOfWeek(new Date()), "yyyy-MM-dd"),
    summary: "",
    wins: "",
    lessons: "",
    nextSteps: "",
  });

  const { toast } = useToast();

  const { data: reviews = [], isLoading } = useQuery<WeeklyReview[]>({
    queryKey: ["/api/reviews"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertWeeklyReview) => {
      const res = await apiRequest("POST", "/api/reviews", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reviews"] });
      setIsCreateOpen(false);
      resetForm();
      toast({ title: "Weekly review created successfully" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/reviews/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reviews"] });
      toast({ title: "Review deleted successfully" });
    },
  });

  const resetForm = () => {
    setFormData({
      weekStart: format(startOfWeek(new Date()), "yyyy-MM-dd"),
      summary: "",
      wins: "",
      lessons: "",
      nextSteps: "",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  const sortedReviews = [...reviews].sort((a, b) => 
    new Date(b.weekStart).getTime() - new Date(a.weekStart).getTime()
  );

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2" data-testid="text-reviews-title">
            Weekly Reviews
          </h1>
          <p className="text-muted-foreground">Reflect on your progress and plan ahead</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-review">
              <Plus className="h-4 w-4 mr-2" />
              New Review
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Weekly Review</DialogTitle>
              <DialogDescription>Reflect on your week and plan for the next</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="weekStart">Week Starting *</Label>
                <Input
                  id="weekStart"
                  data-testid="input-review-week-start"
                  type="date"
                  value={formData.weekStart}
                  onChange={(e) => setFormData({ ...formData, weekStart: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="summary">Weekly Summary</Label>
                <Textarea
                  id="summary"
                  data-testid="input-review-summary"
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  placeholder="How was your week overall?"
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="wins">Wins & Achievements</Label>
                <Textarea
                  id="wins"
                  data-testid="input-review-wins"
                  value={formData.wins}
                  onChange={(e) => setFormData({ ...formData, wins: e.target.value })}
                  placeholder="What went well this week?"
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lessons">Lessons Learned</Label>
                <Textarea
                  id="lessons"
                  data-testid="input-review-lessons"
                  value={formData.lessons}
                  onChange={(e) => setFormData({ ...formData, lessons: e.target.value })}
                  placeholder="What did you learn?"
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nextSteps">Next Week's Focus</Label>
                <Textarea
                  id="nextSteps"
                  data-testid="input-review-next-steps"
                  value={formData.nextSteps}
                  onChange={(e) => setFormData({ ...formData, nextSteps: e.target.value })}
                  placeholder="What will you focus on next week?"
                  rows={4}
                />
              </div>
              <DialogFooter>
                <Button
                  type="submit"
                  disabled={createMutation.isPending}
                  data-testid="button-submit-review"
                >
                  Create Review
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Reviews Timeline */}
      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">Loading reviews...</div>
      ) : reviews.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <PenLine className="h-16 w-16 text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No reviews yet</h3>
            <p className="text-muted-foreground mb-4">Start your weekly reflection practice</p>
            <Button onClick={() => setIsCreateOpen(true)} data-testid="button-create-first-review">
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Review
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {sortedReviews.map((review, index) => (
            <Card key={review.id} className="hover-elevate" data-testid={`review-card-${review.id}`}>
              <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0 pb-3">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Week of {format(parseISO(review.weekStart), "MMM d, yyyy")}
                  </CardTitle>
                  {index === 0 && (
                    <CardDescription className="mt-1">Most recent review</CardDescription>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteMutation.mutate(review.id)}
                  data-testid={`button-delete-review-${review.id}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {review.summary && (
                  <div>
                    <h3 className="font-semibold mb-2 text-sm text-muted-foreground uppercase tracking-wide">
                      Summary
                    </h3>
                    <p className="text-sm whitespace-pre-wrap">{review.summary}</p>
                  </div>
                )}
                {review.wins && (
                  <div>
                    <h3 className="font-semibold mb-2 text-sm text-muted-foreground uppercase tracking-wide">
                      Wins & Achievements
                    </h3>
                    <p className="text-sm whitespace-pre-wrap">{review.wins}</p>
                  </div>
                )}
                {review.lessons && (
                  <div>
                    <h3 className="font-semibold mb-2 text-sm text-muted-foreground uppercase tracking-wide">
                      Lessons Learned
                    </h3>
                    <p className="text-sm whitespace-pre-wrap">{review.lessons}</p>
                  </div>
                )}
                {review.nextSteps && (
                  <div>
                    <h3 className="font-semibold mb-2 text-sm text-muted-foreground uppercase tracking-wide">
                      Next Week's Focus
                    </h3>
                    <p className="text-sm whitespace-pre-wrap">{review.nextSteps}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* AI Placeholder Note */}
      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground text-center">
            <span className="font-semibold">Coming Soon:</span> AI-powered reflection prompts will help you get the most out of your weekly reviews.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
