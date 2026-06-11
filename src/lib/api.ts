import axios from "axios";
import { useAuthStore } from "@/store/auth-store";
import type { Platform } from "@/types/platform";

const API_BASE_BY_PLATFORM: Record<Platform, string> = {
  harbs: import.meta.env.VITE_HARBS_API_URL || "/api",
  holistic: import.meta.env.VITE_HOLISTIC_API_URL || "/api",
};

export const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const { activePlatform, token } = useAuthStore.getState();
  config.baseURL = API_BASE_BY_PLATFORM[activePlatform];
  config.headers.set("x-platform", activePlatform);
  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    const message =
      err?.response?.data?.message ||
      err?.message ||
      "Something went wrong. Please try again.";
    return Promise.reject(new Error(message));
  },
);
