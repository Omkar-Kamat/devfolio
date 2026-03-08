import { create } from 'zustand';

type Theme = 'dark' | 'light';

interface ThemeState {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    toggleTheme: () => void;
}

const applyTheme = (theme: Theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    // Cookie read server-side in layout.tsx to apply theme before first paint (no FWOT)
    document.cookie = `theme=${theme}; path=/; max-age=31536000; SameSite=Lax`;
};

export const useThemeStore = create<ThemeState>((set) => ({
    // Read the current data-theme from the DOM (set by server via cookie in layout.tsx)
    // This keeps Zustand in sync with the server-rendered value on hydration
    theme: (typeof document !== 'undefined'
        ? (document.documentElement.getAttribute('data-theme') as Theme) ?? 'dark'
        : 'dark'),
    setTheme: (theme) => {
        applyTheme(theme);
        set({ theme });
    },
    toggleTheme: () => set((state) => {
        const newTheme: Theme = state.theme === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
        return { theme: newTheme };
    }),
}));
