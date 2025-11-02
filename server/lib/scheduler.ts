import * as cron from "node-cron";
import { storage } from "../storage";
import type { User } from "@shared/schema";

/**
 * Scheduler service for sending automated reminders and notifications
 * Uses node-cron to schedule recurring tasks
 */

// Track active cron jobs for cleanup
const activeJobs: cron.ScheduledTask[] = [];

/**
 * Initialize all scheduled tasks
 */
export function initializeScheduler() {
  console.log("[scheduler] Initializing scheduled tasks...");

  // Weekly review reminder - Every Sunday at 6 PM
  const weeklyReviewJob = cron.schedule("0 18 * * 0", async () => {
    console.log("[scheduler] Running weekly review reminder...");
    await sendWeeklyReviewReminders();
  });
  activeJobs.push(weeklyReviewJob);

  // Goal check-in reminder - Every Monday at 9 AM
  const goalCheckInJob = cron.schedule("0 9 * * 1", async () => {
    console.log("[scheduler] Running goal check-in reminder...");
    await sendGoalCheckInReminders();
  });
  activeJobs.push(goalCheckInJob);

  // Daily reflection prompt - Every day at 8 PM
  const dailyReflectionJob = cron.schedule("0 20 * * *", async () => {
    console.log("[scheduler] Running daily reflection prompt...");
    await sendDailyReflectionPrompts();
  });
  activeJobs.push(dailyReflectionJob);

  console.log("[scheduler] All scheduled tasks initialized successfully");
  console.log("[scheduler] - Weekly review reminder: Sundays at 6 PM");
  console.log("[scheduler] - Goal check-in reminder: Mondays at 9 AM");
  console.log("[scheduler] - Daily reflection prompt: Every day at 8 PM");
}

/**
 * Shutdown all scheduled tasks gracefully
 */
export function shutdownScheduler() {
  console.log("[scheduler] Shutting down scheduled tasks...");
  activeJobs.forEach(job => job.stop());
  console.log("[scheduler] All tasks stopped");
}

/**
 * Send weekly review reminders to all users
 */
async function sendWeeklyReviewReminders() {
  try {
    const users = await storage.getAllUsers();
    console.log(`[scheduler] Sending weekly review reminders to ${users.length} users`);
    
    // TODO: Implement actual notification delivery (email, push, in-app)
    // For now, we just log the reminders
    users.forEach((user: User) => {
      console.log(`[scheduler] Reminder: ${user.username} - Time for your weekly review!`);
    });
  } catch (error) {
    console.error("[scheduler] Error sending weekly review reminders:", error);
  }
}

/**
 * Send goal check-in reminders to users with active goals
 */
async function sendGoalCheckInReminders() {
  try {
    const users = await storage.getAllUsers();
    
    for (const user of users) {
      const goals = await storage.getGoals(user.id);
      const activeGoals = goals.filter(g => g.progress < 100);
      
      if (activeGoals.length > 0) {
        console.log(`[scheduler] Reminder: ${user.username} - Check in on your ${activeGoals.length} active goal(s)`);
        // TODO: Send actual notification
      }
    }
  } catch (error) {
    console.error("[scheduler] Error sending goal check-in reminders:", error);
  }
}

/**
 * Send daily reflection prompts to all users
 */
async function sendDailyReflectionPrompts() {
  try {
    const users = await storage.getAllUsers();
    console.log(`[scheduler] Sending daily reflection prompts to ${users.length} users`);
    
    const prompts = [
      "What's one thing you're grateful for today?",
      "What progress did you make toward your goals today?",
      "What did you learn today?",
      "What's one thing you could improve tomorrow?",
      "Who made a positive impact on your day?",
    ];
    
    const todayPrompt = prompts[new Date().getDay() % prompts.length];
    
    users.forEach((user: User) => {
      console.log(`[scheduler] Daily prompt for ${user.username}: "${todayPrompt}"`);
      // TODO: Send actual notification
    });
  } catch (error) {
    console.error("[scheduler] Error sending daily reflection prompts:", error);
  }
}
