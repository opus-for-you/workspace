/**
 * AI Mobile - Week-specific AI workflows
 *
 * This module routes to week-specific AI functions for goal generation,
 * task generation, and reflection analysis. Each week has custom prompts
 * optimized for that week's theme.
 */

import { generatePurposeGoals, generatePurposeTasks } from "./purpose";
import { generateRhythmGoals, generateRhythmTasks } from "./rhythm";
import { generateNetworkGoals, generateNetworkTasks } from "./network";
import { generateStructureGoals, generateStructureTasks } from "./structure";
import { generateMethodsGoals, generateMethodsTasks } from "./methods";
import {
  MobileGoalSuggestion,
  MobileTaskSuggestion,
  ReflectionAnalysis,
  callClaudeForReflection,
  callOpenAIForReflection,
  getBasicReflectionAnalysis,
} from "./shared";
import { getWeekTheme } from "../opus-framework";

/**
 * Generate goals from North Star using week-specific prompts
 * Routes to the appropriate week's goal generation function
 */
export async function generateGoalsFromNorthStar(
  northStar: string,
  programWeek: number,
  existingGoals?: Array<{ title: string; description: string }>
): Promise<MobileGoalSuggestion[]> {
  switch (programWeek) {
    case 1:
      return generatePurposeGoals(northStar, existingGoals);
    case 2:
      return generateRhythmGoals(northStar, existingGoals);
    case 3:
      return generateNetworkGoals(northStar, existingGoals);
    case 4:
      return generateStructureGoals(northStar, existingGoals);
    case 5:
      return generateMethodsGoals(northStar, existingGoals);
    default:
      throw new Error(`Invalid program week: ${programWeek}. Must be 1-5.`);
  }
}

/**
 * Generate tasks from a goal using week-specific prompts
 * Routes to the appropriate week's task generation function
 */
export async function generateTasksFromGoal(
  goal: { title: string; description: string },
  northStar: string,
  programWeek: number
): Promise<MobileTaskSuggestion[]> {
  switch (programWeek) {
    case 1:
      return generatePurposeTasks(goal, northStar);
    case 2:
      return generateRhythmTasks(goal, northStar);
    case 3:
      return generateNetworkTasks(goal, northStar);
    case 4:
      return generateStructureTasks(goal, northStar);
    case 5:
      return generateMethodsTasks(goal, northStar);
    default:
      throw new Error(`Invalid program week: ${programWeek}. Must be 1-5.`);
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
    const claudeResult = await callClaudeForReflection(prompt);
    if (claudeResult) return claudeResult;

    // OpenAI fallback
    const openaiResult = await callOpenAIForReflection(prompt);
    if (openaiResult) return openaiResult;

    return getBasicReflectionAnalysis(programWeek);
  } catch (error) {
    console.error("Error analyzing reflection:", error);
    return getBasicReflectionAnalysis(programWeek);
  }
}

// Re-export types for convenience
export type {
  MobileGoalSuggestion,
  MobileTaskSuggestion,
  ReflectionAnalysis,
} from "./shared";
