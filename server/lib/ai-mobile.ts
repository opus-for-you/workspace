import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";
import { getWeekTheme } from "./opus-framework";

// Initialize AI clients
const anthropicClient = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null;

const openaiClient = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

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

/**
 * Generate goals from North Star using Opus Framework
 * Uses Claude for deep understanding, OpenAI as fallback
 */
export async function generateGoalsFromNorthStar(
  northStar: string,
  programWeek: number,
  existingGoals?: Array<{ title: string; description: string }>
): Promise<MobileGoalSuggestion[]> {
  const weekTheme = getWeekTheme(programWeek);

  if (!weekTheme) {
    throw new Error('Invalid program week');
  }

  const prompt = `You are an expert professional coach using the Opus Framework to guide someone through a 5-week transformation program.

CONTEXT:
User's North Star (ultimate professional vision): "${northStar}"

CURRENT WEEK: Week ${programWeek} - ${weekTheme.title}
Focus: ${weekTheme.focus}
${weekTheme.description}

${weekTheme.goalPromptGuidance}

${existingGoals && existingGoals.length > 0 ? `\nEXISTING GOALS:\n${existingGoals.map(g => `- ${g.title}: ${g.description}`).join('\n')}\n` : ''}

TASK:
Generate 3-4 specific, actionable goals for Week ${programWeek} that:
1. Align with their North Star vision
2. Follow the Week ${programWeek} theme (${weekTheme.title})
3. Are achievable within this single week
4. Build toward their ultimate vision
5. Don't duplicate existing goals

Return ONLY a JSON array (no markdown, no explanation) with this exact structure:
[
  {
    "title": "Concise goal title (5-8 words)",
    "description": "2-3 sentences explaining the goal and why it matters",
    "category": "professional",
    "reasoning": "1 sentence on how this supports their north star",
    "weekNumber": ${programWeek}
  }
]`;

  try {
    // Try Claude first (better at coaching/nuanced understanding)
    if (anthropicClient) {
      const response = await anthropicClient.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 2000,
        temperature: 0.7,
        messages: [{
          role: "user",
          content: prompt
        }]
      });

      const content = response.content[0];
      if (content.type === "text") {
        const text = content.text.trim();
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
      }
    }

    // Fallback to OpenAI
    if (openaiClient) {
      const response = await openaiClient.chat.completions.create({
        model: "gpt-4o",
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
    }

    // Fallback suggestions
    return getOpusFallbackGoals(northStar, programWeek);
  } catch (error) {
    console.error("Error generating goals from north star:", error);
    return getOpusFallbackGoals(northStar, programWeek);
  }
}

/**
 * Generate tasks from a goal with recommended schedule
 * Uses OpenAI for task decomposition, Claude as fallback
 */
