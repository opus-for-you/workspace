import type { Express } from "express";
import { storage } from "../storage";
import { insertGoalSchema } from "@shared/schema";

// Middleware to ensure user is authenticated
function requireAuth(req: any, res: any, next: any) {
  if (!req.isAuthenticated()) {
    return res.sendStatus(401);
  }
  next();
}

export function registerGoalRoutes(app: Express) {
  app.get("/api/goals", requireAuth, async (req, res) => {
    const goals = await storage.getGoals(req.user!.id);
    res.json(goals);
  });

  app.post("/api/goals", requireAuth, async (req, res) => {
    try {
      const data = insertGoalSchema.parse(req.body);
      const goal = await storage.createGoal(req.user!.id, data);
      res.status(201).json(goal);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/goals/:id", requireAuth, async (req, res) => {
    try {
      const data = insertGoalSchema.partial().parse(req.body);
      const goal = await storage.updateGoal(req.params.id, req.user!.id, data);
      if (!goal) {
        return res.status(404).json({ error: "Goal not found" });
      }
      res.json(goal);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/goals/:id", requireAuth, async (req, res) => {
    const deleted = await storage.deleteGoal(req.params.id, req.user!.id);
    if (!deleted) {
      return res.status(404).json({ error: "Goal not found" });
    }
    res.sendStatus(204);
  });
}
