/**
 * AI MVP Service - Purpose-driven AI generation
 * Replaces week-specific AI modules with simplified, always-on approach
 */

import { anthropicClient, openaiClient } from "./ai-mobile/shared";

// ================== TYPES ==================

export interface MobileGoalSuggestion {
  title: string;
  description: string;
  category: "personal" | "professional" | "learning" | "health";
  reasoning: string; // Why this goal aligns with purpose
}

export interface MobileTaskSuggestion {
  title: string;
  description: string;
  recommendedSchedule: string; // e.g., "Morning", "Tuesday afternoon"
  estimatedTime: string; // e.g., "30 minutes", "2 hours"
  reasoning: string;
}

export interface CheckInAnalysis {
  insights: string[]; // 2-3 key insights from reflection
  patterns: string[]; // Behavioral patterns noticed
  recommendations: string[]; // Actionable next steps
  networkNudges: string[]; // Suggestions about key people
}

// ================== CORE FUNCTIONS ==================

/**
 * Synthesize 3 user prompts into a concise purpose statement
 * Primary: Claude (better at empathy and synthesis)
 * Fallback: OpenAI
 * Last resort: Concatenate prompts
 */
export async function generatePurposeSummary(
  prompt1: string,
  prompt2: string,
  prompt3: string
): Promise<string> {
  const combinedPrompts = `
Prompt 1 (When work feels right): ${prompt1}
Prompt 2 (Decade vision): ${prompt2}
Prompt 3 (Unexplored career): ${prompt3}
  `.trim();

  // Try Claude first (better at synthesis)
  if (anthropicClient) {
    try {
      const summary = await callClaudeForPurposeSummary(combinedPrompts);
      if (summary) return summary;
    } catch (error) {
      console.error("Claude purpose summary failed:", error);
    }
  }

  // Fallback to OpenAI
  if (openaiClient) {
    try {
      const summary = await callOpenAIForPurposeSummary(combinedPrompts);
      if (summary) return summary;
    } catch (error) {
      console.error("OpenAI purpose summary failed:", error);
    }
  }

  // Last resort: Return a formatted concatenation
  return `My purpose centers on ${prompt1}. In ten years, ${prompt2}. I'm curious about ${prompt3}.`;
}

/**
 * Generate 2-3 goals aligned with user's purpose
 * No week context - purely purpose-driven
 */
export async function generateGoalsFromPurpose(
  purposeSummary: string,
  workstyleProfile?: { best: string; stuck: string },
  existingGoals?: Array<{ title: string }>
): Promise<MobileGoalSuggestion[]> {
  const context = {
    purpose: purposeSummary,
    workstyle: workstyleProfile || null,
    existingGoals: existingGoals || [],
  };

  // Try Claude first (better for purpose alignment)
  if (anthropicClient) {
    try {
      const goals = await callClaudeForGoals(context);
      if (goals && goals.length > 0) return goals;
    } catch (error) {
      console.error("Claude goal generation failed:", error);
    }
  }

  // Fallback to OpenAI
  if (openaiClient) {
    try {
      const goals = await callOpenAIForGoals(context);
      if (goals && goals.length > 0) return goals;
    } catch (error) {
      console.error("OpenAI goal generation failed:", error);
    }
  }

  // Generic fallback
  return getGenericGoalSuggestions(purposeSummary);
}

/**
 * Break down a goal into 3-5 concrete milestones
 * Primary: OpenAI (better at task decomposition)
 * Fallback: Claude
 */
export async function generateMilestonesFromGoal(
  goal: { title: string; description: string },
  purposeSummary: string,
  workstyleProfile?: { best: string; stuck: string }
): Promise<MobileTaskSuggestion[]> {
  const context = {
    goal,
    purpose: purposeSummary,
    workstyle: workstyleProfile || null,
  };

  // Try OpenAI first (better at decomposition)
  if (openaiClient) {
    try {
      const milestones = await callOpenAIForMilestones(context);
      if (milestones && milestones.length > 0) return milestones;
    } catch (error) {
      console.error("OpenAI milestone generation failed:", error);
    }
  }

  // Fallback to Claude
  if (anthropicClient) {
    try {
      const milestones = await callClaudeForMilestones(context);
      if (milestones && milestones.length > 0) return milestones;
    } catch (error) {
      console.error("Claude milestone generation failed:", error);
    }
  }

  // Generic fallback
  return getGenericMilestones(goal);
}

/**
 * Analyze weekly check-in and provide insights + network nudges
 * Primary: Claude (better at empathy and patterns)
 */
