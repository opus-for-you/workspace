import type { Express } from "express";
import { z } from "zod";
import { storage } from "../storage";
import { insertWeeklyReviewSchema } from "@shared/schema";
import { analyzeReflection } from "../lib/ai-mobile/index";

// Middleware to ensure user is authenticated
function requireAuth(req: any, res: any, next: any) {
  if (!req.isAuthenticated()) {
    return res.sendStatus(401);
  }
  next();
}

export function registerReflectionRoutes(app: Express) {
  app.get("/api/reviews", requireAuth, async (req, res) => {
    const reviews = await storage.getWeeklyReviews(req.user!.id);
    res.json(reviews);
  });

  app.post("/api/reviews", requireAuth, async (req, res) => {
    try {
      const data = insertWeeklyReviewSchema.parse(req.body);
      const review = await storage.createWeeklyReview(req.user!.id, data);
      res.status(201).json(review);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/reviews/:id", requireAuth, async (req, res) => {
    const deleted = await storage.deleteWeeklyReview(req.params.id, req.user!.id);
    if (!deleted) {
      return res.status(404).json({ error: "Review not found" });
    }
    res.sendStatus(204);
  });

  /**
   * POST /api/reflections/submit (Mobile MVP)
   * Submit reflection with AI analysis
   */
  app.post("/api/reflections/submit", requireAuth, async (req, res) => {
    try {
      const data = insertWeeklyReviewSchema.parse(req.body);

      // Create the reflection
      const review = await storage.createWeeklyReview(req.user!.id, data);

      // Get user's current goals and completed tasks for analysis
      const goals = await storage.getGoals(req.user!.id);
      const tasks = await storage.getTasks(req.user!.id);
      const completedTasks = tasks.filter(t => t.status === 'done');

      // Get user for week context
      const user = await storage.getUser(req.user!.id);
      const programWeek = user?.programWeek || 1;

      // Analyze reflection in background (don't await to keep response fast)
      analyzeReflection(
        {
          wins: data.wins || undefined,
          lessons: data.lessons || undefined,
          nextSteps: data.nextSteps || undefined
        },
        goals.map(g => ({ title: g.title, progress: g.progress })),
        completedTasks.map(t => ({ title: t.title })),
        programWeek
      ).then(analysis => {
        // Could store this analysis or use it to refine goals
        // For now, just log it
        console.log("Reflection analysis complete:", analysis);
      }).catch(err => {
        console.error("Error analyzing reflection:", err);
      });

      res.status(201).json({
        review,
        message: "Reflection submitted successfully. AI is analyzing your progress..."
      });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors[0].message });
      }
      res.status(400).json({ error: error.message || "Failed to submit reflection" });
    }
  });
}
