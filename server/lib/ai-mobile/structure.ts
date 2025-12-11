/**
 * WEEK 4: STRUCTURE 🏗️
 * Focus: Designing systems and frameworks
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

const WEEK_NUMBER = 4;

/**
 * Generate Structure-focused goals from North Star
 * Custom prompt optimized for Week 4: building systems and frameworks
 */
export async function generateStructureGoals(
  northStar: string,
  existingGoals?: Array<{ title: string; description: string }>
): Promise<MobileGoalSuggestion[]> {
  const prompt = `You are an expert executive coach specializing in helping professionals design systems and frameworks for sustainable success.

CONTEXT:
The user is in Week 4 of a 5-week transformation program called "Opus."
Week 4 Theme: STRUCTURE 🏗️
Focus: Designing systems and frameworks

User's North Star (ultimate professional vision):
"${northStar}"

${existingGoals && existingGoals.length > 0 ? `\nEXISTING GOALS (avoid duplicates):\n${existingGoals.map(g => `- ${g.title}: ${g.description}`).join('\n')}\n` : ''}

YOUR TASK:
Generate 3-4 specific, actionable goals for Week 4 that help this person:

1. **Create frameworks for decision-making** - what's their criteria for saying yes or no?
2. **Build systems for key workflows** - automate or systematize recurring work
3. **Design accountability structures** - how do they ensure follow-through?
4. **Establish boundaries and guardrails** - what protects their time and energy?

PRINCIPLES FOR STRUCTURE GOALS:
✅ Create sustainable infrastructure, not just tactics
✅ Think: "What would make this automatic?"
✅ Focus on systems that endure beyond motivation
✅ Should build on Weeks 1-3 (purpose, rhythm, network)
✅ Achievable within 1 week
✅ Create leverage through systematization

KEY INSIGHT: Motivation fades. Systems endure. This week is about building the frameworks that make success inevitable.

AVOID:
❌ One-time tasks without systematic thinking
❌ Vague goals like "be more organized"
❌ Systems that require constant willpower to maintain
❌ Goals not focused on creating reusable frameworks

Return ONLY a JSON array (no markdown, no explanation) with this exact structure:
[
  {
    "title": "Concise goal title (5-8 words)",
    "description": "2-3 sentences explaining the system/framework and why structure creates freedom",
    "category": "professional",
    "reasoning": "1 sentence connecting this system to their north star: ${northStar}",
    "weekNumber": 4
  }
]`;

  // Try Claude first (better at coaching/systems thinking)
  let goals = await callClaudeForGoals(prompt);
  if (goals) return goals;

  // Fallback to OpenAI
  goals = await callOpenAIForGoals(prompt);
  if (goals) return goals;

  // Final fallback: hand-crafted Structure goals
  return getStructureFallbackGoals();
}

/**
 * Generate Structure-focused tasks from a goal
 * Custom prompt optimized for Week 4: system-building, framework-creation tasks
 */
export async function generateStructureTasks(
  goal: { title: string; description: string },
  northStar: string
): Promise<MobileTaskSuggestion[]> {
  const prompt = `You are a professional coach helping someone design systems and frameworks for sustainable success.

CONTEXT:
Week 4 Theme: STRUCTURE - Designing systems and frameworks
North Star: "${northStar}"

GOAL TO BREAK DOWN:
Title: ${goal.title}
Description: ${goal.description}

YOUR TASK:
Generate 3-5 specific tasks that help them build repeatable systems through:
- **Documenting workflows and processes** - write it down
- **Creating templates** for recurring work
- **Setting up automation** where possible
- **Designing decision-making frameworks** - clear criteria
- **Building in accountability** - how to ensure follow-through

PRINCIPLES FOR STRUCTURE TASKS:
✅ Schedule system-building in MORNING (requires focused thinking)
✅ One good system can save hours each week
✅ Focus on creating reusable frameworks
✅ Document the system so it's repeatable
✅ Test and iterate on the structure

EXAMPLE TASKS:
- "Document your weekly review process - turn it into a template" (Morning, 30 min)
- "Create decision criteria: When do you say yes vs. no to opportunities?" (Morning, 25 min)
- "Build email templates for 5 common responses you send" (Afternoon, 20 min)

Return ONLY a JSON array (no markdown) with this structure:
[
  {
    "title": "Action-oriented task title",
    "description": "What exactly to document/create and what the system should accomplish",
    "recommendedSchedule": "Morning" or "Afternoon" or specific day,
    "estimatedTime": "20 minutes" or "30 minutes" etc,
    "reasoning": "Why this system creates leverage"
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
function getStructureFallbackGoals(): MobileGoalSuggestion[] {
  return [
    {
      title: "Document your decision-making framework",
      description: "Create a simple framework for how you make key professional decisions. Write down your criteria for saying yes or no to opportunities.",
      category: "professional",
      reasoning: "Systems reduce decision fatigue and improve consistency.",
      weekNumber: WEEK_NUMBER
    },
    {
      title: "Build a weekly review system",
      description: "Design a repeatable process for weekly planning and reflection. Create a template you can use every week.",
      category: "professional",
      reasoning: "Regular review systems ensure you stay aligned with your north star.",
      weekNumber: WEEK_NUMBER
    },
    {
      title: "Create templates for recurring work",
      description: "Identify 3-5 types of work you do repeatedly. Build templates, checklists, or frameworks to streamline them.",
      category: "professional",
      reasoning: "Systematizing routine work frees mental energy for high-impact work.",
      weekNumber: WEEK_NUMBER
    }
  ];
}
