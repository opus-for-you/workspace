/**
 * WEEK 3: NETWORK 🤝
 * Focus: Strengthening connections and building relationships
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

const WEEK_NUMBER = 3;

/**
 * Generate Network-focused goals from North Star
 * Custom prompt optimized for Week 3: building authentic relationships
 */
export async function generateNetworkGoals(
  northStar: string,
  existingGoals?: Array<{ title: string; description: string }>
): Promise<MobileGoalSuggestion[]> {
  const prompt = `You are an expert executive coach specializing in helping professionals build authentic, valuable relationships.

CONTEXT:
The user is in Week 3 of a 5-week transformation program called "Opus."
Week 3 Theme: NETWORK 🤝
Focus: Strengthening connections and building relationships

User's North Star (ultimate professional vision):
"${northStar}"

${existingGoals && existingGoals.length > 0 ? `\nEXISTING GOALS (avoid duplicates):\n${existingGoals.map(g => `- ${g.title}: ${g.description}`).join('\n')}\n` : ''}

YOUR TASK:
Generate 3-4 specific, actionable goals for Week 3 that help this person:

1. **Identify key relationships to nurture** - who energizes and challenges them?
2. **Find mentors or advisors** aligned with their north star
3. **Build a community of support** - not just professional contacts, but genuine connections
4. **Give value to others** - relationships are about contribution, not just extraction

PRINCIPLES FOR NETWORK GOALS:
✅ Quality of connections over quantity
✅ Emphasize authentic relationship-building, not transactional networking
✅ Focus on mutual value and support
✅ Should build on Week 1's purpose and Week 2's rhythm
✅ Achievable within 1 week
✅ Create genuine human connection

KEY INSIGHT: Your network isn't about collecting business cards—it's about building genuine relationships with people who energize and challenge you.

AVOID:
❌ Transactional networking ("connect with 50 people on LinkedIn")
❌ Generic "attend networking events"
❌ Goals focused only on what they can GET from people
❌ Superficial connection tactics

Return ONLY a JSON array (no markdown, no explanation) with this exact structure:
[
  {
    "title": "Concise goal title (5-8 words)",
    "description": "2-3 sentences explaining the relationship goal and why authentic connection matters",
    "category": "professional",
    "reasoning": "1 sentence connecting these relationships to their north star: ${northStar}",
    "weekNumber": 3
  }
]`;

  // Try Claude first (better at coaching/empathy)
  let goals = await callClaudeForGoals(prompt);
  if (goals) return goals;

  // Fallback to OpenAI
  goals = await callOpenAIForGoals(prompt);
  if (goals) return goals;

  // Final fallback: hand-crafted Network goals
  return getNetworkFallbackGoals();
}

/**
 * Generate Network-focused tasks from a goal
 * Custom prompt optimized for Week 3: relationship-building, connection tasks
 */
export async function generateNetworkTasks(
  goal: { title: string; description: string },
  northStar: string
): Promise<MobileTaskSuggestion[]> {
  const prompt = `You are a professional coach helping someone build genuine, valuable relationships.

CONTEXT:
Week 3 Theme: NETWORK - Strengthening connections and building relationships
North Star: "${northStar}"

GOAL TO BREAK DOWN:
Title: ${goal.title}
Description: ${goal.description}

YOUR TASK:
Generate 3-5 specific tasks that facilitate genuine connection through:
- **Reaching out** to specific people for coffee/calls
- **Asking thoughtful questions** and listening deeply
- **Sharing valuable resources** with their network
- **Joining communities** aligned with their values
- **Following up** with meaningful conversation

PRINCIPLES FOR NETWORK TASKS:
✅ Schedule connection tasks in AFTERNOON (better energy for social interaction)
✅ One meaningful conversation > multiple superficial ones
✅ Focus on giving value, not just taking
✅ Be specific about WHO to reach out to
✅ Include conversation prompts or questions to ask

EXAMPLE TASKS:
- "Coffee chat: Reach out to [mentor name] to learn about their career pivot" (Tuesday afternoon, 30 min)
- "Share value: Send 3 articles/resources to people in your network" (Afternoon, 15 min)
- "Deep conversation: Ask a colleague about what makes their work meaningful" (Lunch, 20 min)

Return ONLY a JSON array (no markdown) with this structure:
[
  {
    "title": "Action-oriented task title",
    "description": "What exactly to do, who to reach out to, and what to discuss",
    "recommendedSchedule": "Afternoon" or "Tuesday afternoon" or "Lunch",
    "estimatedTime": "20 minutes" or "30 minutes" etc,
    "reasoning": "Why this task builds authentic connection"
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
function getNetworkFallbackGoals(): MobileGoalSuggestion[] {
  return [
    {
      title: "Connect with a mentor or advisor",
      description: "Reach out to someone you admire and schedule a 30-minute conversation to learn from their experience. Come prepared with thoughtful questions.",
      category: "professional",
      reasoning: "Strong relationships accelerate your growth and open new possibilities.",
      weekNumber: WEEK_NUMBER
    },
    {
      title: "Audit your network for energy alignment",
      description: "Review your recent conversations. Who energizes you? Who drains you? Who challenges you to grow? Design your network intentionally.",
      category: "professional",
      reasoning: "Surrounding yourself with the right people shapes your trajectory toward your north star.",
      weekNumber: WEEK_NUMBER
    },
    {
      title: "Give value to 5 people in your network",
      description: "Identify 5 people and share something valuable with each: an introduction, a resource, feedback, or genuine appreciation.",
      category: "professional",
      reasoning: "Building relationships is about contribution. Give value to create authentic connection.",
      weekNumber: WEEK_NUMBER
    }
  ];
}
