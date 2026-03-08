import { create } from 'zustand';

interface UiState {
    isMenuOpen: boolean;
    toggleMenu: () => void;
    activeSection: string;
    setActiveSection: (section: string) => void;
}

export const useUiStore = create<UiState>((set) => ({
    isMenuOpen: false,
    toggleMenu: () => set((state) => ({ isMenuOpen: !state.isMenuOpen })),
    activeSection: 'home',
    setActiveSection: (section) => set({ activeSection: section }),
}));
