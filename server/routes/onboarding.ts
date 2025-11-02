import type { Express } from "express";
import { z } from "zod";
import { storage } from "../storage";

// Onboarding schema for validation (3 questions per spec)
const onboardingSchema = z.object({
  vision: z.string().min(1),
  energy: z.string().min(1),
  direction: z.string().min(1),
});

// Middleware to ensure user is authenticated
function requireAuth(req: any, res: any, next: any) {
  if (!req.isAuthenticated()) {
    return res.sendStatus(401);
  }
  next();
}

export function registerOnboardingRoutes(app: Express) {
  app.post("/api/onboarding", requireAuth, async (req, res) => {
    try {
      const data = onboardingSchema.parse(req.body);
      await storage.updateUser(req.user!.id, data);
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });
}