export async function analyzeCheckIn(
  checkIn: {
    wins?: string;
    lessons?: string;
    nextSteps?: string;
  },
  goals: Array<{ title: string; progress: number }>,
  milestones: Array<{ title: string; status: string }>,
  keyPeople: Array<{
    name: string;
    type: string;
    lastInteraction?: Date;
  }>
): Promise<CheckInAnalysis> {
  const context = {
    checkIn,
    goals,
    completedMilestones: milestones.filter((m) => m.status === "done"),
    keyPeople,
  };

  // Try Claude (preferred for reflection analysis)
  if (anthropicClient) {
    try {
      const analysis = await callClaudeForCheckInAnalysis(context);
      if (analysis) return analysis;
    } catch (error) {
      console.error("Claude check-in analysis failed:", error);
    }
  }

  // Fallback to OpenAI
  if (openaiClient) {
    try {
      const analysis = await callOpenAIForCheckInAnalysis(context);
      if (analysis) return analysis;
    } catch (error) {
      console.error("OpenAI check-in analysis failed:", error);
    }
  }

  // Generic fallback
  return getGenericCheckInAnalysis(checkIn, keyPeople);
}

// ================== AI HELPER FUNCTIONS ==================

async function callClaudeForPurposeSummary(prompts: string): Promise<string | null> {
  if (!anthropicClient) return null;

  try {
    const response = await anthropicClient.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 800,
      temperature: 0.7,
      messages: [{
        role: "user",
        content: `You are an executive coach helping someone clarify their professional purpose. Based on these three prompts, synthesize a concise 1-2 paragraph purpose statement that captures their authentic professional direction:

${prompts}

Write in first person, present tense. Make it inspiring but grounded. Focus on what matters to them, not generic career advice. Return ONLY the purpose statement, no preamble.`
      }]
    });

    const content = response.content[0];
    if (content.type === "text") {
      return content.text.trim();
    }
  } catch (error) {
    console.error("Claude purpose summary error:", error);
  }

  return null;
}

async function callOpenAIForPurposeSummary(prompts: string): Promise<string | null> {
  if (!openaiClient) return null;

  try {
    const response = await openaiClient.chat.completions.create({
      model: "gpt-4o",
      messages: [{
        role: "system",
        content: "You are an executive coach. Write a concise, inspiring 1-2 paragraph purpose statement based on the user's responses."
      }, {
        role: "user",
        content: `Synthesize these three prompts into a purpose statement:\n\n${prompts}\n\nWrite in first person, present tense. Make it authentic and specific to them.`
      }],
      temperature: 0.7,
      max_tokens: 400
    });

    const content = response.choices[0]?.message?.content;
    return content?.trim() || null;
  } catch (error) {
    console.error("OpenAI purpose summary error:", error);
  }

  return null;
}

async function callClaudeForGoals(context: any): Promise<MobileGoalSuggestion[] | null> {
  if (!anthropicClient) return null;

  const workstyleContext = context.workstyle
    ? `\n\nWorkstyle: They work best with ${context.workstyle.best}. They get stuck when ${context.workstyle.stuck}.`
    : "";

  const existingContext = context.existingGoals.length > 0
    ? `\n\nExisting goals: ${context.existingGoals.map((g: any) => g.title).join(", ")}`
    : "";

  try {
    const response = await anthropicClient.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 2000,
      temperature: 0.7,
      messages: [{
        role: "user",
        content: `You are a professional coach. Based on this person's purpose, suggest 2-3 concrete goals:

Purpose: ${context.purpose}${workstyleContext}${existingContext}

Generate 2-3 goals that:
- Align directly with their purpose
- Are specific and actionable
- Mix quick wins with longer-term objectives
- Avoid duplicating existing goals

Return a JSON array with this structure:
[{
  "title": "Goal title (specific, actionable)",
  "description": "What this goal involves (2-3 sentences)",
  "category": "professional" | "personal" | "learning" | "health",
  "reasoning": "Why this aligns with their purpose (1 sentence)"
}]

Return ONLY the JSON array, no markdown or explanation.`
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
  } catch (error) {
    console.error("Claude goals error:", error);
  }

  return null;
}

async function callOpenAIForGoals(context: any): Promise<MobileGoalSuggestion[] | null> {
  if (!openaiClient) return null;

  const workstyleContext = context.workstyle
    ? `Workstyle: They work best with ${context.workstyle.best}. They get stuck when ${context.workstyle.stuck}.`
    : "";

  const existingContext = context.existingGoals.length > 0
    ? `Existing goals: ${context.existingGoals.map((g: any) => g.title).join(", ")}`
    : "";

  try {
    const response = await openaiClient.chat.completions.create({
      model: "gpt-4o",
      messages: [{
        role: "system",
        content: "You are a professional coach. Generate 2-3 specific, actionable goals. Return ONLY valid JSON."
      }, {
        role: "user",
        content: `Purpose: ${context.purpose}\n\n${workstyleContext}\n${existingContext}\n\nGenerate 2-3 goals aligned with this purpose. Return JSON: {"goals": [{"title": "", "description": "", "category": "", "reasoning": ""}]}`
      }],
      temperature: 0.7,
      response_format: { type: "json_object" }
    });

    const content = response.choices[0]?.message?.content;
    if (content) {
      const parsed = JSON.parse(content);
      return parsed.goals || [];
    }
  } catch (error) {
    console.error("OpenAI goals error:", error);
  }

  return null;
}

async function callOpenAIForMilestones(context: any): Promise<MobileTaskSuggestion[] | null> {
  if (!openaiClient) return null;

  const workstyleContext = context.workstyle
    ? `Workstyle: ${context.workstyle.best} works best. Gets stuck with ${context.workstyle.stuck}.`
    : "";

  try {
    const response = await openaiClient.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{
        role: "system",
        content: "You are a task planning expert. Break goals into 3-5 concrete milestones. Return ONLY valid JSON."
      }, {
        role: "user",
        content: `Goal: ${context.goal.title}\nDescription: ${context.goal.description}\n\nPurpose context: ${context.purpose}\n${workstyleContext}\n\nBreak this into 3-5 milestones. Return JSON: {"tasks": [{"title": "", "description": "", "recommendedSchedule": "Morning/Afternoon/Evening", "estimatedTime": "X minutes/hours", "reasoning": ""}]}`
      }],
      temperature: 0.6,
      response_format: { type: "json_object" }
    });

    const content = response.choices[0]?.message?.content;
    if (content) {
      const parsed = JSON.parse(content);
      return parsed.tasks || [];
    }
  } catch (error) {
    console.error("OpenAI milestones error:", error);
  }

  return null;
}

