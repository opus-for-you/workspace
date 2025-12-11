import type { Express } from "express";
import { z } from "zod";
import { storage } from "../storage";

// Onboarding schema for validation (3 questions per spec)
const onboardingSchema = z.object({
  vision: z.string().min(1),
  energy: z.string().min(1),
  direction: z.string().min(1),
});

// Mobile MVP: North Star onboarding
const northStarSchema = z.object({
  northStar: z.string().min(10, "Please provide a meaningful vision for your future"),
});

// Middleware to ensure user is authenticated
function requireAuth(req: any, res: any, next: any) {
  if (!req.isAuthenticated()) {
    return res.sendStatus(401);
  }
  next();
}

export function registerOnboardingRoutes(app: Express) {
  // Original web app onboarding (3 questions)
  app.post("/api/onboarding", requireAuth, async (req, res) => {
    try {
      const data = onboardingSchema.parse(req.body);
      await storage.updateUser(req.user!.id, data);
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Mobile MVP: Save North Star
  app.post("/api/onboarding/north-star", requireAuth, async (req, res) => {
    try {
      const { northStar } = northStarSchema.parse(req.body);
      const updatedUser = await storage.updateUser(req.user!.id, { northStar });

      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }

      // Return user without password
      const { password, ...safeUser } = updatedUser;
      res.json({
        success: true,
        user: safeUser,
        message: "North star saved successfully"
      });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors[0].message });
      }
      res.status(500).json({ error: error.message || "Failed to save north star" });
    }
  });
}
