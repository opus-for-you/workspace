import { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, TextInput, Modal, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { keyPeopleAPI, KeyPerson } from '@/lib/api';

export default function KeyPeopleScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [editingPerson, setEditingPerson] = useState<KeyPerson | null>(null);
  const [editForm, setEditForm] = useState({ name: '', type: '', why: '', notes: '' });

  const { data: keyPeople = [], isLoading } = useQuery({
    queryKey: ['keyPeople'],
    queryFn: keyPeopleAPI.getKeyPeople,
  });

  const logInteractionMutation = useMutation({
    mutationFn: (id: string) =>
      keyPeopleAPI.updateKeyPerson(id, {
        lastInteraction: new Date().toISOString().split('T')[0],
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['keyPeople'] });
      Alert.alert('Success', 'Interaction logged!');
    },
    onError: () => {
      Alert.alert('Error', 'Failed to log interaction');
    },
  });

  const editMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: any }) =>
      keyPeopleAPI.updateKeyPerson(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['keyPeople'] });
      setEditingPerson(null);
      Alert.alert('Success', 'Person updated!');
    },
    onError: () => {
      Alert.alert('Error', 'Failed to update person');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => keyPeopleAPI.deleteKeyPerson(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['keyPeople'] });
      Alert.alert('Success', 'Person removed from your network');
    },
    onError: () => {
      Alert.alert('Error', 'Failed to delete person');
    },
  });

  const handleLogInteraction = (id: string) => {
    logInteractionMutation.mutate(id);
  };

  const handleEdit = (person: KeyPerson) => {
    setEditingPerson(person);
    setEditForm({
      name: person.name,
      type: person.type,
      why: person.why || '',
      notes: person.notes || '',
    });
  };

  const handleSaveEdit = () => {
    if (!editingPerson) return;
    if (!editForm.name.trim()) {
      Alert.alert('Required', 'Name is required');
      return;
    }

    editMutation.mutate({
      id: editingPerson.id,
      updates: {
        name: editForm.name.trim(),
        type: editForm.type,
        why: editForm.why.trim() || null,
        notes: editForm.notes.trim() || null,
      },
    });
  };

  const handleDelete = (person: KeyPerson) => {
    Alert.alert(
      'Remove Person',
      `Remove ${person.name} from your network?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => deleteMutation.mutate(person.id),
        },
      ]
    );
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      mentor: 'Mentor / Guide',
      peer: 'Peer / Fellow Traveler',
      collaborator: 'Collaborator / Supporter',
    };
    return labels[type] || type;
  };

  const getTypeEmoji = (type: string) => {
    const emojis: Record<string, string> = {
      mentor: '🧭',
      peer: '🤝',
      collaborator: '⚡',
    };
    return emojis[type] || '👤';
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#5A7F6A" />
      </View>
    );
  }

  return (
    <>
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header with Back Button */}
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={styles.title}>Your Network</Text>
        <Text style={styles.subtitle}>The people supporting your growth</Text>
      </View>

      {/* Key People List */}
      {keyPeople.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>🤝</Text>
          <Text style={styles.emptyText}>
            No key people yet. Add them during onboarding or in your profile.
          </Text>
        </View>
      ) : (
        <View style={styles.peopleList}>
          {keyPeople.map((person: any) => (
            <View key={person.id} style={styles.personCard}>
              <View style={styles.personHeader}>
                <Text style={styles.personEmoji}>{getTypeEmoji(person.type)}</Text>
                <View style={styles.personInfo}>
                  <Text style={styles.personName}>{person.name}</Text>
                  <Text style={styles.personType}>{getTypeLabel(person.type)}</Text>
                </View>
              </View>

              {person.why && (
                <View style={styles.personSection}>
                  <Text style={styles.sectionLabel}>Why They Matter</Text>
                  <Text style={styles.sectionText}>{person.why}</Text>
                </View>
              )}

              {person.lastInteraction && (
                <View style={styles.personSection}>
                  <Text style={styles.sectionLabel}>Last Interaction</Text>
                  <Text style={styles.sectionText}>{formatDate(person.lastInteraction)}</Text>
                </View>
              )}

              {person.notes && (
                <View style={styles.personSection}>
                  <Text style={styles.sectionLabel}>Notes</Text>
                  <Text style={styles.sectionText}>{person.notes}</Text>
                </View>
              )}

              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.logButton}
                  onPress={() => handleLogInteraction(person.id)}
                  disabled={logInteractionMutation.isPending}
                >
                  <Text style={styles.logButtonText}>
                    {logInteractionMutation.isPending ? 'Logging...' : 'Log Interaction'}
                  </Text>
                </TouchableOpacity>

                <View style={styles.secondaryActions}>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => handleEdit(person)}
                  >
                    <Text style={styles.editButtonText}>Edit</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDelete(person)}
                  >
                    <Text style={styles.deleteButtonText}>Remove</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>
      )}
    </ScrollView>

    {/* Edit Modal */}
    {editingPerson && (
      <Modal
        visible={true}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setEditingPerson(null)}
      >
        <View style={styles.modal}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setEditingPerson(null)}>
              <Text style={styles.modalCancel}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Edit Person</Text>
            <TouchableOpacity
              onPress={handleSaveEdit}
              disabled={editMutation.isPending}
            >
              <Text
                style={[
                  styles.modalSave,
                  editMutation.isPending && styles.modalSaveDisabled,
                ]}
              >
                {editMutation.isPending ? 'Saving...' : 'Save'}
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Name *</Text>
              <TextInput
                style={styles.input}
                value={editForm.name}
                onChangeText={(name) => setEditForm({ ...editForm, name })}
                placeholder="Name"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Type</Text>
              <View style={styles.typeButtons}>
                {['mentor', 'peer', 'collaborator'].map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.typeButton,
                      editForm.type === type && styles.typeButtonActive,
                    ]}
                    onPress={() => setEditForm({ ...editForm, type })}
                  >
                    <Text style={styles.typeButtonIcon}>{getTypeEmoji(type)}</Text>
                    <Text
                      style={[
                        styles.typeButtonText,
                        editForm.type === type && styles.typeButtonTextActive,
                      ]}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Why They Matter</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={editForm.why}
                onChangeText={(why) => setEditForm({ ...editForm, why })}
                placeholder="Why this person matters to you"
                placeholderTextColor="#999"
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Notes</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={editForm.notes}
                onChangeText={(notes) => setEditForm({ ...editForm, notes })}
                placeholder="Any notes about this person"
                placeholderTextColor="#999"
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>
          </ScrollView>
        </View>
      </Modal>
    )}
  </>
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
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#2C2C2C',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  peopleList: {
    gap: 16,
  },
  personCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  personHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  personEmoji: {
    fontSize: 36,
    marginRight: 12,
  },
  personInfo: {
    flex: 1,
  },
  personName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2C2C2C',
    marginBottom: 2,
  },
  personType: {
    fontSize: 14,
    color: '#666',
  },
  personSection: {
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#999',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  sectionText: {
    fontSize: 15,
    color: '#2C2C2C',
    lineHeight: 22,
  },
  actions: {
    marginTop: 8,
  },
  logButton: {
    backgroundColor: '#5A7F6A',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginBottom: 8,
  },
  logButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  secondaryActions: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#2C2C2C',
    fontSize: 14,
    fontWeight: '600',
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#D32F2F',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#D32F2F',
    fontSize: 14,
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
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: 20,
  },
  modal: {
    flex: 1,
    backgroundColor: '#FAFAF5',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    backgroundColor: '#FAFAF5',
  },
  modalCancel: {
    fontSize: 16,
    color: '#999',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C2C2C',
  },
  modalSave: {
    fontSize: 16,
    color: '#5A7F6A',
    fontWeight: '600',
  },
  modalSaveDisabled: {
    opacity: 0.4,
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  formGroup: {
    marginBottom: 24,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C2C2C',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: '#2C2C2C',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  typeButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  typeButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  typeButtonActive: {
    backgroundColor: '#F0F4F1',
    borderColor: '#5A7F6A',
  },
  typeButtonIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  typeButtonText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  typeButtonTextActive: {
    color: '#5A7F6A',
    fontWeight: '600',
  },
});
