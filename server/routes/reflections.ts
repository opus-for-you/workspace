import type { Express } from "express";
import { storage } from "../storage";
import { insertWeeklyReviewSchema } from "@shared/schema";

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
}
