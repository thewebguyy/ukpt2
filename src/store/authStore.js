import { create } from 'zustand';
import { AuthService } from '../services/auth.service';

export const useAuthStore = create((set) => ({
    user: null,
    loading: true,
    error: null,

    setUser: (user) => set({ user, loading: false }),
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),

    initListener: () => {
        return AuthService.initAuthListener((user) => {
            set({ user, loading: false });
        });
    },

    logout: async () => {
        await AuthService.logout();
        set({ user: null });
    }
}));