export async function generateTasksFromGoal(
  goal: { title: string; description: string },
  northStar: string,
  programWeek: number
): Promise<MobileTaskSuggestion[]> {
  const weekTheme = getWeekTheme(programWeek);

  if (!weekTheme) {
    throw new Error('Invalid program week');
  }

  const prompt = `You are a professional coach helping someone break down a goal into actionable tasks.

CONTEXT:
North Star: "${northStar}"
Week ${programWeek} Theme: ${weekTheme.title} - ${weekTheme.focus}

GOAL TO BREAK DOWN:
Title: ${goal.title}
Description: ${goal.description}

${weekTheme.taskPromptGuidance}

TASK:
Generate 3-5 specific, actionable tasks that:
1. Move this goal forward concretely
2. Can be completed this week
3. Are small and achievable (15-45 minutes each)
4. Have clear completion criteria
5. Include recommended scheduling (morning/afternoon/evening + optional day)

Return ONLY a JSON array (no markdown) with this structure:
[
  {
    "title": "Action-oriented task title",
    "description": "What exactly to do and what success looks like",
    "recommendedSchedule": "Morning" or "Tuesday afternoon" or "Evening",
    "estimatedTime": "15 minutes" or "30 minutes" etc,
    "reasoning": "Why schedule it at this time"
  }
]`;

  try {
    // Try OpenAI first (better at task decomposition)
    if (openaiClient) {
      const response = await openaiClient.chat.completions.create({
        model: "gpt-4o-mini",
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
    }

    // Fallback to Claude
    if (anthropicClient) {
      const response = await anthropicClient.messages.create({
        model: "claude-3-5-haiku-20241022",
        max_tokens: 1500,
        temperature: 0.6,
        messages: [{
          role: "user",
          content: prompt
        }]
      });

      const content = response.content[0];
      if (content.type === "text") {
        const text = content.text.trim();
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
      }
    }

    // Basic fallback
    return getBasicTaskBreakdown(goal);
  } catch (error) {
    console.error("Error generating tasks:", error);
    return getBasicTaskBreakdown(goal);
  }
}

/**
 * Analyze weekly reflection and generate insights
 * Uses Claude for deep analysis, OpenAI as fallback
 */
export async function analyzeReflection(
  reflection: {
    wins?: string;
    lessons?: string;
    nextSteps?: string;
  },
  completedGoals: Array<{ title: string; progress: number }>,
  completedTasks: Array<{ title: string }>,
  programWeek: number
): Promise<ReflectionAnalysis> {
  const weekTheme = getWeekTheme(programWeek);
  const nextWeekTheme = getWeekTheme(programWeek + 1);

  const prompt = `You are an expert coach analyzing a user's weekly reflection.

WEEK ${programWeek} THEME: ${weekTheme?.title} - ${weekTheme?.focus}
NEXT WEEK THEME: ${nextWeekTheme ? `${nextWeekTheme.title} - ${nextWeekTheme.focus}` : 'Program Complete'}

USER'S REFLECTION:
Wins: ${reflection.wins || 'Not provided'}
Lessons: ${reflection.lessons || 'Not provided'}
Next Steps: ${reflection.nextSteps || 'Not provided'}

PROGRESS THIS WEEK:
Goals: ${completedGoals.map(g => `${g.title} (${g.progress}% complete)`).join(', ') || 'None'}
Tasks Completed: ${completedTasks.map(t => t.title).join(', ') || 'None'}

ANALYZE:
1. What patterns emerge from their wins and lessons?
2. What insights can help them grow?
3. What should they focus on next week?
4. How does this week's progress support their transformation?

Return ONLY a JSON object (no markdown):
{
  "insights": ["Insight 1 (2-3 sentences)", "Insight 2", "Insight 3"],
  "patterns": ["Pattern 1 (1-2 sentences)", "Pattern 2"],
  "recommendations": ["Recommendation 1 (specific action)", "Recommendation 2", "Recommendation 3"],
  "nextWeekFocus": "A concise statement (2-3 sentences) about what to focus on next week"
}`;

  try {
    // Claude is better at empathetic, nuanced analysis
    if (anthropicClient) {
      const response = await anthropicClient.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 1500,
        temperature: 0.7,
        messages: [{
          role: "user",
          content: prompt
        }]
      });

      const content = response.content[0];
      if (content.type === "text") {
        const text = content.text.trim();
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
      }
    }

    // OpenAI fallback
    if (openaiClient) {
      const response = await openaiClient.chat.completions.create({
        model: "gpt-4o",
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
    }

    return getBasicReflectionAnalysis(programWeek);
  } catch (error) {
    console.error("Error analyzing reflection:", error);
    return getBasicReflectionAnalysis(programWeek);
  }
}

// Fallback functions
function getOpusFallbackGoals(northStar: string, week: number): MobileGoalSuggestion[] {
  const weekTheme = getWeekTheme(week);
  const baseGoals: Record<number, MobileGoalSuggestion[]> = {
    1: [{
      title: "Clarify your professional values",
      description: "Spend 30 minutes writing about what makes work meaningful to you. Focus on values, not job titles.",
      category: "personal",
      reasoning: "Understanding your values is the foundation for purpose-driven work.",
      weekNumber: 1
    }],
    2: [{
      title: "Establish a morning ritual",
      description: "Design and commit to a 15-minute morning practice that energizes you for the day ahead.",
      category: "personal",
      reasoning: "Consistent daily practices create the rhythm for long-term success.",
      weekNumber: 2
    }],
    3: [{
      title: "Connect with a mentor or advisor",
      description: "Reach out to someone you admire and schedule a 30-minute conversation to learn from their experience.",
      category: "professional",
      reasoning: "Strong relationships accelerate your growth and open new possibilities.",
      weekNumber: 3
    }],
    4: [{
      title: "Document your decision-making process",
      description: "Create a simple framework for how you make key professional decisions. Write it down.",
      category: "professional",
      reasoning: "Systems reduce decision fatigue and improve consistency.",
      weekNumber: 4
    }],
    5: [{
      title: "Master one core skill",
      description: "Choose your most valuable skill and practice it deliberately for 30 minutes daily this week.",
      category: "learning",
      reasoning: "Deep skill development creates compounding returns in your career.",
      weekNumber: 5
    }]
  };

  return baseGoals[week] || baseGoals[1];
}

function getBasicTaskBreakdown(goal: { title: string }): MobileTaskSuggestion[] {
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

function getBasicReflectionAnalysis(week: number): ReflectionAnalysis {
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
