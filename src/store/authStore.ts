import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthState, Tokens, User } from '../types/auth.types';
import api from '../api/axiosInstance';
import { getProfile } from '../api/authApi';

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      tokens: null,
      isAuthenticated: false,

      login: async (tokens: Tokens) => {
        set({ tokens, isAuthenticated: true });
        try {
          const user = await getProfile(tokens.accessToken);
          set({ user });
        } catch (err) {
          get().logout();
          throw err;
        }
      },

      logout: () => {
        set({ user: null, tokens: null, isAuthenticated: false });
      },

      refreshAccessToken: async () => {
        const { tokens } = get();
        if (!tokens?.refreshToken) throw new Error('No refresh token');

        try {
          const res = await api.post('/auth/refresh', {
            refreshToken: tokens.refreshToken,
          });
          const newAccessToken = res.data.accessToken;

          set((state) => ({
            tokens: state.tokens ? { ...state.tokens, accessToken: newAccessToken } : null,
          }));
        } catch (err) {
          get().logout();
          throw err;
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        // Persist full tokens so refreshAccessToken can run after reload
        tokens: state.tokens ? { accessToken: state.tokens.accessToken, refreshToken: state.tokens.refreshToken } : null,
        // Persist authenticated flag (or derive it in your app from tokens)
        isAuthenticated: !!state.tokens,
      }),
    }
  )
);