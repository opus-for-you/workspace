import type { Express } from "express";
import { generateGoalSuggestions, generateReflectionPrompt } from "../lib/ai";
import { storage } from "../storage";

// Middleware to ensure user is authenticated
function requireAuth(req: any, res: any, next: any) {
  if (!req.isAuthenticated()) {
    return res.sendStatus(401);
  }
  next();
}

export function registerAIRoutes(app: Express) {
  /**
   * GET /api/ai/goal-suggestions
   * Generate personalized goal suggestions based on user's onboarding data
   */
  app.get("/api/ai/goal-suggestions", requireAuth, async (req, res) => {
    try {
      const user = req.user!;
      
      // Check if user has completed onboarding
      if (!user.vision || !user.energy || !user.direction) {
        return res.status(400).json({ 
          error: "Please complete onboarding first to get personalized suggestions" 
        });
      }

      // Get existing goals to avoid duplicates
      const existingGoals = await storage.getGoals(user.id);
      const goalsForAI = existingGoals.map(g => ({
        title: g.title,
        description: g.description || ""
      }));

      const suggestions = await generateGoalSuggestions(
        user.vision,
        user.energy,
        user.direction,
        goalsForAI
      );

      res.json({ suggestions });
    } catch (error: any) {
      console.error("Error generating goal suggestions:", error);
      res.status(500).json({ error: "Failed to generate suggestions" });
    }
  });

  /**
   * GET /api/ai/reflection-prompt
   * Generate a thoughtful reflection prompt for weekly reviews
   */
  app.get("/api/ai/reflection-prompt", requireAuth, async (req, res) => {
    try {
      const user = req.user!;
      
      // Get recent activity context
      const recentGoals = await storage.getGoals(user.id);
      const recentTasks = await storage.getTasks(user.id);
      
      const recentActivity = `
        Total goals: ${recentGoals.length}
        Completed tasks this week: ${recentTasks.filter(t => t.status === "done").length}
      `.trim();

      const prompt = await generateReflectionPrompt(recentActivity);

      res.json({ prompt });
    } catch (error: any) {
      console.error("Error generating reflection prompt:", error);
      res.status(500).json({ error: "Failed to generate prompt" });
    }
  });
}
