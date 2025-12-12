import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/lib/auth-store';
import { tasksAPI, goalsAPI } from '@/lib/api';

export default function DashboardScreen() {
  const { user } = useAuthStore();

  const { data: tasks = [], isLoading: tasksLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: tasksAPI.getTasks,
  });

  const { data: goals = [], isLoading: goalsLoading } = useQuery({
    queryKey: ['goals'],
    queryFn: goalsAPI.getGoals,
  });

  const activeGoals = goals.filter((g: any) => g.progress < 100);
  const todayTasks = tasks.filter((t: any) => t.status === 'todo').slice(0, 5);

  // Calculate completed this week
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay());
  weekStart.setHours(0, 0, 0, 0);

  const completedThisWeek = tasks.filter((t: any) => {
    if (t.status !== 'done') return false;
    const taskDate = new Date(t.createdAt);
    return taskDate >= weekStart;
  });

  const isLoading = tasksLoading || goalsLoading;

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

      {/* Purpose Summary Card */}
      <View style={styles.purposeCard}>
        <Text style={styles.purposeLabel}>Your Purpose</Text>
        <Text style={styles.purposeText}>
          {user?.purposeSummary || 'Define your purpose to get started'}
        </Text>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{activeGoals.length}</Text>
          <Text style={styles.statLabel}>Active Goals</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{completedThisWeek.length}</Text>
          <Text style={styles.statLabel}>Completed This Week</Text>
        </View>
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
            {activeGoals.map((goal: any) => (
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

      {/* Today's Focus */}
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
  purposeCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  purposeLabel: {
    fontSize: 12,
    color: '#999',
    fontWeight: '500',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  purposeText: {
    fontSize: 16,
    color: '#2C2C2C',
    lineHeight: 24,
    fontStyle: 'italic',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  statNumber: {
    fontSize: 32,
    fontWeight: '700',
    color: '#5A7F6A',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
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
});
