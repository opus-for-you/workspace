import { sql, relations } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),

  // Purpose Pillar (3 micro-prompts)
  purposePrompt1: text("purpose_prompt_1"), // "Describe a moment when work felt perfectly aligned"
  purposePrompt2: text("purpose_prompt_2"), // "Imagine your career 10 years from now"
  purposePrompt3: text("purpose_prompt_3"), // "What's a career version you haven't imagined yet"
  purposeSummary: text("purpose_summary"), // AI-generated 1-paragraph synthesis

  // Method Pillar (workstyle profile)
  workstyleBest: text("workstyle_best"), // "How do you work best?" (multiple choice)
  workstyleStuck: text("workstyle_stuck"), // "What usually gets you stuck?" (free text)

  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Connections table - track relationships and last contact
export const connections = pgTable("connections", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  relationship: text("relationship").notNull(),
  lastTouch: date("last_touch"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Goals table - track personal and professional goals
export const goals = pgTable("goals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  category: text("category"),
  targetDate: date("target_date"),
  progress: integer("progress").default(0).notNull(),
  aiGenerated: integer("ai_generated").default(0).notNull(), // 1 if AI-generated, 0 if user-created (using integer for boolean compatibility)
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Tasks table - task management with goal association
export const tasks = pgTable("tasks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  context: text("context"),
  timing: text("timing"),
  energy: text("energy"),
  priority: integer("priority"),
  dueDate: date("due_date"),
  goalId: varchar("goal_id").references(() => goals.id, { onDelete: "set null" }),
  status: text("status").notNull().default("todo"),
  aiGenerated: integer("ai_generated").default(0).notNull(), // Mobile MVP: 1 if AI-generated, 0 if user-created
  recommendedSchedule: text("recommended_schedule"), // Mobile MVP: AI-suggested time/day (e.g., "morning", "Tuesday afternoon")
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Weekly Reviews table - reflection and planning
export const weeklyReviews = pgTable("weekly_reviews", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  weekStart: date("week_start").notNull(),
  summary: text("summary"),
  wins: text("wins"),
  lessons: text("lessons"),
  nextSteps: text("next_steps"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Key People table - Network Pillar (track 3 key relationships)
export const keyPeople = pgTable("key_people", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  type: text("type").notNull(), // "mentor", "peer", "collaborator"
  why: text("why"), // Why this person matters
  lastInteraction: date("last_interaction"), // Last time user connected
  notes: text("notes"), // Optional notes about relationship
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  connections: many(connections),
  goals: many(goals),
  tasks: many(tasks),
  weeklyReviews: many(weeklyReviews),
  keyPeople: many(keyPeople),
}));

export const connectionsRelations = relations(connections, ({ one }) => ({
  user: one(users, {
    fields: [connections.userId],
    references: [users.id],
  }),
}));

export const goalsRelations = relations(goals, ({ one, many }) => ({
  user: one(users, {
    fields: [goals.userId],
    references: [users.id],
  }),
  tasks: many(tasks),
}));

export const tasksRelations = relations(tasks, ({ one }) => ({
  user: one(users, {
    fields: [tasks.userId],
    references: [users.id],
  }),
  goal: one(goals, {
    fields: [tasks.goalId],
    references: [goals.id],
  }),
}));

export const weeklyReviewsRelations = relations(weeklyReviews, ({ one }) => ({
  user: one(users, {
    fields: [weeklyReviews.userId],
    references: [users.id],
  }),
}));

export const keyPeopleRelations = relations(keyPeople, ({ one }) => ({
  user: one(users, {
    fields: [keyPeople.userId],
    references: [users.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertConnectionSchema = createInsertSchema(connections).omit({
  id: true,
  userId: true,
  createdAt: true,
});

export const insertGoalSchema = createInsertSchema(goals).omit({
  id: true,
  userId: true,
  createdAt: true,
});

export const insertTaskSchema = createInsertSchema(tasks).omit({
  id: true,
  userId: true,
  createdAt: true,
});

export const insertWeeklyReviewSchema = createInsertSchema(weeklyReviews).omit({
  id: true,
  userId: true,
  createdAt: true,
});

export const insertKeyPersonSchema = createInsertSchema(keyPeople).omit({
  id: true,
  userId: true,
  createdAt: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type SafeUser = Omit<User, 'password'>;

export type InsertConnection = z.infer<typeof insertConnectionSchema>;
export type Connection = typeof connections.$inferSelect;

export type InsertGoal = z.infer<typeof insertGoalSchema>;
export type Goal = typeof goals.$inferSelect;

export type InsertTask = z.infer<typeof insertTaskSchema>;
export type Task = typeof tasks.$inferSelect;

export type InsertWeeklyReview = z.infer<typeof insertWeeklyReviewSchema>;
export type WeeklyReview = typeof weeklyReviews.$inferSelect;

export type InsertKeyPerson = z.infer<typeof insertKeyPersonSchema>;
export type KeyPerson = typeof keyPeople.$inferSelect;
