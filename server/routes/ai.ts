import type { Express } from "express";
import { z } from "zod";
import {
  generateGoalsFromNorthStar,
  generateTasksFromGoal,
  analyzeReflection
} from "../lib/ai-mobile/index";
import { storage } from "../storage";

// Middleware to ensure user is authenticated
function requireAuth(req: any, res: any, next: any) {
  if (!req.isAuthenticated()) {
    return res.sendStatus(401);
  }
  next();
}

// Request schemas for mobile endpoints
const generateGoalsSchema = z.object({
  northStar: z.string().min(1),
  programWeek: z.number().int().min(1).max(5),
});

const generateTasksSchema = z.object({
  goalId: z.string(),
  programWeek: z.number().int().min(1).max(5).optional(),
});

const analyzeReflectionSchema = z.object({
  wins: z.string().optional(),
  lessons: z.string().optional(),
  nextSteps: z.string().optional(),
});

export function registerAIRoutes(app: Express) {

  /**
   * POST /api/ai/generate-goals (Mobile MVP)
   * Generate goals from north star using Opus Framework
   */
  app.post("/api/ai/generate-goals", requireAuth, async (req, res) => {
    try {
      const { northStar, programWeek } = generateGoalsSchema.parse(req.body);

      // Get existing goals to avoid duplicates
      const existingGoals = await storage.getGoals(req.user!.id);

      // Generate goal suggestions
      const suggestions = await generateGoalsFromNorthStar(
        northStar,
        programWeek,
        existingGoals.map(g => ({ title: g.title, description: g.description || '' }))
      );

      // Auto-create the goals
      const createdGoals = await Promise.all(
        suggestions.map(async (suggestion) => {
          return await storage.createGoal(req.user!.id, {
            title: suggestion.title,
            description: suggestion.description,
            category: suggestion.category,
            progress: 0,
            aiGenerated: 1, // Mark as AI-generated
            weekNumber: suggestion.weekNumber,
          });
        })
      );

      res.json({
        success: true,
        goals: createdGoals,
        count: createdGoals.length,
        message: `Generated ${createdGoals.length} goals for Week ${programWeek}`
      });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors[0].message });
      }
      console.error("Error generating goals:", error);
      res.status(500).json({ error: error.message || "Failed to generate goals" });
    }
  });

  /**
   * POST /api/ai/generate-tasks (Mobile MVP)
   * Generate tasks from a goal
   */
  app.post("/api/ai/generate-tasks", requireAuth, async (req, res) => {
    try {
      const { goalId, programWeek } = generateTasksSchema.parse(req.body);

      // Get the goal
      const goal = await storage.getGoal(goalId, req.user!.id);
      if (!goal) {
        return res.status(404).json({ error: "Goal not found" });
      }

      // Get user for north star context
      const user = await storage.getUser(req.user!.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const week = programWeek || user.programWeek || 1;

      // Generate task suggestions
      const suggestions = await generateTasksFromGoal(
        { title: goal.title, description: goal.description || '' },
        user.northStar || '',
        week
      );

      // Auto-create the tasks
      const createdTasks = await Promise.all(
        suggestions.map(async (suggestion) => {
          return await storage.createTask(req.user!.id, {
            title: suggestion.title,
            description: suggestion.description,
            status: 'todo',
            goalId: goal.id,
            aiGenerated: 1,
            recommendedSchedule: suggestion.recommendedSchedule,
            priority: 1,
          });
        })
      );

      res.json({
        success: true,
        tasks: createdTasks,
        count: createdTasks.length,
        message: `Generated ${createdTasks.length} tasks for "${goal.title}"`
      });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors[0].message });
      }
      console.error("Error generating tasks:", error);
      res.status(500).json({ error: error.message || "Failed to generate tasks" });
    }
  });

  /**
   * POST /api/ai/refine-goals (Mobile MVP)
   * Refine goals based on reflection analysis
   */
  app.post("/api/ai/refine-goals", requireAuth, async (req, res) => {
    try {
      const { wins, lessons, nextSteps } = analyzeReflectionSchema.parse(req.body);

      // Get user's current goals and completed tasks
      const goals = await storage.getGoals(req.user!.id);
      const tasks = await storage.getTasks(req.user!.id);
      const completedTasks = tasks.filter(t => t.status === 'done');

      // Get user for week context
      const user = await storage.getUser(req.user!.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Analyze reflection
      const analysis = await analyzeReflection(
        { wins, lessons, nextSteps },
        goals.map(g => ({ title: g.title, progress: g.progress })),
        completedTasks.map(t => ({ title: t.title })),
        user.programWeek || 1
      );

      res.json({
        success: true,
        analysis,
        message: "Reflection analyzed successfully"
      });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors[0].message });
      }
      console.error("Error refining goals:", error);
      res.status(500).json({ error: error.message || "Failed to analyze reflection" });
    }
  });
}
