import type { Express } from "express";
import { z } from "zod";
import { storage } from "../storage";
import {
  generateGoalsFromPurpose,
  generateMilestonesFromGoal,
  analyzeCheckIn,
} from "../lib/ai-mvp";

// Middleware to ensure user is authenticated
function requireAuth(req: any, res: any, next: any) {
  if (!req.isAuthenticated()) {
    return res.sendStatus(401);
  }
  next();
}

export function registerAIRoutes(app: Express) {
  // Generate goals from purpose (no week dependency)
  app.post("/api/ai/generate-goals", requireAuth, async (req, res) => {
    try {
      const schema = z.object({
        purposeSummary: z.string().optional(),
      });

      const { purposeSummary } = schema.parse(req.body);

      // Get user for purpose summary and workstyle
      const user = await storage.getUser(req.user!.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Use purpose summary from request or user profile
      const purpose = purposeSummary || user.purposeSummary || "";

      if (!purpose) {
        return res.status(400).json({
          message: "No purpose summary found. Please complete onboarding first.",
        });
      }

      // Get workstyle profile
      const workstyle = user.workstyleBest
        ? { best: user.workstyleBest, stuck: user.workstyleStuck || "" }
        : undefined;

      // Get existing goals to avoid duplicates
      const existingGoals = await storage.getGoals(user.id);

      // Generate goals
      const goals = await generateGoalsFromPurpose(
        purpose,
        workstyle,
        existingGoals
      );

      // Auto-create goals in database
      const created = [];
      for (const goalSuggestion of goals) {
        const goal = await storage.createGoal(user.id, {
          title: goalSuggestion.title,
          description: goalSuggestion.description,
          category: goalSuggestion.category,
          aiGenerated: 1,
          progress: 0,
        });
        created.push(goal);
      }

      res.json({
        success: true,
        goals: created,
        count: created.length,
        message: `Generated ${created.length} goals aligned with your purpose`,
      });
    } catch (error) {
      console.error("Error generating goals:", error);
      res.status(500).json({ message: "Failed to generate goals" });
    }
  });

  // Generate milestones from goal (renamed from generate-tasks)
  app.post("/api/ai/generate-milestones", requireAuth, async (req, res) => {
    try {
      const schema = z.object({
        goalId: z.string(),
      });

      const { goalId } = schema.parse(req.body);

      // Get goal
      const goal = await storage.getGoal(goalId, req.user!.id);
      if (!goal) {
        return res.status(404).json({ message: "Goal not found" });
      }

      // Get user for purpose and workstyle
      const user = await storage.getUser(req.user!.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const purpose = user.purposeSummary || "";
      const workstyle = user.workstyleBest
        ? { best: user.workstyleBest, stuck: user.workstyleStuck || "" }
        : undefined;

      // Generate milestones
      const milestones = await generateMilestonesFromGoal(
        { title: goal.title, description: goal.description || "" },
        purpose,
        workstyle
      );

      // Auto-create milestones (tasks) in database
      const created = [];
      for (const milestoneSuggestion of milestones) {
        const milestone = await storage.createTask(user.id, {
          title: milestoneSuggestion.title,
          description: milestoneSuggestion.description,
          recommendedSchedule: milestoneSuggestion.recommendedSchedule,
          goalId: goal.id,
          status: "todo",
          aiGenerated: 1,
        });
        created.push(milestone);
      }

      res.json({
        success: true,
        milestones: created,
        count: created.length,
        message: `Generated ${created.length} milestones for "${goal.title}"`,
      });
    } catch (error) {
      console.error("Error generating milestones:", error);
      res.status(500).json({ message: "Failed to generate milestones" });
    }
  });

  // Keep old endpoint for backward compatibility (307 redirect to preserve POST method)
  app.post("/api/ai/generate-tasks", requireAuth, (req, res) => {
    // Update the request body to use goalId if it exists
    const redirectUrl = "/api/ai/generate-milestones";
    res.redirect(307, redirectUrl);
  });

  // Analyze check-in (renamed from refine-goals)
  app.post("/api/ai/analyze-check-in", requireAuth, async (req, res) => {
    try {
      const schema = z.object({
        wins: z.string().optional(),
        lessons: z.string().optional(),
        nextSteps: z.string().optional(),
      });

      const checkIn = schema.parse(req.body);

      // Get user's goals and milestones for context
      const goals = await storage.getGoals(req.user!.id);
      const milestones = await storage.getTasks(req.user!.id);
      const keyPeople = await storage.getKeyPeople(req.user!.id);

      // Analyze with AI
      const analysis = await analyzeCheckIn(
        checkIn,
        goals.map((g) => ({ title: g.title, progress: g.progress })),
        milestones.map((m) => ({ title: m.title, status: m.status })),
        keyPeople.map((kp) => ({
          name: kp.name,
          type: kp.type,
          lastInteraction: kp.lastInteraction ? new Date(kp.lastInteraction) : undefined,
        }))
      );

      res.json({
        success: true,
        analysis,
        message: "Check-in analyzed successfully",
      });
    } catch (error) {
      console.error("Error analyzing check-in:", error);
      res.status(500).json({ message: "Failed to analyze check-in" });
    }
  });

  // Keep old refine-goals endpoint for backward compatibility
  app.post("/api/ai/refine-goals", requireAuth, (req, res) => {
    res.redirect(307, "/api/ai/analyze-check-in");
  });
}
