/**
 * Opus Framework - 5-Week Transformation Program
 *
 * Defines the structure, themes, and prompts for each week
 * of the guided coaching program.
 */

export interface WeekTheme {
  week: number;
  title: string;
  emoji: string;
  focus: string;
  description: string;
  goalPromptGuidance: string;
  taskPromptGuidance: string;
  reflectionPrompts: string[];
}

export const OPUS_FRAMEWORK: Record<number, WeekTheme> = {
  1: {
    week: 1,
    title: 'Purpose',
    emoji: '🎯',
    focus: 'Clarifying vision and identifying meaningful work',
    description: 'This week is about getting crystal clear on what meaningful work looks like for you. We\'re not chasing titles or external validation—we\'re defining what truly matters.',
    goalPromptGuidance: `
      Focus on values-based goals that align with the user's north star.
      Goals should help them:
      - Clarify what meaningful work means to them personally
      - Identify their core professional values
      - Define success on their own terms
      - Build self-awareness about what energizes them

      Avoid generic career goals. Be specific and introspective.
    `,
    taskPromptGuidance: `
      Tasks should be reflective and exploratory:
      - Journaling exercises about values and meaning
      - Conversations with mentors or role models
      - Auditing current work for alignment with values
      - Reading/research about purpose-driven work

      Schedule reflective tasks in the morning when mind is fresh.
      Keep tasks small and achievable (15-30 minutes).
    `,
    reflectionPrompts: [
      'What moments this week made you feel most alive professionally?',
      'When did you feel like you were doing work that truly mattered?',
      'What did you learn about what "meaningful work" means to you?',
      'What surprised you about your professional values this week?',
    ],
  },

  2: {
    week: 2,
    title: 'Rhythm',
    emoji: '⚡',
    focus: 'Building daily habits and consistent practices',
    description: 'Purpose without rhythm is just a dream. This week is about building the daily practices that turn your vision into reality.',
    goalPromptGuidance: `
      Focus on habit-formation and consistency goals:
      - Establish daily rituals that support their north star
      - Create sustainable routines (not just productivity hacks)
      - Build energy management practices
      - Design their ideal work rhythm

      Goals should be process-oriented, not outcome-oriented.
      Emphasize "systems" over "goals."
    `,
    taskPromptGuidance: `
      Tasks should build consistent habits:
      - Morning/evening routines
      - Daily practice of core skills
      - Time-blocking exercises
      - Energy tracking and optimization

      Recommend tasks at same time each day to build habit loops.
      Start with "tiny habits" - 5-10 minute commitments.
    `,
    reflectionPrompts: [
      'What daily practice gave you the most energy this week?',
      'Which habits stuck, and which didn\'t? Why?',
      'When were you most productive, and what conditions made that possible?',
      'What rhythm would you design for your ideal workday?',
    ],
  },

  3: {
    week: 3,
    title: 'Network',
    emoji: '🤝',
    focus: 'Strengthening connections and building relationships',
    description: 'Your network isn\'t about collecting business cards—it\'s about building genuine relationships with people who energize and challenge you.',
    goalPromptGuidance: `
      Focus on relationship-building goals:
      - Identify key relationships to nurture
      - Find mentors or advisors aligned with their north star
      - Build a community of support
      - Give value to others (not just take)

      Goals should be about quality of connections, not quantity.
      Emphasize authentic relationship-building.
    `,
    taskPromptGuidance: `
      Tasks should facilitate genuine connection:
      - Reach out to specific people for coffee/calls
      - Ask thoughtful questions and listen
      - Share valuable resources with their network
      - Join communities aligned with their values

      Schedule connection tasks in afternoon (better energy for social).
      One meaningful conversation > multiple superficial ones.
    `,
    reflectionPrompts: [
      'Who energized you this week? What made that conversation valuable?',
      'What did you learn from someone in your network?',
      'How did you add value to others this week?',
      'What patterns do you notice in your most valuable relationships?',
    ],
  },

  4: {
    week: 4,
    title: 'Structure',
    emoji: '🏗️',
    focus: 'Designing systems and frameworks',
    description: 'Motivation fades. Systems endure. This week is about building the frameworks that make success inevitable.',
    goalPromptGuidance: `
      Focus on system-building goals:
      - Create frameworks for decision-making
      - Build systems for key workflows
      - Design accountability structures
      - Establish boundaries and guardrails

      Goals should create sustainable infrastructure.
      Think: "What would make this automatic?"
    `,
    taskPromptGuidance: `
      Tasks should build repeatable systems:
      - Document workflows and processes
      - Create templates for recurring work
      - Set up automation where possible
      - Design decision-making frameworks

      Schedule system-building in morning (requires focused thinking).
      One good system can save hours each week.
    `,
    reflectionPrompts: [
      'What process did you struggle with this week that needs a system?',
      'Where did you waste time on decisions that could be automated?',
      'What system, if you built it, would save you 5+ hours per week?',
      'How can you make your best behaviors the default?',
    ],
  },

  5: {
    week: 5,
    title: 'Methods',
    emoji: '🔧',
    focus: 'Refining techniques and optimizing approach',
    description: 'You have the foundation. Now it\'s time to level up your craft. This week is about deliberate skill development and optimization.',
    goalPromptGuidance: `
      Focus on skill refinement goals:
      - Master one core skill deeply
      - Optimize existing processes
      - Learn advanced techniques
      - Get feedback and iterate

      Goals should be about mastery, not breadth.
      Focus on compounding skills that multiply impact.
    `,
    taskPromptGuidance: `
      Tasks should develop specific skills:
      - Deliberate practice of core competencies
      - Seek expert feedback
      - Study best practices in their field
      - Experiment and measure results

      Schedule skill practice in peak energy hours.
      30 minutes of focused practice > 2 hours of casual work.
    `,
    reflectionPrompts: [
      'What skill did you improve this week, and how did you know?',
      'What technique did you learn that you\'ll keep using?',
      'Where did you see the biggest return on your practice time?',
      'How have you evolved since Week 1?',
    ],
  },
};

/**
 * Get the theme for a specific week
 */
export function getWeekTheme(week: number): WeekTheme | null {
  return OPUS_FRAMEWORK[week] || null;
}

/**
 * Get all weeks in order
 */
export function getAllWeeks(): WeekTheme[] {
  return [1, 2, 3, 4, 5].map(week => OPUS_FRAMEWORK[week]);
}

/**
 * Calculate current week based on program start date
 */
export function calculateCurrentWeek(startDate: Date): number {
  const now = new Date();
  const diffTime = now.getTime() - startDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const weekNumber = Math.floor(diffDays / 7) + 1;

  // Cap at week 5
  return Math.min(weekNumber, 5);
}

/**
 * Check if it's time for end-of-week reflection
 * (Within last 2 days of the week)
 */
export function isReflectionTime(startDate: Date): boolean {
  const currentWeek = calculateCurrentWeek(startDate);
  const now = new Date();
  const diffTime = now.getTime() - startDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const dayInWeek = diffDays % 7;

  // Days 5 and 6 of each week (Friday/Saturday if starting Monday)
  return dayInWeek >= 5 && currentWeek <= 5;
}
