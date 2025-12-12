/**
 * AI MVP Service - Purpose-driven AI generation
 * Using OpenAI GPT-5 family models exclusively
 */

import { openaiClient } from "./ai-mobile/shared";

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
 * Uses GPT-5.2 for empathetic synthesis
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

  if (openaiClient) {
    try {
      const summary = await callOpenAIForPurposeSummary(combinedPrompts);
      if (summary) return summary;
    } catch (error) {
      console.error("OpenAI purpose summary failed:", error);
    }
  }

  // Fallback: Return a formatted concatenation
  return `My purpose centers on ${prompt1}. In ten years, ${prompt2}. I'm curious about ${prompt3}.`;
}

/**
 * Generate 2-3 goals aligned with user's purpose
 * Uses GPT-5.2 for purpose-driven goal generation
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
 * Uses GPT-5 Mini for cost-effective task decomposition
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

  if (openaiClient) {
    try {
      const milestones = await callOpenAIForMilestones(context);
      if (milestones && milestones.length > 0) return milestones;
    } catch (error) {
      console.error("OpenAI milestone generation failed:", error);
    }
  }

  // Generic fallback
  return getGenericMilestones(goal);
}

/**
 * Analyze weekly check-in and provide insights + network nudges
 * Uses GPT-5.2 for empathetic reflection analysis
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

async function callOpenAIForPurposeSummary(prompts: string): Promise<string | null> {
  if (!openaiClient) return null;

  try {
    const response = await openaiClient.chat.completions.create({
      model: "gpt-5.2",
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
      model: "gpt-5.2",
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
      model: "gpt-5-mini",
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
      model: "gpt-5.2",
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
