import { create } from 'zustand';

interface ThemeState {
    isDark: boolean;
    toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
    isDark: false,
    toggleTheme: () => set((state) => {
        const next = !state.isDark;
        document.documentElement.classList.toggle('dark', next);
        return { isDark: next };
    }),
}));