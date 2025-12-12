import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { goalsAPI, tasksAPI, aiAPI } from '@/lib/api';

export default function GoalDetailScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { id } = useLocalSearchParams();

  const { data: goals = [] } = useQuery({
    queryKey: ['goals'],
    queryFn: goalsAPI.getGoals,
  });

  const { data: tasks = [] } = useQuery({
    queryKey: ['tasks'],
    queryFn: tasksAPI.getTasks,
  });

  const generateMilestonesMutation = useMutation({
    mutationFn: (goalId: string) => aiAPI.generateMilestones(goalId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      Alert.alert('Success', 'AI-generated milestones created!');
    },
    onError: () => {
      Alert.alert('Error', 'Failed to generate milestones');
    },
  });

  const toggleMilestoneMutation = useMutation({
    mutationFn: ({ milestoneId, updates }: { milestoneId: string; updates: any }) =>
      tasksAPI.updateTask(milestoneId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const goal = goals.find((g: any) => g.id === id);
  const goalMilestones = tasks.filter((m: any) => m.goalId === id);

  const handleGenerateMilestones = () => {
    if (id) {
      generateMilestonesMutation.mutate(id as string);
    }
  };

  const handleToggleMilestone = (milestone: any) => {
    const newStatus = milestone.status === 'done' ? 'todo' : 'done';
    toggleMilestoneMutation.mutate({
      milestoneId: milestone.id,
      updates: { status: newStatus },
    });
  };

  if (!goal) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Goal not found</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header with Back Button */}
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>

      {/* Goal Info */}
      <View style={styles.goalSection}>
        <View style={styles.goalTitleRow}>
          <Text style={styles.title}>{goal.title}</Text>
          {goal.aiGenerated === 1 && (
            <View style={styles.aiTag}>
              <Text style={styles.aiTagText}>AI</Text>
            </View>
          )}
        </View>

        {goal.description && (
          <Text style={styles.description}>{goal.description}</Text>
        )}

        {/* Progress */}
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Progress</Text>
            <Text style={styles.progressValue}>{goal.progress}%</Text>
          </View>
          <View style={styles.progressBar}>
            <View
              style={[styles.progressFill, { width: `${goal.progress}%` }]}
            />
          </View>
        </View>

        {/* Generate Milestones Button */}
        {goalMilestones.length === 0 && (
          <TouchableOpacity
            style={styles.generateButton}
            onPress={handleGenerateMilestones}
            disabled={generateMilestonesMutation.isPending}
          >
            {generateMilestonesMutation.isPending ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Text style={styles.generateButtonText}>✨ Generate Milestones with AI</Text>
              </>
            )}
          </TouchableOpacity>
        )}
      </View>

      {/* Milestones List */}
      <View style={styles.milestonesSection}>
        <Text style={styles.sectionTitle}>Milestones</Text>

        {goalMilestones.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>✓</Text>
            <Text style={styles.emptyText}>
              No milestones yet. Generate with AI or create manually.
            </Text>
          </View>
        ) : (
          <View style={styles.milestonesList}>
            {goalMilestones.map((milestone: any) => (
              <TouchableOpacity
                key={milestone.id}
                style={[
                  styles.milestoneCard,
                  milestone.status === 'done' && styles.milestoneCardDone,
                ]}
                onPress={() => handleToggleMilestone(milestone)}
              >
                <View
                  style={[
                    styles.checkbox,
                    milestone.status === 'done' && styles.checkboxChecked,
                  ]}
                >
                  {milestone.status === 'done' && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </View>

                <View style={styles.milestoneContent}>
                  <Text
                    style={[
                      styles.milestoneTitle,
                      milestone.status === 'done' && styles.milestoneTitleDone,
                    ]}
                  >
                    {milestone.title}
                  </Text>

                  {milestone.recommendedSchedule && milestone.status !== 'done' && (
                    <View style={styles.scheduleTag}>
                      <Text style={styles.scheduleText}>
                        {milestone.recommendedSchedule}
                      </Text>
                    </View>
                  )}

                  {milestone.aiGenerated === 1 && (
                    <View style={styles.milestoneAiTag}>
                      <Text style={styles.aiTagText}>AI</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
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
    padding: 20,
  },
  content: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  backButton: {
    marginBottom: 20,
  },
  backButtonText: {
    fontSize: 16,
    color: '#5A7F6A',
    fontWeight: '500',
  },
  goalSection: {
    marginBottom: 32,
  },
  goalTitleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#2C2C2C',
    flex: 1,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 24,
  },
  progressSection: {
    marginBottom: 24,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  progressValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#5A7F6A',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#5A7F6A',
  },
  generateButton: {
    backgroundColor: '#5A7F6A',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  generateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  milestonesSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#2C2C2C',
    marginBottom: 16,
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
    marginBottom: 8,
  },
  milestoneTitleDone: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  scheduleTag: {
    backgroundColor: '#F0F4F1',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  scheduleText: {
    fontSize: 12,
    color: '#5A7F6A',
    fontWeight: '500',
  },
  milestoneAiTag: {
    backgroundColor: '#F0F4F1',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
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
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
});
