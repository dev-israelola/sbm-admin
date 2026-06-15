import axios, { type AxiosResponse, type InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "@/store/auth-store";
import type { Platform } from "@/types/platform";

export const API_BASE_BY_PLATFORM: Record<Platform, string> = {
  naturale: import.meta.env.VITE_NATURALE_API_URL || "http://localhost:3001/api",
  holistic: import.meta.env.VITE_HOLISTIC_API_URL || "http://localhost:3000/api",
};

export function apiBaseForPlatform(platform: Platform) {
  return API_BASE_BY_PLATFORM[platform];
}

export function unwrapPayload<T>(payload: T | { success: boolean; data: T }): T {
  if (payload && typeof payload === "object" && "success" in payload && "data" in payload) {
    return (payload as { data: T }).data;
  }
  return payload as T;
}

export const api = axios.create({
  baseURL: API_BASE_BY_PLATFORM.naturale,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const { activePlatform, sessions } = useAuthStore.getState();
  const session = sessions[activePlatform];
  config.baseURL = API_BASE_BY_PLATFORM[activePlatform];
  config.headers.set("x-platform", activePlatform);
  if (session?.token) {
    config.headers.set("Authorization", `Bearer ${session.token}`);
  }
  return config;
});

// --- Token refresh (per platform, single-flight) -----------------------
const refreshing: Partial<Record<Platform, Promise<string | null>>> = {};

async function refreshPlatform(platform: Platform): Promise<string | null> {
  const { sessions, signIn, signOutPlatform } = useAuthStore.getState();
  const session = sessions[platform];
  if (!session?.refreshToken) {
    signOutPlatform(platform);
    return null;
  }
  try {
    const { data } = await axios.post(
      `${apiBaseForPlatform(platform)}/auth/refresh`,
      { refreshToken: session.refreshToken },
      { headers: { "Content-Type": "application/json", "x-platform": platform } },
    );
    const payload = unwrapPayload(data) as {
      accessToken?: string;
      token?: string;
      refreshToken?: string;
    };
    const token = payload.accessToken ?? payload.token;
    if (!token) {
      signOutPlatform(platform);
      return null;
    }
    // Update this platform's tokens, preserving the user + other platforms.
    signIn(session.user, token, platform, payload.refreshToken ?? session.refreshToken);
    return token;
  } catch {
    signOutPlatform(platform);
    return null;
  }
}

api.interceptors.response.use(
  (response: AxiosResponse) => {
    response.data = unwrapPayload(response.data);
    return response;
  },
  async (err) => {
    const original = err.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;
    const status = err?.response?.status;
    const isAuthRoute = (original?.url ?? "").includes("/auth/");

    // Try one transparent token refresh before ending the session.
    if (status === 401 && original && !original._retry && !isAuthRoute) {
      original._retry = true;
      const platform = useAuthStore.getState().activePlatform;
      refreshing[platform] = refreshing[platform] ?? refreshPlatform(platform);
      const token = await refreshing[platform];
      refreshing[platform] = undefined;
      if (token) {
        // Re-run through the request interceptor, which reattaches the new token.
        return api.request(original);
      }
    }

    const message =
      err?.response?.data?.message || err?.message || "Something went wrong. Please try again.";
    return Promise.reject(new Error(message));
  },
);
