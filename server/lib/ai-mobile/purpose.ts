/**
 * WEEK 1: PURPOSE 🎯
 * Focus: Clarifying vision and identifying meaningful work
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

const WEEK_NUMBER = 1;

/**
 * Generate Purpose-focused goals from North Star
 * Custom prompt optimized for Week 1: defining values and meaningful work
 */
export async function generatePurposeGoals(
  northStar: string,
  existingGoals?: Array<{ title: string; description: string }>
): Promise<MobileGoalSuggestion[]> {
  const prompt = `You are an expert executive coach specializing in helping professionals discover their purpose and define meaningful work.

CONTEXT:
The user is in Week 1 of a 5-week transformation program called "Opus."
Week 1 Theme: PURPOSE 🎯
Focus: Clarifying vision and identifying meaningful work

User's North Star (ultimate professional vision):
"${northStar}"

${existingGoals && existingGoals.length > 0 ? `\nEXISTING GOALS (avoid duplicates):\n${existingGoals.map(g => `- ${g.title}: ${g.description}`).join('\n')}\n` : ''}

YOUR TASK:
Generate 3-4 specific, actionable goals for Week 1 that help this person:

1. **Clarify what meaningful work looks like** - Not chasing titles or external validation, but defining what truly matters to THEM personally
2. **Identify their core professional values** - What do they stand for? What energizes them?
3. **Define success on their own terms** - What does "winning" mean in their career?
4. **Build self-awareness** about what work makes them feel alive

PRINCIPLES FOR PURPOSE GOALS:
✅ Values-based, not outcome-based
✅ Introspective and reflective
✅ Help them clarify their "why"
✅ Achievable within 1 week
✅ Specific and concrete (not vague like "find my purpose")
✅ Directly connected to their north star vision

AVOID:
❌ Generic career goals ("get promoted", "earn more money")
❌ Vague aspirations ("be happier at work")
❌ Goals focused on external validation
❌ Duplicating existing goals

Return ONLY a JSON array (no markdown, no explanation) with this exact structure:
[
  {
    "title": "Concise goal title (5-8 words)",
    "description": "2-3 sentences explaining the goal and why it matters for clarifying their purpose",
    "category": "personal",
    "reasoning": "1 sentence connecting this to their north star: ${northStar}",
    "weekNumber": 1
  }
]`;

  // Try Claude first (better at coaching/nuanced understanding)
  let goals = await callClaudeForGoals(prompt);
  if (goals) return goals;

  // Fallback to OpenAI
  goals = await callOpenAIForGoals(prompt);
  if (goals) return goals;

  // Final fallback: hand-crafted Purpose goals
  return getPurposeFallbackGoals();
}

/**
 * Generate Purpose-focused tasks from a goal
 * Custom prompt optimized for Week 1: reflective, exploratory tasks
 */
export async function generatePurposeTasks(
  goal: { title: string; description: string },
  northStar: string
): Promise<MobileTaskSuggestion[]> {
  const prompt = `You are a professional coach helping someone break down a PURPOSE goal into reflective, exploratory tasks.

CONTEXT:
Week 1 Theme: PURPOSE - Clarifying vision and identifying meaningful work
North Star: "${northStar}"

GOAL TO BREAK DOWN:
Title: ${goal.title}
Description: ${goal.description}

YOUR TASK:
Generate 3-5 specific tasks that help them explore this goal through:
- **Journaling exercises** about values and meaning
- **Conversations** with mentors, role models, or trusted advisors
- **Auditing current work** for alignment with values
- **Reading/research** about purpose-driven work
- **Reflection** on past experiences that felt meaningful

PRINCIPLES FOR PURPOSE TASKS:
✅ Reflective and exploratory (not just "do this thing")
✅ Small and achievable (15-30 minutes each)
✅ Schedule reflective tasks in the MORNING when mind is fresh
✅ Create clear completion criteria
✅ Build self-awareness

EXAMPLE TASKS:
- "Journal: Write about 3 times you felt most alive at work" (Morning, 20 min)
- "Call your mentor and ask: What do you see as my unique strengths?" (Afternoon, 30 min)
- "Audit last month's work: What % aligned with your values?" (Morning, 15 min)

Return ONLY a JSON array (no markdown) with this structure:
[
  {
    "title": "Action-oriented task title",
    "description": "What exactly to do and what success looks like",
    "recommendedSchedule": "Morning" or "Tuesday afternoon" or "Evening",
    "estimatedTime": "15 minutes" or "20 minutes" etc,
    "reasoning": "Why schedule it at this time"
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
function getPurposeFallbackGoals(): MobileGoalSuggestion[] {
  return [
    {
      title: "Clarify your professional values",
      description: "Spend 30 minutes writing about what makes work meaningful to you. Focus on values, not job titles. What do you stand for?",
      category: "personal",
      reasoning: "Understanding your values is the foundation for purpose-driven work.",
      weekNumber: WEEK_NUMBER
    },
    {
      title: "Audit your work for purpose alignment",
      description: "Review your last month of work. What percentage aligned with your values? What energized you vs. drained you?",
      category: "professional",
      reasoning: "Awareness of current alignment helps you course-correct toward your north star.",
      weekNumber: WEEK_NUMBER
    },
    {
      title: "Define what 'meaningful work' means to you",
      description: "Write 2-3 paragraphs describing your ideal workday. What are you doing? Who are you helping? How do you feel?",
      category: "personal",
      reasoning: "Clarity on what meaningful work looks like makes it easier to pursue.",
      weekNumber: WEEK_NUMBER
    }
  ];
}