async function callClaudeForMilestones(context: any): Promise<MobileTaskSuggestion[] | null> {
  if (!anthropicClient) return null;

  const workstyleContext = context.workstyle
    ? `Workstyle: ${context.workstyle.best} works best. Gets stuck with ${context.workstyle.stuck}.`
    : "";

  try {
    const response = await anthropicClient.messages.create({
      model: "claude-3-5-haiku-20241022",
      max_tokens: 1500,
      temperature: 0.6,
      messages: [{
        role: "user",
        content: `Break this goal into 3-5 concrete milestones:

Goal: ${context.goal.title}
Description: ${context.goal.description}

Purpose context: ${context.purpose}
${workstyleContext}

Return a JSON array:
[{
  "title": "Milestone title",
  "description": "What to do (1-2 sentences)",
  "recommendedSchedule": "Morning/Afternoon/Evening",
  "estimatedTime": "X minutes/hours",
  "reasoning": "Why this timing/approach works"
}]

Return ONLY the JSON array.`
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
  } catch (error) {
    console.error("Claude milestones error:", error);
  }

  return null;
}

async function callClaudeForCheckInAnalysis(context: any): Promise<CheckInAnalysis | null> {
  if (!anthropicClient) return null;

  // Build network nudges context
  const networkContext = context.keyPeople.map((person: any) => {
    const daysSince = person.lastInteraction
      ? Math.floor((Date.now() - new Date(person.lastInteraction).getTime()) / (1000 * 60 * 60 * 24))
      : null;
    return `${person.name} (${person.type})${daysSince ? ` - last contact ${daysSince} days ago` : " - no recent contact"}`;
  }).join("\n");

  try {
    const response = await anthropicClient.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1500,
      temperature: 0.7,
      messages: [{
        role: "user",
        content: `You are an empathetic professional coach. Analyze this weekly check-in:

Wins: ${context.checkIn.wins || "Not provided"}
Lessons: ${context.checkIn.lessons || "Not provided"}
Next Steps: ${context.checkIn.nextSteps || "Not provided"}

Active goals: ${context.goals.map((g: any) => `${g.title} (${g.progress}%)`).join(", ")}
Completed milestones: ${context.completedMilestones.map((m: any) => m.title).join(", ") || "None"}

Key people in their network:
${networkContext}

Provide:
1. 2-3 insights about their progress and patterns
2. 1-2 behavioral patterns you notice
3. 2-3 actionable recommendations
4. 1-2 network nudges (suggest connecting with someone, especially if >14 days since contact)

Return JSON:
{
  "insights": ["insight 1", "insight 2"],
  "patterns": ["pattern 1"],
  "recommendations": ["recommendation 1", "recommendation 2"],
  "networkNudges": ["Consider reaching out to..."]
}

Return ONLY the JSON.`
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
  } catch (error) {
    console.error("Claude check-in analysis error:", error);
  }

  return null;
}

async function callOpenAIForCheckInAnalysis(context: any): Promise<CheckInAnalysis | null> {
  if (!openaiClient) return null;

  const networkContext = context.keyPeople.map((person: any) => {
    const daysSince = person.lastInteraction
      ? Math.floor((Date.now() - new Date(person.lastInteraction).getTime()) / (1000 * 60 * 60 * 24))
      : null;
    return `${person.name} (${person.type})${daysSince ? ` - ${daysSince}d ago` : " - no contact"}`;
  }).join(", ");

  try {
    const response = await openaiClient.chat.completions.create({
      model: "gpt-4o",
      messages: [{
        role: "system",
        content: "You are an empathetic professional coach. Analyze check-ins and provide insights. Return ONLY valid JSON."
      }, {
        role: "user",
        content: `Check-in: Wins: ${context.checkIn.wins}, Lessons: ${context.checkIn.lessons}, Next: ${context.checkIn.nextSteps}\n\nGoals: ${context.goals.map((g: any) => g.title).join(", ")}\nNetwork: ${networkContext}\n\nReturn JSON: {"insights": [], "patterns": [], "recommendations": [], "networkNudges": []}`
      }],
      temperature: 0.7,
      response_format: { type: "json_object" }
    });

    const content = response.choices[0]?.message?.content;
    if (content) {
      return JSON.parse(content);
    }
  } catch (error) {
    console.error("OpenAI check-in analysis error:", error);
  }

  return null;
}

// ================== FALLBACK FUNCTIONS ==================

function getGenericGoalSuggestions(purpose: string): MobileGoalSuggestion[] {
  return [
    {
      title: "Build foundational skills",
      description: "Identify and develop 2-3 core skills that align with your purpose.",
      category: "learning",
      reasoning: "Strong foundations enable meaningful progress"
    },
    {
      title: "Take a concrete first step",
      description: "Choose one small, actionable step toward your purpose and complete it this week.",
      category: "professional",
      reasoning: "Momentum starts with action"
    }
  ];
}

function getGenericMilestones(goal: { title: string; description: string }): MobileTaskSuggestion[] {
  return [
    {
      title: `Research approaches for ${goal.title}`,
      description: "Spend 30 minutes researching best practices and examples.",
      recommendedSchedule: "Morning",
      estimatedTime: "30 minutes",
      reasoning: "Morning focus is best for learning"
    },
    {
      title: `Create action plan for ${goal.title}`,
      description: "Map out 3-5 specific steps you'll take.",
      recommendedSchedule: "Afternoon",
      estimatedTime: "20 minutes",
      reasoning: "Planning works well in afternoon energy"
    },
    {
      title: `Complete first action toward ${goal.title}`,
      description: "Execute the first step from your plan.",
      recommendedSchedule: "Morning",
      estimatedTime: "1 hour",
      reasoning: "Do meaningful work when energy is highest"
    }
  ];
}

function getGenericCheckInAnalysis(
  checkIn: { wins?: string; lessons?: string; nextSteps?: string },
  keyPeople: Array<{ name: string; type: string; lastInteraction?: Date }>
): CheckInAnalysis {
  const insights: string[] = [];
  const networkNudges: string[] = [];

  if (checkIn.wins) {
    insights.push("You're making tangible progress. Keep celebrating these wins.");
  }
  if (checkIn.lessons) {
    insights.push("Reflecting on lessons shows growth mindset and self-awareness.");
  }

  // Check for stale connections (>14 days)
  keyPeople.forEach(person => {
    if (person.lastInteraction) {
      const daysSince = Math.floor((Date.now() - new Date(person.lastInteraction).getTime()) / (1000 * 60 * 60 * 24));
      if (daysSince > 14) {
        networkNudges.push(`Consider reaching out to ${person.name} (your ${person.type}) - it's been ${daysSince} days.`);
      }
    } else {
      networkNudges.push(`Log your next interaction with ${person.name} (your ${person.type}) to track the relationship.`);
    }
  });

  return {
    insights: insights.length > 0 ? insights : ["You're on the right track. Keep moving forward."],
    patterns: ["Consistency compounds. Small steps add up to significant progress."],
    recommendations: [
      checkIn.nextSteps ? "Follow through on your next steps." : "Define 1-2 clear next steps.",
      "Continue reflecting weekly to build momentum."
    ],
    networkNudges: networkNudges.length > 0 ? networkNudges : ["Your network is a valuable asset. Stay connected."]
  };
}
