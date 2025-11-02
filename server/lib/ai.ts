import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";

// Initialize AI clients (only if API keys are provided)
const anthropicClient = process.env.ANTHROPIC_API_KEY 
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null;

const openaiClient = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

export interface GoalSuggestion {
  title: string;
  description: string;
  category: "personal" | "professional" | "health" | "learning";
  reasoning: string;
}

/**
 * Generate personalized goal suggestions based on user's vision, energy patterns, and direction
 */
export async function generateGoalSuggestions(
  vision: string,
  energy: string,
  direction: string,
  existingGoals?: Array<{ title: string; description: string }>
): Promise<GoalSuggestion[]> {
  const prompt = `You are a professional life coach helping someone achieve their goals.

User's Vision: ${vision}
Energy Patterns: ${energy}
Current Direction: ${direction}
${existingGoals && existingGoals.length > 0 ? `\nExisting Goals:\n${existingGoals.map(g => `- ${g.title}: ${g.description}`).join('\n')}` : ''}

Based on this information, suggest 3-5 specific, actionable goals that would help this person move toward their vision. Each goal should:
- Be specific and measurable
- Align with their energy patterns and working style
- Support their stated direction
- Be achievable within 1-3 months
- Not duplicate existing goals

Return your response as a JSON array with this structure:
[
  {
    "title": "Goal title (concise, actionable)",
    "description": "Detailed description (2-3 sentences)",
    "category": "personal|professional|health|learning",
    "reasoning": "Why this goal aligns with their vision and energy (1 sentence)"
  }
]`;

  try {
    // Try Anthropic first (Claude is better at coaching/personal advice)
    if (anthropicClient) {
      const response = await anthropicClient.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 2000,
        messages: [{
          role: "user",
          content: prompt
        }]
      });

      const content = response.content[0];
      if (content.type === "text") {
        // Extract JSON from response (handle markdown code blocks)
        const text = content.text;
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
      }
    }

    // Fallback to OpenAI
    if (openaiClient) {
      const response = await openaiClient.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{
          role: "user",
          content: prompt
        }],
        response_format: { type: "json_object" },
        temperature: 0.7,
      });

      const content = response.choices[0]?.message?.content;
      if (content) {
        const parsed = JSON.parse(content);
        return parsed.goals || parsed;
      }
    }

    // If no API keys are configured, return fallback suggestions
    return getFallbackSuggestions(vision, direction);
  } catch (error) {
    console.error("Error generating goal suggestions:", error);
    return getFallbackSuggestions(vision, direction);
  }
}

/**
 * Fallback goal suggestions when AI is not available
 */
function getFallbackSuggestions(vision: string, direction: string): GoalSuggestion[] {
  const suggestions: GoalSuggestion[] = [
    {
      title: "Define Your 90-Day Milestone",
      description: "Break down your vision into a specific, measurable goal you can achieve in the next 90 days. This creates momentum and clarity.",
      category: "personal",
      reasoning: "Short-term milestones help turn your vision into actionable steps."
    },
    {
      title: "Build a Daily Practice",
      description: "Establish one consistent daily habit that aligns with your direction. Start small—even 15 minutes can create significant progress over time.",
      category: "personal",
      reasoning: "Daily consistency compounds into major achievements over time."
    },
    {
      title: "Connect with a Mentor",
      description: "Identify and reach out to someone who has achieved what you're working toward. Schedule a conversation to learn from their experience.",
      category: "professional",
      reasoning: "Mentors accelerate growth by sharing proven paths and avoiding common pitfalls."
    }
  ];

  // Add direction-specific suggestion
  if (direction.toLowerCase().includes("skill") || direction.toLowerCase().includes("learn")) {
    suggestions.push({
      title: "Master One Core Skill",
      description: "Choose the single most valuable skill for your direction and commit to deliberate practice for 30 days. Track your progress daily.",
      category: "learning",
      reasoning: "Focused skill development creates compounding returns in your career."
    });
  }

  return suggestions.slice(0, 3);
}

/**
 * Generate reflection prompts for weekly reviews
 */
export async function generateReflectionPrompt(
  recentActivity: string
): Promise<string> {
  const fallbackPrompts = [
    "What gave you the most energy this week, and how can you create more of that?",
    "What pattern did you notice in your most productive moments?",
    "If you could redo one decision from this week, what would you change and why?",
    "What small win from this week could become a bigger opportunity?",
    "What conversation or insight shifted your perspective this week?"
  ];

  try {
    if (anthropicClient) {
      const response = await anthropicClient.messages.create({
        model: "claude-3-5-haiku-20241022",
        max_tokens: 200,
        messages: [{
          role: "user",
          content: `Generate one thoughtful reflection question for a weekly review. Recent context: ${recentActivity}. Make it specific, actionable, and focused on growth.`
        }]
      });

      const content = response.content[0];
      if (content.type === "text") {
        return content.text.trim().replace(/^["']|["']$/g, '');
      }
    }
  } catch (error) {
    console.error("Error generating reflection prompt:", error);
  }

  return fallbackPrompts[Math.floor(Math.random() * fallbackPrompts.length)];
}
