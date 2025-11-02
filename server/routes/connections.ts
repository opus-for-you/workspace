import type { Express } from "express";
import { storage } from "../storage";
import { insertConnectionSchema } from "@shared/schema";

// Middleware to ensure user is authenticated
function requireAuth(req: any, res: any, next: any) {
  if (!req.isAuthenticated()) {
    return res.sendStatus(401);
  }
  next();
}

export function registerConnectionRoutes(app: Express) {
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
}
