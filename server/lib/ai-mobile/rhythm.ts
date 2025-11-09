/**
 * WEEK 2: RHYTHM ⚡
 * Focus: Building daily habits and consistent practices
 */

import {
  MobileGoalSuggestion,
  MobileTaskSuggestion,
  callClaudeForGoals,
  callOpenAIForGoals,
  callOpenAIForTasks,
  callClaudeForTasks,
  getBasicTaskBreakdown,
} from "./shared";

const WEEK_NUMBER = 2;

/**
 * Generate Rhythm-focused goals from North Star
 * Custom prompt optimized for Week 2: building consistent habits and daily practices
 */
export async function generateRhythmGoals(
  northStar: string,
  existingGoals?: Array<{ title: string; description: string }>
): Promise<MobileGoalSuggestion[]> {
  const prompt = `You are an expert executive coach specializing in helping professionals build sustainable habits and daily routines.

CONTEXT:
The user is in Week 2 of a 5-week transformation program called "Opus."
Week 2 Theme: RHYTHM ⚡
Focus: Building daily habits and consistent practices

User's North Star (ultimate professional vision):
"${northStar}"

${existingGoals && existingGoals.length > 0 ? `\nEXISTING GOALS (avoid duplicates):\n${existingGoals.map(g => `- ${g.title}: ${g.description}`).join('\n')}\n` : ''}

YOUR TASK:
Generate 3-4 specific, actionable goals for Week 2 that help this person:

1. **Establish daily rituals** that support their north star
2. **Create sustainable routines** (not just productivity hacks)
3. **Build energy management practices** - when do they do their best work?
4. **Design their ideal work rhythm** - the daily flow that makes success inevitable

PRINCIPLES FOR RHYTHM GOALS:
✅ Process-oriented, not outcome-oriented
✅ Emphasize "systems" over "goals"
✅ Focus on consistency and habit formation
✅ Should build on Week 1's purpose clarity
✅ Achievable within 1 week
✅ Create sustainable practices (not burnout-inducing)

KEY INSIGHT: Purpose without rhythm is just a dream. This week is about building the daily practices that turn their vision into reality.

AVOID:
❌ One-time tasks or projects
❌ Vague goals like "be more productive"
❌ Unsustainable intensity ("work 12 hours a day")
❌ Goals not connected to daily habits

Return ONLY a JSON array (no markdown, no explanation) with this exact structure:
[
  {
    "title": "Concise goal title (5-8 words)",
    "description": "2-3 sentences explaining the habit/routine and why it matters for building rhythm",
    "category": "personal",
    "reasoning": "1 sentence connecting this daily practice to their north star: ${northStar}",
    "weekNumber": 2
  }
]`;

  // Try Claude first (better at coaching/nuanced understanding)
  let goals = await callClaudeForGoals(prompt);
  if (goals) return goals;

  // Fallback to OpenAI
  goals = await callOpenAIForGoals(prompt);
  if (goals) return goals;

  // Final fallback: hand-crafted Rhythm goals
  return getRhythmFallbackGoals();
}

/**
 * Generate Rhythm-focused tasks from a goal
 * Custom prompt optimized for Week 2: habit-building, consistency-focused tasks
 */
export async function generateRhythmTasks(
  goal: { title: string; description: string },
  northStar: string
): Promise<MobileTaskSuggestion[]> {
  const prompt = `You are a professional coach helping someone build consistent daily habits and routines.

CONTEXT:
Week 2 Theme: RHYTHM - Building daily habits and consistent practices
North Star: "${northStar}"

GOAL TO BREAK DOWN:
Title: ${goal.title}
Description: ${goal.description}

YOUR TASK:
Generate 3-5 specific tasks that help them build this habit through:
- **Morning/evening routines** - bookends to the day
- **Daily practice** of core skills
- **Time-blocking exercises** - designing their ideal schedule
- **Energy tracking** - when are they most productive?
- **Habit stacking** - attaching new habits to existing ones

PRINCIPLES FOR RHYTHM TASKS:
✅ Recommend tasks at SAME TIME each day to build habit loops
✅ Start with "tiny habits" - 5-10 minute commitments
✅ Focus on consistency over intensity
✅ Include tracking/reflection on the habit
✅ Make the habit obvious, attractive, easy, and satisfying

EXAMPLE TASKS:
- "Morning ritual: 10 min planning session before checking email" (Daily 8am, 10 min)
- "Track your energy: Note 3 times today when you felt most focused" (End of day, 5 min)
- "Time-block tomorrow: Schedule your 3 most important tasks" (Evening, 15 min)

Return ONLY a JSON array (no markdown) with this structure:
[
  {
    "title": "Action-oriented task title",
    "description": "What exactly to do and what success looks like",
    "recommendedSchedule": "Morning" or "Daily at 8am" or "Evening",
    "estimatedTime": "5 minutes" or "10 minutes" etc,
    "reasoning": "Why this time helps build the habit"
  }
]`;

  // Try OpenAI first (good at task decomposition)
  let tasks = await callOpenAIForTasks(prompt);
  if (tasks) return tasks;

  // Fallback to Claude
  tasks = await callClaudeForTasks(prompt);
  if (tasks) return tasks;

  // Final fallback
  return getBasicTaskBreakdown(goal);
}

/**
 * Fallback goals if AI fails
 */
function getRhythmFallbackGoals(): MobileGoalSuggestion[] {
  return [
    {
      title: "Establish a morning ritual",
      description: "Design and commit to a 15-minute morning practice that energizes you for the day ahead. Could include planning, journaling, or skill practice.",
      category: "personal",
      reasoning: "Consistent daily practices create the rhythm for long-term success.",
      weekNumber: WEEK_NUMBER
    },
    {
      title: "Time-block your ideal work week",
      description: "Design your ideal weekly schedule. When do you do deep work? When do you connect with people? When do you recharge?",
      category: "professional",
      reasoning: "Intentional scheduling turns your north star into daily reality.",
      weekNumber: WEEK_NUMBER
    },
    {
      title: "Track and optimize your energy patterns",
      description: "For one week, note when you feel most focused, creative, and energized. Design your schedule around these patterns.",
      category: "personal",
      reasoning: "Working with your natural energy rhythms multiplies your effectiveness.",
      weekNumber: WEEK_NUMBER
    }
  ];
}
