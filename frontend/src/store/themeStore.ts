import { create } from 'zustand';

interface ThemeState {
    theme: 'dark' | 'light';
    setTheme: (theme: 'dark' | 'light') => void;
    toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
    theme: 'dark', // default to dark
    setTheme: (theme) => {
        set({ theme });
        document.documentElement.setAttribute('data-theme', theme);
        document.cookie = `theme=${theme}; path=/; max-age=31536000; SameSite=Lax`;
    },
    toggleTheme: () => set((state) => {
        const newTheme = state.theme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        document.cookie = `theme=${newTheme}; path=/; max-age=31536000; SameSite=Lax`;
        return { theme: newTheme };
    }),
}));
