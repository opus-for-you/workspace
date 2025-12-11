/**
 * WEEK 5: METHODS 🔧
 * Focus: Refining techniques and optimizing approach
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

const WEEK_NUMBER = 5;

/**
 * Generate Methods-focused goals from North Star
 * Custom prompt optimized for Week 5: skill mastery and optimization
 */
export async function generateMethodsGoals(
  northStar: string,
  existingGoals?: Array<{ title: string; description: string }>
): Promise<MobileGoalSuggestion[]> {
  const prompt = `You are an expert executive coach specializing in helping professionals master their craft and optimize their approach.

CONTEXT:
The user is in Week 5 (FINAL WEEK) of a 5-week transformation program called "Opus."
Week 5 Theme: METHODS 🔧
Focus: Refining techniques and optimizing approach

User's North Star (ultimate professional vision):
"${northStar}"

${existingGoals && existingGoals.length > 0 ? `\nEXISTING GOALS (avoid duplicates):\n${existingGoals.map(g => `- ${g.title}: ${g.description}`).join('\n')}\n` : ''}

YOUR TASK:
Generate 3-4 specific, actionable goals for Week 5 that help this person:

1. **Master one core skill deeply** - not breadth, but depth
2. **Optimize existing processes** - make what's working work even better
3. **Learn advanced techniques** - level up their craft
4. **Get feedback and iterate** - continuous improvement through expert input

PRINCIPLES FOR METHODS GOALS:
✅ Focus on mastery, not breadth
✅ Emphasize compounding skills that multiply impact
✅ Should build on all previous weeks (purpose → rhythm → network → structure)
✅ Achievable within 1 week
✅ Create measurable improvement in core competencies
✅ This is the capstone - bring it all together

KEY INSIGHT: You have the foundation. Now it's time to level up your craft. This week is about deliberate skill development and optimization.

AVOID:
❌ Learning new things just for the sake of it
❌ Vague goals like "get better at my job"
❌ Skills not aligned with their north star
❌ Surface-level dabbling instead of deep practice

Return ONLY a JSON array (no markdown, no explanation) with this exact structure:
[
  {
    "title": "Concise goal title (5-8 words)",
    "description": "2-3 sentences explaining the skill/method and why mastery compounds over time",
    "category": "learning",
    "reasoning": "1 sentence connecting this skill mastery to their north star: ${northStar}",
    "weekNumber": 5
  }
]`;

  // Try Claude first (better at coaching/growth mindset)
  let goals = await callClaudeForGoals(prompt);
  if (goals) return goals;

  // Fallback to OpenAI
  goals = await callOpenAIForGoals(prompt);
  if (goals) return goals;

  // Final fallback: hand-crafted Methods goals
  return getMethodsFallbackGoals();
}

/**
 * Generate Methods-focused tasks from a goal
 * Custom prompt optimized for Week 5: deliberate practice, skill refinement tasks
 */
export async function generateMethodsTasks(
  goal: { title: string; description: string },
  northStar: string
): Promise<MobileTaskSuggestion[]> {
  const prompt = `You are a professional coach helping someone master their craft through deliberate practice and optimization.

CONTEXT:
Week 5 Theme: METHODS - Refining techniques and optimizing approach
North Star: "${northStar}"

GOAL TO BREAK DOWN:
Title: ${goal.title}
Description: ${goal.description}

YOUR TASK:
Generate 3-5 specific tasks that develop this skill through:
- **Deliberate practice** of core competencies
- **Seeking expert feedback** on their work
- **Studying best practices** in their field
- **Experimenting and measuring results** - what works?
- **Reflecting on improvement** - how have they grown?

PRINCIPLES FOR METHODS TASKS:
✅ Schedule skill practice in PEAK ENERGY hours
✅ 30 minutes of focused practice > 2 hours of casual work
✅ Include feedback loops - how will they know they're improving?
✅ Make practice specific and measurable
✅ Build on skills from previous weeks

EXAMPLE TASKS:
- "Deliberate practice: Spend 30 min on [specific skill] with full focus" (Morning, 30 min)
- "Get feedback: Share your work with an expert and ask 3 specific questions" (Afternoon, 20 min)
- "Study mastery: Analyze how 3 experts in your field approach [skill]" (Morning, 25 min)

Return ONLY a JSON array (no markdown) with this structure:
[
  {
    "title": "Action-oriented task title",
    "description": "What exactly to practice and how to measure improvement",
    "recommendedSchedule": "Morning" or "Peak energy time" or specific day,
    "estimatedTime": "20 minutes" or "30 minutes" etc,
    "reasoning": "Why this practice builds mastery"
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
function getMethodsFallbackGoals(): MobileGoalSuggestion[] {
  return [
    {
      title: "Master one core skill through deliberate practice",
      description: "Choose your most valuable skill and practice it deliberately for 30 minutes daily this week. Focus on specific sub-skills, not general practice.",
      category: "learning",
      reasoning: "Deep skill development creates compounding returns in your career.",
      weekNumber: WEEK_NUMBER
    },
    {
      title: "Get expert feedback on your work",
      description: "Share a recent piece of work with someone you respect. Ask for specific, actionable feedback. Iterate based on their input.",
      category: "professional",
      reasoning: "Expert feedback accelerates your path to mastery.",
      weekNumber: WEEK_NUMBER
    },
    {
      title: "Study and implement best practices",
      description: "Research how 3 experts in your field approach a key skill. Identify one technique to experiment with this week.",
      category: "learning",
      reasoning: "Learning from masters shortcuts the path to excellence.",
      weekNumber: WEEK_NUMBER
    }
  ];
}
