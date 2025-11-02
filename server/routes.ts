// Reference: javascript_auth_all_persistance blueprint
import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { registerOnboardingRoutes } from "./routes/onboarding";
import { registerGoalRoutes } from "./routes/goals";
import { registerTaskRoutes } from "./routes/tasks";
import { registerConnectionRoutes } from "./routes/connections";
import { registerReflectionRoutes } from "./routes/reflections";
import { registerAIRoutes } from "./routes/ai";
import { registerProgramRoutes } from "./routes/program";

export async function registerRoutes(app: Express): Promise<Server> {
  // Sets up /api/register, /api/login, /api/logout, /api/user
  setupAuth(app);

  // Register modular routes
  registerOnboardingRoutes(app);
  registerGoalRoutes(app);
  registerTaskRoutes(app);
  registerConnectionRoutes(app);
  registerReflectionRoutes(app);
  registerAIRoutes(app);
  registerProgramRoutes(app); // Mobile MVP: 5-week program management

  const httpServer = createServer(app);

  return httpServer;
}
