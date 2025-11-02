import type { Express } from "express";
import { storage } from "../storage";
import { insertTaskSchema } from "@shared/schema";

// Middleware to ensure user is authenticated
function requireAuth(req: any, res: any, next: any) {
  if (!req.isAuthenticated()) {
    return res.sendStatus(401);
  }
  next();
}

export function registerTaskRoutes(app: Express) {
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
}
