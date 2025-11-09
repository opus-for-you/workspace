import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';

interface User {
  id: string;
  username: string;
  northStar?: string;
  programWeek?: number;
  programStartDate?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  setUser: (user: User) => void;
}

// Mock mode for testing without backend
const MOCK_MODE = true; // Set to false when backend is ready

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isLoading: true,

  login: async (username: string, password: string) => {
    if (MOCK_MODE) {
      // Mock successful login
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay

      // Option 1: Skip onboarding (go straight to dashboard)
      // const mockUser: User = {
      //   id: 'mock-user-123',
      //   username,
      //   northStar: 'I want to become a trusted advisor in my industry',
      //   programWeek: 2,
      //   programStartDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
      // };

      // Option 2: Show onboarding flow (recommended for first time)
      const mockUser: User = {
        id: 'mock-user-123',
        username,
        programWeek: 0, // Not started yet - will show onboarding
      };

      await SecureStore.setItemAsync('auth_token', 'mock-token-123');
      set({ user: mockUser, token: 'mock-token-123' });
      return;
    }

    // TODO: Implement real login API call
    throw new Error('Login not implemented yet - set MOCK_MODE=false');
  },

  register: async (username: string, password: string) => {
    if (MOCK_MODE) {
      // Mock successful registration
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
      const mockUser: User = {
        id: 'mock-user-123',
        username,
        programWeek: 0, // Not started yet
      };
      await SecureStore.setItemAsync('auth_token', 'mock-token-123');
      set({ user: mockUser, token: 'mock-token-123' });
      return;
    }

    // TODO: Implement real register API call
    throw new Error('Register not implemented yet - set MOCK_MODE=false');
  },

  logout: async () => {
    await SecureStore.deleteItemAsync('auth_token');
    set({ user: null, token: null });
  },

  refreshUser: async () => {
    if (MOCK_MODE) {
      const token = await SecureStore.getItemAsync('auth_token');
      if (token) {
        // Mock user data
        const mockUser: User = {
          id: 'mock-user-123',
          username: 'demo',
          northStar: 'I want to become a trusted advisor in my industry',
          programWeek: 2,
          programStartDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(), // Started 8 days ago
        };
        set({ user: mockUser, token, isLoading: false });
      } else {
        set({ isLoading: false });
      }
      return;
    }

    // TODO: Fetch real user data from API
    const token = await SecureStore.getItemAsync('auth_token');
    if (token) {
      set({ token, isLoading: false });
    } else {
      set({ isLoading: false });
    }
  },

  setUser: (user: User) => {
    set({ user });
  },
}));

// Initialize auth state on app start
useAuthStore.getState().refreshUser();
