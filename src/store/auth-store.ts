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

export interface PlatformSession {
  user: SessionUser;
  token: string;
  refreshToken?: string;
}

type SessionMap = Partial<Record<Platform, PlatformSession>>;

interface AuthState {
  user: SessionUser | null;
  token: string | null;
  sessions: SessionMap;
  activePlatform: Platform;
  setSessions: (sessions: SessionMap, activePlatform: Platform) => void;
  signIn: (user: SessionUser, token: string, platform?: Platform, refreshToken?: string) => void;
  switchRole: (role: Role) => void;
  switchPlatform: (platform: Platform) => boolean;
  signOutPlatform: (platform: Platform) => void;
  signOut: () => void;
}

const DEFAULT_PLATFORM: Platform = "naturale";

function sessionUserForPlatform(session: PlatformSession, platforms: Platform[]): SessionUser {
  return { ...session.user, platforms };
}

function hydrateActive(sessions: SessionMap, activePlatform: Platform) {
  const platforms = Object.keys(sessions) as Platform[];
  const active = sessions[activePlatform] ?? sessions[platforms[0]];
  if (!active) {
    return { user: null, token: null, activePlatform: DEFAULT_PLATFORM };
  }

  const nextPlatform = sessions[activePlatform] ? activePlatform : platforms[0];
  return {
    user: sessionUserForPlatform(active, platforms),
    token: active.token,
    activePlatform: nextPlatform,
  };
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      sessions: {},
      activePlatform: DEFAULT_PLATFORM,
      setSessions: (sessions, activePlatform) => {
        set({ sessions, ...hydrateActive(sessions, activePlatform) });
      },
      switchRole: (role) => {
        const { activePlatform, sessions } = get();
        const active = sessions[activePlatform];
        if (!active) return;
        const nextActive = { ...active, user: { ...active.user, role } };
        const nextSessions = { ...sessions, [activePlatform]: nextActive };
        set({ sessions: nextSessions, ...hydrateActive(nextSessions, activePlatform) });
      },
      switchPlatform: (platform) => {
        const { sessions } = get();
        if (!sessions[platform]) return false;
        set(hydrateActive(sessions, platform));
        return true;
      },
      signIn: (user, token, platform = DEFAULT_PLATFORM, refreshToken) => {
        const sessions = {
          ...get().sessions,
          [platform]: { user, token, refreshToken },
        };
        set({ sessions, ...hydrateActive(sessions, platform) });
      },
      signOutPlatform: (platform) => {
        const sessions = { ...get().sessions };
        delete sessions[platform];
        set({ sessions, ...hydrateActive(sessions, get().activePlatform) });
      },
      signOut: () => set({ user: null, token: null, sessions: {}, activePlatform: DEFAULT_PLATFORM }),
    }),
    { name: "sbm-multi-admin.session" },
  ),
);
