// Reference: javascript_auth_all_persistance and javascript_database blueprints
import { 
  users, 
  connections, 
  goals, 
  tasks, 
  weeklyReviews,
  type User, 
  type InsertUser,
  type Connection,
  type InsertConnection,
  type Goal,
  type InsertGoal,
  type Task,
  type InsertTask,
  type WeeklyReview,
  type InsertWeeklyReview
} from "@shared/schema";
import { db } from "./db";
import { pool } from "./db";
import { eq, and } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Connection operations
  getConnections(userId: string): Promise<Connection[]>;
  getConnection(id: string, userId: string): Promise<Connection | undefined>;
  createConnection(userId: string, connection: InsertConnection): Promise<Connection>;
  updateConnection(id: string, userId: string, connection: Partial<InsertConnection>): Promise<Connection | undefined>;
  deleteConnection(id: string, userId: string): Promise<boolean>;
  
  // Goal operations
  getGoals(userId: string): Promise<Goal[]>;
  getGoal(id: string, userId: string): Promise<Goal | undefined>;
  createGoal(userId: string, goal: InsertGoal): Promise<Goal>;
  updateGoal(id: string, userId: string, goal: Partial<InsertGoal>): Promise<Goal | undefined>;
  deleteGoal(id: string, userId: string): Promise<boolean>;
  
  // Task operations
  getTasks(userId: string): Promise<Task[]>;
  getTask(id: string, userId: string): Promise<Task | undefined>;
  createTask(userId: string, task: InsertTask): Promise<Task>;
  updateTask(id: string, userId: string, task: Partial<InsertTask>): Promise<Task | undefined>;
  deleteTask(id: string, userId: string): Promise<boolean>;
  
  // Weekly Review operations
  getWeeklyReviews(userId: string): Promise<WeeklyReview[]>;
  getWeeklyReview(id: string, userId: string): Promise<WeeklyReview | undefined>;
  createWeeklyReview(userId: string, review: InsertWeeklyReview): Promise<WeeklyReview>;
  deleteWeeklyReview(id: string, userId: string): Promise<boolean>;
  
  sessionStore: session.SessionStore;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.SessionStore;

  constructor() {
    this.sessionStore = new PostgresSessionStore({ pool, createTableIfMissing: true });
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Connection operations
  async getConnections(userId: string): Promise<Connection[]> {
    return await db.select().from(connections).where(eq(connections.userId, userId));
  }

  async getConnection(id: string, userId: string): Promise<Connection | undefined> {
    const [connection] = await db
      .select()
      .from(connections)
      .where(and(eq(connections.id, id), eq(connections.userId, userId)));
    return connection || undefined;
  }

  async createConnection(userId: string, connection: InsertConnection): Promise<Connection> {
    const [newConnection] = await db
      .insert(connections)
      .values({ ...connection, userId })
      .returning();
    return newConnection;
  }

  async updateConnection(id: string, userId: string, connection: Partial<InsertConnection>): Promise<Connection | undefined> {
    const [updated] = await db
      .update(connections)
      .set(connection)
      .where(and(eq(connections.id, id), eq(connections.userId, userId)))
      .returning();
    return updated || undefined;
  }

  async deleteConnection(id: string, userId: string): Promise<boolean> {
    const result = await db
      .delete(connections)
      .where(and(eq(connections.id, id), eq(connections.userId, userId)));
    return result.rowCount !== null && result.rowCount > 0;
  }

  // Goal operations
  async getGoals(userId: string): Promise<Goal[]> {
    return await db.select().from(goals).where(eq(goals.userId, userId));
  }

  async getGoal(id: string, userId: string): Promise<Goal | undefined> {
    const [goal] = await db
      .select()
      .from(goals)
      .where(and(eq(goals.id, id), eq(goals.userId, userId)));
    return goal || undefined;
  }

  async createGoal(userId: string, goal: InsertGoal): Promise<Goal> {
    const [newGoal] = await db
      .insert(goals)
      .values({ ...goal, userId })
      .returning();
    return newGoal;
  }

  async updateGoal(id: string, userId: string, goal: Partial<InsertGoal>): Promise<Goal | undefined> {
    const [updated] = await db
      .update(goals)
      .set(goal)
      .where(and(eq(goals.id, id), eq(goals.userId, userId)))
      .returning();
    return updated || undefined;
  }

  async deleteGoal(id: string, userId: string): Promise<boolean> {
    const result = await db
      .delete(goals)
      .where(and(eq(goals.id, id), eq(goals.userId, userId)));
    return result.rowCount !== null && result.rowCount > 0;
  }

  // Task operations
  async getTasks(userId: string): Promise<Task[]> {
    return await db.select().from(tasks).where(eq(tasks.userId, userId));
  }

  async getTask(id: string, userId: string): Promise<Task | undefined> {
    const [task] = await db
      .select()
      .from(tasks)
      .where(and(eq(tasks.id, id), eq(tasks.userId, userId)));
    return task || undefined;
  }

  async createTask(userId: string, task: InsertTask): Promise<Task> {
    const [newTask] = await db
      .insert(tasks)
      .values({ ...task, userId })
      .returning();
    return newTask;
  }

  async updateTask(id: string, userId: string, task: Partial<InsertTask>): Promise<Task | undefined> {
    const [updated] = await db
      .update(tasks)
      .set(task)
      .where(and(eq(tasks.id, id), eq(tasks.userId, userId)))
      .returning();
    return updated || undefined;
  }

  async deleteTask(id: string, userId: string): Promise<boolean> {
    const result = await db
      .delete(tasks)
      .where(and(eq(tasks.id, id), eq(tasks.userId, userId)));
    return result.rowCount !== null && result.rowCount > 0;
  }

  // Weekly Review operations
  async getWeeklyReviews(userId: string): Promise<WeeklyReview[]> {
    return await db.select().from(weeklyReviews).where(eq(weeklyReviews.userId, userId));
  }

  async getWeeklyReview(id: string, userId: string): Promise<WeeklyReview | undefined> {
    const [review] = await db
      .select()
      .from(weeklyReviews)
      .where(and(eq(weeklyReviews.id, id), eq(weeklyReviews.userId, userId)));
    return review || undefined;
  }

  async createWeeklyReview(userId: string, review: InsertWeeklyReview): Promise<WeeklyReview> {
    const [newReview] = await db
      .insert(weeklyReviews)
      .values({ ...review, userId })
      .returning();
    return newReview;
  }

  async deleteWeeklyReview(id: string, userId: string): Promise<boolean> {
    const result = await db
      .delete(weeklyReviews)
      .where(and(eq(weeklyReviews.id, id), eq(weeklyReviews.userId, userId)));
    return result.rowCount !== null && result.rowCount > 0;
  }
}

export const storage = new DatabaseStorage();
