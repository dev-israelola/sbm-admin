import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Role } from "@/types/role";
import type { Platform } from "@/types/platform";

export interface SessionUser {
  id: string;
  fullName: string;
  email: string;
  role: Role;
  platforms: Platform[];
}

interface AuthState {
  user: SessionUser | null;
  token: string | null;
  activePlatform: Platform;
  signIn: (user: SessionUser, token: string) => void;
  switchRole: (role: Role) => void;
  switchPlatform: (platform: Platform) => void;
  signOut: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      activePlatform: "harbs",
      switchRole: (role) => {
        const u = get().user;
        if (!u) return;
        set({ user: { ...u, role } });
      },
      switchPlatform: (platform) => {
        const u = get().user;
        if (!u || !u.platforms.includes(platform)) return;
        set({ activePlatform: platform });
      },
      signIn: (user, token) => set({
        user,
        token,
        activePlatform: user.platforms[0] ?? "harbs",
      }),
      signOut: () => set({ user: null, token: null, activePlatform: "harbs" }),
    }),
    { name: "harbs-multi-admin.session" },
  ),
);
