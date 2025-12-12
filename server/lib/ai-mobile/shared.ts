import OpenAI from "openai";

/**
 * Shared AI utilities for all weeks
 * Using OpenAI GPT-5 family models exclusively
 */

// Initialize OpenAI client
if (!process.env.OPENAI_API_KEY) {
  console.warn("WARNING: OPENAI_API_KEY not set. AI features will use fallback responses.");
}

export const openaiClient = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

// Shared types
export interface MobileGoalSuggestion {
  title: string;
  description: string;
  category: "personal" | "professional" | "health" | "learning";
  reasoning: string;
  weekNumber: number;
}

export interface MobileTaskSuggestion {
  title: string;
  description: string;
  recommendedSchedule: string; // e.g., "Morning", "Tuesday afternoon"
  estimatedTime: string; // e.g., "15 minutes", "30 minutes"
  reasoning: string;
}

export interface ReflectionAnalysis {
  insights: string[];
  patterns: string[];
  recommendations: string[];
  nextWeekFocus: string;
}

// Shared utility: Call OpenAI for goals (GPT-5.2 Thinking)
export async function callOpenAIForGoals(prompt: string): Promise<MobileGoalSuggestion[] | null> {
  if (!openaiClient) return null;

  try {
    const response = await openaiClient.chat.completions.create({
      model: "gpt-5.2",
      messages: [{
        role: "system",
        content: "You are an expert professional coach. Return ONLY valid JSON, no markdown or explanations."
      }, {
        role: "user",
        content: prompt
      }],
      temperature: 0.7,
      response_format: { type: "json_object" }
    });

    const content = response.choices[0]?.message?.content;
    if (content) {
      const parsed = JSON.parse(content);
      return parsed.goals || parsed;
    }
  } catch (error) {
    console.error("OpenAI API error (goals):", error);
  }

  return null;
}

// Shared utility: Call OpenAI for tasks (GPT-5 Mini)
export async function callOpenAIForTasks(prompt: string): Promise<MobileTaskSuggestion[] | null> {
  if (!openaiClient) return null;

  try {
    const response = await openaiClient.chat.completions.create({
      model: "gpt-5-mini",
      messages: [{
        role: "system",
        content: "You are a task planning expert. Return ONLY valid JSON."
      }, {
        role: "user",
        content: prompt
      }],
      temperature: 0.6,
      response_format: { type: "json_object" }
    });

    const content = response.choices[0]?.message?.content;
    if (content) {
      const parsed = JSON.parse(content);
      return parsed.tasks || parsed;
    }
  } catch (error) {
    console.error("OpenAI API error (tasks):", error);
  }

  return null;
}

// Shared utility: Call OpenAI for reflection analysis (GPT-5.2 Thinking)
export async function callOpenAIForReflection(prompt: string): Promise<ReflectionAnalysis | null> {
  if (!openaiClient) return null;

  try {
    const response = await openaiClient.chat.completions.create({
      model: "gpt-5.2",
      messages: [{
        role: "system",
        content: "You are an empathetic professional coach. Return ONLY valid JSON."
      }, {
        role: "user",
        content: prompt
      }],
      temperature: 0.7,
      response_format: { type: "json_object" }
    });

    const content = response.choices[0]?.message?.content;
    if (content) {
      return JSON.parse(content);
    }
  } catch (error) {
    console.error("OpenAI API error (reflection):", error);
  }

  return null;
}

// Generic fallback for task breakdown
export function getBasicTaskBreakdown(goal: { title: string }): MobileTaskSuggestion[] {
  return [
    {
      title: `Research: ${goal.title}`,
      description: "Spend 15 minutes researching best practices and approaches.",
      recommendedSchedule: "Morning",
      estimatedTime: "15 minutes",
      reasoning: "Morning is best for focused research"
    },
    {
      title: `Plan: ${goal.title}`,
      description: "Create a simple action plan with 3-5 concrete steps.",
      recommendedSchedule: "Afternoon",
      estimatedTime: "20 minutes",
      reasoning: "Planning works well in afternoon energy"
    },
    {
      title: `Act: First step toward ${goal.title}`,
      description: "Take the first action from your plan.",
      recommendedSchedule: "Morning",
      estimatedTime: "30 minutes",
      reasoning: "Do hardest work when energy is highest"
    }
  ];
}

// Generic fallback for reflection analysis
export function getBasicReflectionAnalysis(week: number): ReflectionAnalysis {
  return {
    insights: [
      "You're making progress on your transformation journey.",
      "Consistency is more important than perfection.",
      "Small wins compound into major achievements."
    ],
    patterns: [
      "Focus on what's working and do more of it.",
      "Learn from challenges without self-judgment."
    ],
    recommendations: [
      "Continue building on this week's momentum.",
      "Identify one small improvement for next week.",
      "Celebrate your progress so far."
    ],
    nextWeekFocus: `Continue building on Week ${week}'s foundation. Stay consistent with what's working and make one small adjustment to improve.`
  };
}
