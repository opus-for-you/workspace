import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/lib/auth-store';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/(auth)/login');
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.username?.charAt(0).toUpperCase() || 'U'}
          </Text>
        </View>
        <Text style={styles.username}>{user?.username || 'User'}</Text>
        <Text style={styles.subtitle}>Opus Member</Text>
      </View>

      {/* Purpose Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Purpose</Text>
        <View style={styles.purposeCard}>
          <Text style={styles.purposeText}>
            {user?.purposeSummary || 'Complete onboarding to set your purpose'}
          </Text>

          {user?.purposePrompt1 && (
            <View style={styles.promptsSection}>
              <Text style={styles.promptsLabel}>Original Prompts</Text>
              <Text style={styles.promptText}>1. {user.purposePrompt1}</Text>
              <Text style={styles.promptText}>2. {user.purposePrompt2}</Text>
              <Text style={styles.promptText}>3. {user.purposePrompt3}</Text>
            </View>
          )}
        </View>
      </View>

      {/* Work Style Section */}
      {user?.workstyleBest && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Work Style</Text>
          <View style={styles.workstyleCard}>
            <View style={styles.workstyleItem}>
              <Text style={styles.workstyleLabel}>How you work best:</Text>
              <Text style={styles.workstyleText}>{user.workstyleBest}</Text>
            </View>

            {user.workstyleStuck && (
              <View style={styles.workstyleItem}>
                <Text style={styles.workstyleLabel}>What gets you stuck:</Text>
                <Text style={styles.workstyleText}>{user.workstyleStuck}</Text>
              </View>
            )}
          </View>
        </View>
      )}

      {/* Key People Link */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Network</Text>
        <TouchableOpacity
          style={styles.networkCard}
          onPress={() => router.push('/key-people')}
        >
          <View style={styles.networkContent}>
            <Text style={styles.networkEmoji}>🤝</Text>
            <View style={styles.networkInfo}>
              <Text style={styles.networkTitle}>Manage Your Key People</Text>
              <Text style={styles.networkSubtitle}>
                View and update your network
              </Text>
            </View>
          </View>
          <Text style={styles.networkArrow}>›</Text>
        </TouchableOpacity>
      </View>

      {/* Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>
        <View style={styles.settingsList}>
          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingText}>Notifications</Text>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>
          <View style={styles.settingDivider} />
          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingText}>Account</Text>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* About */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <View style={styles.settingsList}>
          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingText}>Help & Support</Text>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>
          <View style={styles.settingDivider} />
          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingText}>Privacy Policy</Text>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      <Text style={styles.version}>Version 1.0.0 MVP</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAF5',
  },
  content: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#5A7F6A',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '600',
    color: '#fff',
  },
  username: {
    fontSize: 24,
    fontWeight: '600',
    color: '#2C2C2C',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#999',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C2C2C',
    marginBottom: 12,
  },
  purposeCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  purposeText: {
    fontSize: 16,
    color: '#2C2C2C',
    lineHeight: 24,
    fontStyle: 'italic',
    marginBottom: 16,
  },
  promptsSection: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  promptsLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#999',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  promptText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 6,
  },
  workstyleCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  workstyleItem: {
    marginBottom: 16,
  },
  workstyleLabel: {
    fontSize: 13,
    color: '#666',
    marginBottom: 6,
  },
  workstyleText: {
    fontSize: 16,
    color: '#2C2C2C',
    fontWeight: '500',
  },
  networkCard: {
    backgroundColor: '#F0F4F1',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#D4E5DA',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  networkContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  networkEmoji: {
    fontSize: 32,
    marginRight: 12,
  },
  networkInfo: {
    flex: 1,
  },
  networkTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#2C2C2C',
    marginBottom: 2,
  },
  networkSubtitle: {
    fontSize: 14,
    color: '#5A7F6A',
  },
  networkArrow: {
    fontSize: 24,
    color: '#5A7F6A',
    marginLeft: 8,
  },
  settingsList: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  settingText: {
    fontSize: 16,
    color: '#2C2C2C',
  },
  settingArrow: {
    fontSize: 20,
    color: '#999',
  },
  settingDivider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginLeft: 16,
  },
  logoutButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D32F2F',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#D32F2F',
  },
  version: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginTop: 24,
  },
});
