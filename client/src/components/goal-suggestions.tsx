import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Plus, X, Loader2 } from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface GoalSuggestion {
  title: string;
  description: string;
  category: "personal" | "professional" | "health" | "learning";
  reasoning: string;
}

export function GoalSuggestions() {
  const { toast } = useToast();
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Fetch AI-generated goal suggestions
  const { data, isLoading, refetch, error } = useQuery<{ suggestions: GoalSuggestion[] }>({
    queryKey: ["/api/ai/goal-suggestions"],
    enabled: showSuggestions,
    retry: false,
  });

  // Show error toast when query fails
  if (error && showSuggestions) {
    toast({
      title: "Unable to generate suggestions",
      description: "Please complete your onboarding first to get personalized goal suggestions.",
      variant: "destructive",
    });
    setShowSuggestions(false);
  }

  // Mutation to create a goal from a suggestion
  const createGoalMutation = useMutation({
    mutationFn: async (suggestion: GoalSuggestion) => {
      const res = await apiRequest("POST", "/api/goals", {
        title: suggestion.title,
        description: suggestion.description,
        category: suggestion.category,
        progress: 0,
      });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/goals"] });
      toast({
        title: "Goal created",
        description: "Your goal has been added successfully.",
      });
      refetch(); // Refresh suggestions after creating a goal
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create goal",
        variant: "destructive",
      });
    },
  });

  const handleShowSuggestions = () => {
    setShowSuggestions(true);
  };

  const handleAddGoal = (suggestion: GoalSuggestion) => {
    createGoalMutation.mutate(suggestion);
  };

  if (!showSuggestions) {
    return (
      <Button
        onClick={handleShowSuggestions}
        variant="outline"
        className="w-full gap-2"
        data-testid="button-show-suggestions"
      >
        <Sparkles className="w-4 h-4" />
        Get AI-Powered Goal Suggestions
      </Button>
    );
  }

  return (
    <Card data-testid="card-goal-suggestions">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-sage" />
            <CardTitle>Personalized Goal Suggestions</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowSuggestions(false)}
            data-testid="button-close-suggestions"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        <CardDescription>
          Based on your vision, energy patterns, and direction
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-sage" />
          </div>
        ) : (
          data?.suggestions.map((suggestion, index) => (
            <Card key={index} className="border-sage/20" data-testid={`card-suggestion-${index}`}>
              <CardHeader className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-lg">{suggestion.title}</CardTitle>
                  <Badge variant="secondary" data-testid={`badge-category-${index}`}>
                    {suggestion.category}
                  </Badge>
                </div>
                <CardDescription className="text-sm">
                  {suggestion.description}
                </CardDescription>
                <p className="text-xs text-muted-foreground italic">
                  💡 {suggestion.reasoning}
                </p>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => handleAddGoal(suggestion)}
                  disabled={createGoalMutation.isPending}
                  className="w-full gap-2"
                  data-testid={`button-add-suggestion-${index}`}
                >
                  {createGoalMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                  Add This Goal
                </Button>
              </CardContent>
            </Card>
          ))
        )}

        <Button
          onClick={() => refetch()}
          variant="outline"
          className="w-full gap-2"
          disabled={isLoading}
          data-testid="button-refresh-suggestions"
        >
          <Sparkles className="w-4 h-4" />
          Generate New Suggestions
        </Button>
      </CardContent>
    </Card>
  );
}
