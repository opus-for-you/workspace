import { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tasksAPI } from '@/lib/api';

const SCHEDULE_FILTERS = ['All', 'Morning', 'Afternoon', 'Evening'];

export default function TasksScreen() {
  const queryClient = useQueryClient();
  const [selectedSchedule, setSelectedSchedule] = useState('All');

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: tasksAPI.getTasks,
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

  const filteredTasks = tasks.filter((task: any) => {
    if (selectedSchedule === 'All') return true;
    return task.recommendedSchedule?.toLowerCase().includes(selectedSchedule.toLowerCase());
  });

  const todoTasks = filteredTasks.filter((t: any) => t.status === 'todo');
  const doneTasks = filteredTasks.filter((t: any) => t.status === 'done');

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
        <Text style={styles.title}>Tasks</Text>
        <Text style={styles.subtitle}>
          {todoTasks.length} to do, {doneTasks.length} completed
        </Text>
      </View>

      {/* Schedule Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterScroll}
        contentContainerStyle={styles.filterContainer}
      >
        {SCHEDULE_FILTERS.map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterButton,
              selectedSchedule === filter && styles.filterButtonActive,
            ]}
            onPress={() => setSelectedSchedule(filter)}
          >
            <Text
              style={[
                styles.filterText,
                selectedSchedule === filter && styles.filterTextActive,
              ]}
            >
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        {/* To Do Tasks */}
        {todoTasks.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>To Do</Text>
            <View style={styles.tasksList}>
              {todoTasks.map((task: any) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggle={() => handleToggleTask(task)}
                />
              ))}
            </View>
          </View>
        )}

        {/* Completed Tasks */}
        {doneTasks.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Completed</Text>
            <View style={styles.tasksList}>
              {doneTasks.map((task: any) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggle={() => handleToggleTask(task)}
                />
              ))}
            </View>
          </View>
        )}

        {/* Empty State */}
        {filteredTasks.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>✓</Text>
            <Text style={styles.emptyTitle}>No tasks</Text>
            <Text style={styles.emptyText}>
              {selectedSchedule === 'All'
                ? 'Add some tasks to get started'
                : `No tasks scheduled for ${selectedSchedule.toLowerCase()}`}
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

function TaskCard({ task, onToggle }: { task: any; onToggle: () => void }) {
  const isDone = task.status === 'done';

  return (
    <TouchableOpacity
      style={[styles.taskCard, isDone && styles.taskCardDone]}
      onPress={onToggle}
    >
      <View style={[styles.checkbox, isDone && styles.checkboxChecked]}>
        {isDone && <Text style={styles.checkmark}>✓</Text>}
      </View>

      <View style={styles.taskContent}>
        <Text style={[styles.taskTitle, isDone && styles.taskTitleDone]}>
          {task.title}
        </Text>

        {task.description && !isDone && (
          <Text style={styles.taskDescription}>{task.description}</Text>
        )}

        <View style={styles.taskMeta}>
          {task.recommendedSchedule && (
            <View style={styles.scheduleTag}>
              <Text style={styles.scheduleText}>{task.recommendedSchedule}</Text>
            </View>
          )}
          {task.aiGenerated === 1 && (
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
  filterScroll: {
    maxHeight: 50,
  },
  filterContainer: {
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
  tasksList: {
    gap: 12,
  },
  taskCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  taskCardDone: {
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
  },
  checkboxChecked: {
    backgroundColor: '#5A7F6A',
  },
  checkmark: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2C2C2C',
    marginBottom: 4,
  },
  taskTitleDone: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  taskDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
  taskMeta: {
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
    fontSize: 12,
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
    fontSize: 12,
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
