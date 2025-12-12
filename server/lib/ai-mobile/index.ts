/**
 * AI Mobile - Purpose-driven AI workflows (MVP)
 *
 * This module re-exports the simplified AI service that focuses on
 * purpose-driven generation instead of week-based progression.
 */

export {
  generatePurposeSummary,
  generateGoalsFromPurpose,
  generateMilestonesFromGoal,
  analyzeCheckIn,
  type MobileGoalSuggestion,
  type MobileTaskSuggestion,
  type CheckInAnalysis,
} from "../ai-mvp";
