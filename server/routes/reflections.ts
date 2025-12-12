import type { Express } from "express";
import { z } from "zod";
import { storage } from "../storage";
import { insertWeeklyReviewSchema } from "@shared/schema";
import { analyzeCheckIn } from "../lib/ai-mvp";

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
   * POST /api/reflections/submit (MVP)
   * Submit reflection with AI analysis (includes network nudges)
   */
  app.post("/api/reflections/submit", requireAuth, async (req, res) => {
    try {
      const data = insertWeeklyReviewSchema.parse(req.body);

      // Create the reflection
      const review = await storage.createWeeklyReview(req.user!.id, data);

      // Background: Analyze check-in (don't await to keep response fast)
      (async () => {
        try {
          const goals = await storage.getGoals(req.user!.id);
          const milestones = await storage.getTasks(req.user!.id);
          const keyPeople = await storage.getKeyPeople(req.user!.id);

          const analysis = await analyzeCheckIn(
            {
              wins: data.wins || undefined,
              lessons: data.lessons || undefined,
              nextSteps: data.nextSteps || undefined
            },
            goals.map((g) => ({ title: g.title, progress: g.progress })),
            milestones.filter((m) => m.status === "done").map((m) => ({ title: m.title, status: m.status })),
            keyPeople.map((kp) => ({
              name: kp.name,
              type: kp.type,
              lastInteraction: kp.lastInteraction ? new Date(kp.lastInteraction) : undefined
            }))
          );

          console.log("Check-in analysis complete:", analysis);
          // TODO: Store analysis in database for future use
        } catch (error) {
          console.error("Background check-in analysis failed:", error);
        }
      })();

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
