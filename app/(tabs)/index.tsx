import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/lib/auth-store';
import { programAPI, tasksAPI, goalsAPI } from '@/lib/api';

const WEEK_THEMES = [
  { week: 0, title: 'Getting Started', emoji: '🚀' },
  { week: 1, title: 'Purpose', emoji: '🎯' },
  { week: 2, title: 'Rhythm', emoji: '⚡' },
  { week: 3, title: 'Network', emoji: '🤝' },
  { week: 4, title: 'Structure', emoji: '🏗️' },
  { week: 5, title: 'Methods', emoji: '🔧' },
];

export default function DashboardScreen() {
  const { user } = useAuthStore();

  const { data: programData, isLoading: programLoading } = useQuery({
    queryKey: ['program', 'current-week'],
    queryFn: programAPI.getCurrentWeek,
  });

  const { data: tasks = [], isLoading: tasksLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: tasksAPI.getTasks,
  });

  const { data: goals = [], isLoading: goalsLoading } = useQuery({
    queryKey: ['goals'],
    queryFn: goalsAPI.getGoals,
  });

  const currentWeek = user?.programWeek || 0;
  const weekTheme = WEEK_THEMES[currentWeek] || WEEK_THEMES[0];
  const todayTasks = tasks.filter((t: any) => t.status === 'todo').slice(0, 5);
  const activeGoals = goals.filter((g: any) => g.progress < 100);

  const isLoading = programLoading || tasksLoading || goalsLoading;

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#5A7F6A" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Welcome back{user?.username ? `, ${user.username}` : ''}!</Text>
        <Text style={styles.date}>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</Text>
      </View>

      {/* Week Progress */}
      <View style={styles.weekCard}>
        <View style={styles.weekHeader}>
          <Text style={styles.weekEmoji}>{weekTheme.emoji}</Text>
          <View style={styles.weekInfo}>
            <Text style={styles.weekLabel}>Week {currentWeek} of 5</Text>
            <Text style={styles.weekTitle}>{weekTheme.title}</Text>
          </View>
        </View>

        <View style={styles.progressBar}>
          {[1, 2, 3, 4, 5].map((week) => (
            <View
              key={week}
              style={[
                styles.progressSegment,
                week <= currentWeek && styles.progressSegmentActive,
              ]}
            />
          ))}
        </View>

        {user?.northStar && (
          <View style={styles.northStarSection}>
            <Text style={styles.northStarLabel}>Your North Star</Text>
            <Text style={styles.northStarText}>{user.northStar}</Text>
          </View>
        )}
      </View>

      {/* Today's Tasks */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today's Focus</Text>
          <Text style={styles.sectionCount}>{todayTasks.length}</Text>
        </View>

        {todayTasks.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>✨</Text>
            <Text style={styles.emptyText}>No tasks scheduled for today</Text>
            <Text style={styles.emptyHint}>Add some tasks to get started</Text>
          </View>
        ) : (
          <View style={styles.tasksList}>
            {todayTasks.map((task: any) => (
              <View key={task.id} style={styles.taskCard}>
                <View style={styles.taskCheck} />
                <View style={styles.taskContent}>
                  <Text style={styles.taskTitle}>{task.title}</Text>
                  {task.recommendedSchedule && (
                    <Text style={styles.taskSchedule}>{task.recommendedSchedule}</Text>
                  )}
                </View>
                {task.aiGenerated === 1 && (
                  <View style={styles.aiTag}>
                    <Text style={styles.aiTagText}>AI</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Active Goals */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Active Goals</Text>
          <Text style={styles.sectionCount}>{activeGoals.length}</Text>
        </View>

        {activeGoals.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🎯</Text>
            <Text style={styles.emptyText}>No active goals</Text>
            <Text style={styles.emptyHint}>Set your first goal to begin</Text>
          </View>
        ) : (
          <View style={styles.goalsList}>
            {activeGoals.slice(0, 3).map((goal: any) => (
              <View key={goal.id} style={styles.goalCard}>
                <View style={styles.goalHeader}>
                  <Text style={styles.goalTitle}>{goal.title}</Text>
                  <Text style={styles.goalProgress}>{goal.progress}%</Text>
                </View>
                <View style={styles.goalProgressBar}>
                  <View
                    style={[
                      styles.goalProgressFill,
                      { width: `${goal.progress}%` },
                    ]}
                  />
                </View>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionEmoji}>➕</Text>
          <Text style={styles.actionText}>Add Task</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionEmoji}>✨</Text>
          <Text style={styles.actionText}>AI Suggest</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAF5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAFAF5',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginTop: 20,
    marginBottom: 24,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '600',
    color: '#2C2C2C',
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: '#999',
  },
  weekCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  weekHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  weekEmoji: {
    fontSize: 36,
    marginRight: 16,
  },
  weekInfo: {
    flex: 1,
  },
  weekLabel: {
    fontSize: 12,
    color: '#999',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  weekTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#2C2C2C',
    marginTop: 2,
  },
  progressBar: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  progressSegment: {
    flex: 1,
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
  },
  progressSegmentActive: {
    backgroundColor: '#5A7F6A',
  },
  northStarSection: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  northStarLabel: {
    fontSize: 12,
    color: '#999',
    fontWeight: '500',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  northStarText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    fontStyle: 'italic',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C2C2C',
  },
  sectionCount: {
    fontSize: 14,
    color: '#999',
    fontWeight: '500',
  },
  tasksList: {
    gap: 12,
  },
  taskCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  taskCheck: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#5A7F6A',
    marginRight: 12,
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    color: '#2C2C2C',
    marginBottom: 2,
  },
  taskSchedule: {
    fontSize: 12,
    color: '#999',
  },
  aiTag: {
    backgroundColor: '#F0F4F1',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  aiTagText: {
    fontSize: 10,
    color: '#5A7F6A',
    fontWeight: '600',
  },
  goalsList: {
    gap: 12,
  },
  goalCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2C2C2C',
    flex: 1,
  },
  goalProgress: {
    fontSize: 14,
    fontWeight: '600',
    color: '#5A7F6A',
  },
  goalProgressBar: {
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  goalProgressFill: {
    height: '100%',
    backgroundColor: '#5A7F6A',
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    color: '#2C2C2C',
    fontWeight: '500',
    marginBottom: 4,
  },
  emptyHint: {
    fontSize: 14,
    color: '#999',
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  actionEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2C2C2C',
  },
});
