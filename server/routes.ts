// Reference: javascript_auth_all_persistance blueprint
import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import onboardingRoutes from "./routes/onboarding";
import keyPeopleRoutes from "./routes/key-people";
import { registerGoalRoutes } from "./routes/goals";
import { registerTaskRoutes } from "./routes/tasks";
import { registerConnectionRoutes } from "./routes/connections";
import { registerReflectionRoutes } from "./routes/reflections";
import { registerAIRoutes } from "./routes/ai";

export async function registerRoutes(app: Express): Promise<Server> {
  // Sets up /api/register, /api/login, /api/logout, /api/user
  setupAuth(app);

  // Register modular routes (Router-based)
  app.use("/api/onboarding", onboardingRoutes);
  app.use("/api/key-people", keyPeopleRoutes);

  // Register modular routes (function-based)
  registerGoalRoutes(app);
  registerTaskRoutes(app);
  registerConnectionRoutes(app);
  registerReflectionRoutes(app);
  registerAIRoutes(app);

  const httpServer = createServer(app);

  return httpServer;
}
