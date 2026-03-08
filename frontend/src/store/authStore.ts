import { create } from 'zustand';

/**
 * Auth store — access token lives in Zustand memory ONLY.
 * Per design spec NFR-S-01: "Access token SHALL be kept in React memory (Zustand) only —
 * never in localStorage, sessionStorage, or a readable cookie."
 *
 * On page refresh, accessToken is lost (null) and the app silently calls /api/auth/refresh
 * using the HttpOnly refresh_token cookie to get a new one.
 */
interface AuthState {
    accessToken: string | null;
    setAccessToken: (token: string) => void;
    clearAccessToken: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    accessToken: null,
    setAccessToken: (token) => set({ accessToken: token }),
    clearAccessToken: () => set({ accessToken: null }),
}));
