/**
 * Week tracking utilities for progress monitoring
 */

/**
 * Calculate which week number the user is on since joining
 * @param joinedDate - ISO date string of when user joined
 * @returns Current week number (1-indexed)
 */
export function getCurrentWeekNumber(joinedDate: string): number {
  const joined = new Date(joinedDate);
  const now = new Date();
  
  // Calculate milliseconds difference
  const diffMs = now.getTime() - joined.getTime();
  
  // Convert to weeks (round up to current week)
  const diffWeeks = Math.ceil(diffMs / (1000 * 60 * 60 * 24 * 7));
  
  // Ensure at least week 1
  return Math.max(1, diffWeeks);
}

/**
 * Get progress messaging based on week number
 * @param weekNumber - Current week number
 * @returns Motivational message for the user's progress
 */
export function getWeekProgressMessage(weekNumber: number): string {
  if (weekNumber === 1) {
    return "Welcome to your first week! Focus on building momentum.";
  } else if (weekNumber === 2) {
    return "Week 2: Establishing your rhythm. Great progress!";
  } else if (weekNumber === 3) {
    return "Week 3: Habits are forming. Keep the consistency going.";
  } else if (weekNumber === 4) {
    return "One month strong! You're building something lasting.";
  } else if (weekNumber <= 8) {
    return `Week ${weekNumber}: You're in the growth zone. Stay focused on your vision.`;
  } else if (weekNumber <= 12) {
    return `Week ${weekNumber}: Quarter-way milestone approaching. Reflect on your progress.`;
  } else if (weekNumber === 13) {
    return "Quarter complete! Time to review and refocus your direction.";
  } else if (weekNumber === 26) {
    return "Half-year milestone! Celebrate how far you've come.";
  } else if (weekNumber < 26) {
    return `Week ${weekNumber}: Mid-journey. Trust the process.`;
  } else if (weekNumber <= 52) {
    return `Week ${weekNumber}: You're building lasting transformation.`;
  } else {
    const years = Math.floor(weekNumber / 52);
    const remainingWeeks = weekNumber % 52;
    return `${years}+ year${years > 1 ? 's' : ''} of growth. Week ${remainingWeeks} of this year's journey.`;
  }
}

/**
 * Calculate days until next personal week starts (based on join date)
 * @param joinedDate - ISO date string of when user joined
 * @returns Number of days remaining in current personal week (1-7)
 */
export function getDaysUntilNextWeek(joinedDate: string): number {
  const joined = new Date(joinedDate);
  const now = new Date();
  
  // Calculate elapsed days since joining
  const diffMs = now.getTime() - joined.getTime();
  const elapsedDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  // Calculate days remaining in current week (1-7)
  // When elapsedDays % 7 === 0, it's the start of a new week, so 7 days remain
  const daysInCurrentWeek = elapsedDays % 7;
  const daysUntilNextWeek = daysInCurrentWeek === 0 ? 7 : 7 - daysInCurrentWeek;
  
  return daysUntilNextWeek;
}
