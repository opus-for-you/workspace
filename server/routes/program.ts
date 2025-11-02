import type { Express } from "express";
import { storage } from "../storage";
import { calculateCurrentWeek, getWeekTheme, isReflectionTime } from "../lib/opus-framework";

// Middleware to ensure user is authenticated
function requireAuth(req: any, res: any, next: any) {
  if (!req.isAuthenticated()) {
    return res.sendStatus(401);
  }
  next();
}

export function registerProgramRoutes(app: Express) {
  /**
   * Start the 5-week program
   * Sets programWeek to 1 and programStartDate to now
   */
  app.post("/api/program/start", requireAuth, async (req, res) => {
    try {
      const updatedUser = await storage.updateUser(req.user!.id, {
        programWeek: 1,
        programStartDate: new Date(),
      });

      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }

      const weekTheme = getWeekTheme(1);
      const { password, ...safeUser } = updatedUser;

      res.json({
        success: true,
        user: safeUser,
        weekTheme,
        message: "Program started! Welcome to Week 1: Purpose"
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to start program" });
    }
  });

  /**
   * Get current week and program status
   * Returns week number, theme, progress, and whether reflection is due
   */
  app.get("/api/program/current-week", requireAuth, async (req, res) => {
    try {
      const user = await storage.getUser(req.user!.id);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Calculate current week if program has started
      let currentWeek = user.programWeek || 0;
      let weekTheme = null;
      let reflectionDue = false;

      if (user.programStartDate && currentWeek > 0) {
        // Recalculate week based on start date
        currentWeek = calculateCurrentWeek(user.programStartDate);

        // Update user's programWeek if it changed
        if (currentWeek !== user.programWeek) {
          await storage.updateUser(user.id, { programWeek: currentWeek });
        }

        weekTheme = getWeekTheme(currentWeek);
        reflectionDue = isReflectionTime(user.programStartDate);
      }

      res.json({
        programWeek: currentWeek,
        programStartDate: user.programStartDate,
        weekTheme,
        reflectionDue,
        programComplete: currentWeek >= 5,
        daysInProgram: user.programStartDate
          ? Math.floor((Date.now() - new Date(user.programStartDate).getTime()) / (1000 * 60 * 60 * 24))
          : 0
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to get program status" });
    }
  });

  /**
   * Manually advance to next week (for testing or user request)
   */
  app.post("/api/program/advance-week", requireAuth, async (req, res) => {
    try {
      const user = await storage.getUser(req.user!.id);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const currentWeek = user.programWeek || 0;

      if (currentWeek >= 5) {
        return res.status(400).json({ error: "Program already complete" });
      }

      const nextWeek = currentWeek + 1;
      const updatedUser = await storage.updateUser(user.id, { programWeek: nextWeek });

      const weekTheme = getWeekTheme(nextWeek);
      const { password, ...safeUser } = updatedUser!;

      res.json({
        success: true,
        user: safeUser,
        weekTheme,
        message: `Advanced to Week ${nextWeek}: ${weekTheme?.title}`
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to advance week" });
    }
  });
}
