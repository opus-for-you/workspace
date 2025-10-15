// Reference: javascript_auth_all_persistance blueprint
import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { 
  insertConnectionSchema, 
  insertGoalSchema, 
  insertTaskSchema, 
  insertWeeklyReviewSchema 
} from "@shared/schema";

// Middleware to ensure user is authenticated
function requireAuth(req: any, res: any, next: any) {
  if (!req.isAuthenticated()) {
    return res.sendStatus(401);
  }
  next();
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Sets up /api/register, /api/login, /api/logout, /api/user
  setupAuth(app);

  // Connection routes
  app.get("/api/connections", requireAuth, async (req, res) => {
    const connections = await storage.getConnections(req.user!.id);
    res.json(connections);
  });

  app.post("/api/connections", requireAuth, async (req, res) => {
    try {
      const data = insertConnectionSchema.parse(req.body);
      const connection = await storage.createConnection(req.user!.id, data);
      res.status(201).json(connection);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/connections/:id", requireAuth, async (req, res) => {
    try {
      const data = insertConnectionSchema.partial().parse(req.body);
      const connection = await storage.updateConnection(req.params.id, req.user!.id, data);
      if (!connection) {
        return res.status(404).json({ error: "Connection not found" });
      }
      res.json(connection);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/connections/:id", requireAuth, async (req, res) => {
    const deleted = await storage.deleteConnection(req.params.id, req.user!.id);
    if (!deleted) {
      return res.status(404).json({ error: "Connection not found" });
    }
    res.sendStatus(204);
  });

  // Goal routes
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

  // Task routes
  app.get("/api/tasks", requireAuth, async (req, res) => {
    const tasks = await storage.getTasks(req.user!.id);
    res.json(tasks);
  });

  app.post("/api/tasks", requireAuth, async (req, res) => {
    try {
      const data = insertTaskSchema.parse(req.body);
      const task = await storage.createTask(req.user!.id, data);
      res.status(201).json(task);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/tasks/:id", requireAuth, async (req, res) => {
    try {
      const data = insertTaskSchema.partial().parse(req.body);
      const task = await storage.updateTask(req.params.id, req.user!.id, data);
      if (!task) {
        return res.status(404).json({ error: "Task not found" });
      }
      res.json(task);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/tasks/:id", requireAuth, async (req, res) => {
    const deleted = await storage.deleteTask(req.params.id, req.user!.id);
    if (!deleted) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.sendStatus(204);
  });

  // Weekly Review routes
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

  const httpServer = createServer(app);

  return httpServer;
}
