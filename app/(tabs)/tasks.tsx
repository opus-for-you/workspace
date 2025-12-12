import { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tasksAPI, goalsAPI } from '@/lib/api';

export default function MilestonesScreen() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<'all' | 'goal'>('all');

  const { data: tasks = [], isLoading: tasksLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: tasksAPI.getTasks,
  });

  const { data: goals = [], isLoading: goalsLoading } = useQuery({
    queryKey: ['goals'],
    queryFn: goalsAPI.getGoals,
  });

  const updateTaskMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: any }) =>
      tasksAPI.updateTask(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const handleToggleTask = (task: any) => {
    const newStatus = task.status === 'done' ? 'todo' : 'done';
    updateTaskMutation.mutate({
      id: task.id,
      updates: { status: newStatus },
    });
  };

  const getGoalName = (goalId: string) => {
    const goal = goals.find((g: any) => g.id === goalId);
    return goal?.title || 'No goal';
  };

  const todoMilestones = tasks.filter((t: any) => t.status === 'todo');
  const doneMilestones = tasks.filter((t: any) => t.status === 'done');

  const isLoading = tasksLoading || goalsLoading;

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#5A7F6A" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Milestones</Text>
        <Text style={styles.subtitle}>
          {todoMilestones.length} to do, {doneMilestones.length} completed
        </Text>
      </View>

      {/* Filter Options */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'all' && styles.filterButtonActive]}
          onPress={() => setFilter('all')}
        >
          <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'goal' && styles.filterButtonActive]}
          onPress={() => setFilter('goal')}
        >
          <Text style={[styles.filterText, filter === 'goal' && styles.filterTextActive]}>
            By Goal
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        {/* To Do Section */}
        {todoMilestones.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>To Do</Text>
            <View style={styles.milestonesList}>
              {todoMilestones.map((milestone: any) => (
                <MilestoneCard
                  key={milestone.id}
                  milestone={milestone}
                  goalName={milestone.goalId ? getGoalName(milestone.goalId) : undefined}
                  onToggle={() => handleToggleTask(milestone)}
                />
              ))}
            </View>
          </View>
        )}

        {/* Completed Section */}
        {doneMilestones.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Completed</Text>
            <View style={styles.milestonesList}>
              {doneMilestones.map((milestone: any) => (
                <MilestoneCard
                  key={milestone.id}
                  milestone={milestone}
                  goalName={milestone.goalId ? getGoalName(milestone.goalId) : undefined}
                  onToggle={() => handleToggleTask(milestone)}
                />
              ))}
            </View>
          </View>
        )}

        {/* Empty State */}
        {tasks.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>✓</Text>
            <Text style={styles.emptyTitle}>No milestones yet</Text>
            <Text style={styles.emptyText}>
              Create goals and generate milestones to get started
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Add Button */}
      <TouchableOpacity style={styles.fab}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

function MilestoneCard({
  milestone,
  goalName,
  onToggle
}: {
  milestone: any;
  goalName?: string;
  onToggle: () => void;
}) {
  const isDone = milestone.status === 'done';

  return (
    <TouchableOpacity
      style={[styles.milestoneCard, isDone && styles.milestoneCardDone]}
      onPress={onToggle}
    >
      <View style={[styles.checkbox, isDone && styles.checkboxChecked]}>
        {isDone && <Text style={styles.checkmark}>✓</Text>}
      </View>

      <View style={styles.milestoneContent}>
        <Text style={[styles.milestoneTitle, isDone && styles.milestoneTitleDone]}>
          {milestone.title}
        </Text>

        {milestone.description && !isDone && (
          <Text style={styles.milestoneDescription}>{milestone.description}</Text>
        )}

        {goalName && (
          <View style={styles.goalTag}>
            <Text style={styles.goalEmoji}>🎯</Text>
            <Text style={styles.goalText}>{goalName}</Text>
          </View>
        )}

        <View style={styles.milestoneMeta}>
          {milestone.recommendedSchedule && (
            <View style={styles.scheduleTag}>
              <Text style={styles.scheduleText}>{milestone.recommendedSchedule}</Text>
            </View>
          )}
          {milestone.aiGenerated === 1 && (
            <View style={styles.aiTag}>
              <Text style={styles.aiTagText}>AI</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
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
  header: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '600',
    color: '#2C2C2C',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#999',
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 8,
    paddingBottom: 16,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  filterButtonActive: {
    backgroundColor: '#5A7F6A',
    borderColor: '#5A7F6A',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  filterTextActive: {
    color: '#fff',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C2C2C',
    marginBottom: 12,
  },
  milestonesList: {
    gap: 12,
  },
  milestoneCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  milestoneCardDone: {
    opacity: 0.6,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#5A7F6A',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: '#5A7F6A',
  },
  checkmark: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  milestoneContent: {
    flex: 1,
  },
  milestoneTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2C2C2C',
    marginBottom: 4,
  },
  milestoneTitleDone: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  milestoneDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
  goalTag: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  goalEmoji: {
    fontSize: 14,
    marginRight: 4,
  },
  goalText: {
    fontSize: 13,
    color: '#5A7F6A',
    fontWeight: '500',
  },
  milestoneMeta: {
    flexDirection: 'row',
    gap: 8,
  },
  scheduleTag: {
    backgroundColor: '#F0F4F1',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  scheduleText: {
    fontSize: 11,
    color: '#5A7F6A',
    fontWeight: '500',
  },
  aiTag: {
    backgroundColor: '#F0F4F1',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  aiTagText: {
    fontSize: 11,
    color: '#5A7F6A',
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    padding: 48,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2C2C2C',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#5A7F6A',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabText: {
    fontSize: 32,
    color: '#fff',
    fontWeight: '300',
  },
});
