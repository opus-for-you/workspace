import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';

interface User {
  id: string;
  username: string;

  // NEW PURPOSE FIELDS
  purposePrompt1?: string;
  purposePrompt2?: string;
  purposePrompt3?: string;
  purposeSummary?: string;

  // NEW METHOD FIELDS
  workstyleBest?: string;
  workstyleStuck?: string;
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
      const mockUser: User = {
        id: 'mock-user-123',
        username,
        purposePrompt1: 'When I\'m solving complex problems collaboratively',
        purposePrompt2: 'Leading a product team at a mission-driven company',
        purposePrompt3: 'Building my own consulting practice helping teams transform',
        purposeSummary: 'I thrive when solving complex problems collaboratively. In ten years, I see myself leading a product team at a mission-driven company, helping others grow while building meaningful solutions. I\'m curious about building my own consulting practice, helping teams transform their ways of working.',
        workstyleBest: 'deep-focus',
        workstyleStuck: 'When there are too many meetings',
      };

      // Option 2: Show onboarding flow (new user)
      // const mockUser: User = {
      //   id: 'mock-user-123',
      //   username,
      //   // No purpose or method fields - will show onboarding
      // };

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
        // New user - no purpose yet
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
        // Mock user data with completed onboarding
        const mockUser: User = {
          id: 'mock-user-123',
          username: 'demo',
          purposePrompt1: 'When I\'m solving complex problems collaboratively',
          purposePrompt2: 'Leading a product team at a mission-driven company',
          purposePrompt3: 'Building my own consulting practice helping teams transform',
          purposeSummary: 'I thrive when solving complex problems collaboratively. In ten years, I see myself leading a product team at a mission-driven company, helping others grow while building meaningful solutions. I\'m curious about building my own consulting practice, helping teams transform their ways of working.',
          workstyleBest: 'deep-focus',
          workstyleStuck: 'When there are too many meetings',
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
