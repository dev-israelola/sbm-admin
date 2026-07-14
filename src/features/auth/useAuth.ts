import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, apiBaseForPlatform, unwrapPayload } from "@/lib/api";
import { DEFAULT_PAGE_SIZE, paginated } from "@/lib/pagination";
import { qk } from "@/lib/query-client";
import { useAuthStore, type PlatformSession, type SessionUser } from "@/store/auth-store";
import { ALL_PLATFORMS, type Platform } from "@/types/platform";
import type { Role } from "@/types/role";
import type { Customer, StaffUser } from "@/types/user";

interface BackendUser {
  id: string;
  email: string;
  role: string;
  displayName?: string | null;
  fullName?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  customRoleName?: string;
  permissions?: string[];
}

interface BackendLoginResponse {
  user: BackendUser;
  accessToken?: string;
  token?: string;
  refreshToken?: string;
}

export interface LoginResult {
  user: SessionUser;
  sessions: Partial<Record<Platform, PlatformSession>>;
  activePlatform: Platform;
}

const ROLE_BY_BACKEND: Record<string, Role | undefined> = {
  ADMIN: "admin",
  MANAGER: "manager",
  ACCOUNTANT: "accountant",
  DELIVERY_STAFF: "delivery",
  DELIVERY: "delivery",
  CONSULTANT: "consultant",
  admin: "admin",
  manager: "manager",
  accountant: "accountant",
  delivery: "delivery",
  consultant: "consultant",
};

function toFullName(user: Partial<BackendUser> & { email?: string }) {
  return (
    user.fullName ||
    user.displayName ||
    [user.firstName, user.lastName].filter(Boolean).join(" ") ||
    user.email?.split("@")[0] ||
    "User"
  );
}

function toSessionUser(user: BackendUser, platforms: Platform[]): SessionUser {
  const role = ROLE_BY_BACKEND[user.role];
  if (!role) {
    throw new Error("This account is not allowed to access the admin dashboard.");
  }
  return {
    id: user.id,
    fullName: toFullName(user),
    email: user.email,
    role,
    platforms,
    customRoleName: user.customRoleName,
    permissions: user.permissions,
  };
}

async function loginToPlatform(platform: Platform, body: { email: string; password: string }) {
  const { data } = await axios.post<BackendLoginResponse | { success: boolean; data: BackendLoginResponse }>(
    `${apiBaseForPlatform(platform)}/auth/login`,
    body,
    { headers: { "Content-Type": "application/json", "x-platform": platform } },
  );
  const payload = unwrapPayload(data);
  const token = payload.accessToken ?? payload.token;
  if (!token) throw new Error("Login succeeded but no access token was returned.");
  return { user: payload.user, token, refreshToken: payload.refreshToken };
}

export function useLogin() {
  const setSessions = useAuthStore((s) => s.setSessions);
  return useMutation({
    mutationFn: async (body: { email: string; password: string; preferredPlatform?: Platform }) => {
      const orderedPlatforms = body.preferredPlatform
        ? [body.preferredPlatform, ...ALL_PLATFORMS.filter((p) => p !== body.preferredPlatform)]
        : ALL_PLATFORMS;

      // Only the credentials go to the backend; preferredPlatform is client-only.
      const credentials = { email: body.email, password: body.password };
      const attempts = await Promise.allSettled(
        orderedPlatforms.map(async (platform) => ({ platform, result: await loginToPlatform(platform, credentials) })),
      );

      const successes = attempts.flatMap((attempt) =>
        attempt.status === "fulfilled" ? [attempt.value] : [],
      );

      if (!successes.length) {
        const firstError = attempts.find((attempt) => attempt.status === "rejected");
        if (firstError?.status === "rejected" && firstError.reason) {
           const err = firstError.reason as any;
           // If it's a structural Axios error with a backend payload, parse it cleanly!
           if (err.response?.data) {
             const d = err.response.data;
             const msg = typeof d === 'string' ? d : (d.message || d.error || JSON.stringify(d));
             throw new Error(msg);
           }
           // Fallback to exactly whatever the Axios engine caught
           throw err;
        }
        throw new Error("Invalid credentials");
      }

      const platforms = successes.map((success) => success.platform);
      const sessions = successes.reduce<Partial<Record<Platform, PlatformSession>>>((acc, success) => {
        acc[success.platform] = {
          user: toSessionUser(success.result.user, platforms),
          token: success.result.token,
          refreshToken: success.result.refreshToken,
        };
        return acc;
      }, {});

      const activePlatform =
        body.preferredPlatform && sessions[body.preferredPlatform]
          ? body.preferredPlatform
          : successes[0].platform;

      setSessions(sessions, activePlatform);
      const activeSession = sessions[activePlatform];
      if (!activeSession) throw new Error("Unable to create an admin session.");
      return { user: activeSession.user, sessions, activePlatform } satisfies LoginResult;
    },
  });
}

function normalizeStaffUser(raw: Record<string, any>, activePlatform: Platform): StaffUser {
  return {
    id: raw.id,
    fullName: toFullName(raw),
    email: raw.email,
    role: ROLE_BY_BACKEND[raw.role] ?? "manager",
    platforms: [activePlatform],
    phone: raw.phone,
    joinedAt: raw.createdAt ?? raw.lastLoginAt ?? new Date().toISOString(),
    active: raw.isActive ?? true,
    customRoleName: raw.accessRole?.name,
    accessRoleId: raw.accessRoleId,
  };
}

function normalizeCustomer(raw: Record<string, any>): Customer {
  return {
    id: raw.id,
    fullName: toFullName(raw),
    email: raw.email,
    phone: raw.phone ?? "",
    joinedAt: raw.createdAt ?? raw.lastLoginAt ?? new Date().toISOString(),
    lifetimeOrders: raw.lifetimeOrders ?? 0,
    lifetimeSpend: raw.lifetimeSpend ?? 0,
    rewardsBalance: raw.rewardsBalance ?? 0,
    city: raw.city,
    state: raw.state,
  };
}

export function useStaff(paramsOrEnabled: { q?: string; page?: number; limit?: number } | boolean = {}, enabled = true) {
  const params = typeof paramsOrEnabled === "boolean" ? {} : paramsOrEnabled;
  const isEnabled = typeof paramsOrEnabled === "boolean" ? paramsOrEnabled : enabled;
  const activePlatform = useAuthStore((s) => s.activePlatform);
  const page = params.page ?? 1;
  const limit = params.limit ?? DEFAULT_PAGE_SIZE;
  return useQuery({
    queryKey: qk.users(activePlatform, params),
    queryFn: async () => {
      const search = new URLSearchParams({
        roles: "ADMIN,MANAGER,ACCOUNTANT,CONSULTANT,DELIVERY_STAFF",
        page: String(page),
        limit: String(limit),
      });
      if (params.q?.trim()) search.set("search", params.q.trim());
      const { data } = await api.get<unknown[] | { items?: unknown[]; meta?: any }>(`/users?${search.toString()}`);
      const result = paginated(data, page, limit);
      return {
        items: result.items.map((item) => normalizeStaffUser(item as Record<string, any>, activePlatform)),
        meta: result.meta,
      };
    },
    enabled: isEnabled,
  });
}

export function useCustomers(params: { q?: string; page?: number; limit?: number; dateFrom?: string; dateTo?: string } = {}) {
  const activePlatform = useAuthStore((s) => s.activePlatform);
  const page = params.page ?? 1;
  const limit = params.limit ?? DEFAULT_PAGE_SIZE;
  return useQuery({
    queryKey: qk.customers(activePlatform, params),
    queryFn: async () => {
      const search = new URLSearchParams({ role: "CUSTOMER", page: String(page), limit: String(limit) });
      if (params.q?.trim()) search.set("search", params.q.trim());
      if (params.dateFrom) search.set("dateFrom", params.dateFrom);
      if (params.dateTo) search.set("dateTo", params.dateTo);
      const { data } = await api.get<unknown[] | { items?: unknown[]; meta?: any }>(`/users?${search.toString()}`);
      const result = paginated(data, page, limit);
      return {
        items: result.items.map((item) => normalizeCustomer(item as Record<string, any>)),
        meta: result.meta,
      };
    },
  });
}

/** Invite a new staff member by email on the active platform. Role is a backend enum value. */
export function useInviteStaff() {
  const qc = useQueryClient();
  const activePlatform = useAuthStore((s) => s.activePlatform);
  return useMutation({
    mutationFn: async (body: { name: string; email: string; role: string; accessRoleId?: string }) => {
      const { data } = await api.post("/users/invite", body);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.users(activePlatform) }),
  });
}

export function useRoles() {
  return useQuery({
    queryKey: ["roles"],
    queryFn: async () => {
      const { data } = await api.get<{ id: string; name: string; isSystem: boolean; description?: string; permissions?: { permission: { key: string, description: string } }[], _count?: { users: number } }[]>("/roles");
      return data;
    },
  });
}

export function usePermissions() {
  return useQuery({
    queryKey: ["permissions"],
    queryFn: async () => {
      const { data } = await api.get<{ id: string; key: string; description: string }[]>("/roles/permissions");
      return data;
    },
  });
}

export function useCreateRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: { name: string; description?: string; permissionIds: string[] }) => {
      const { data } = await api.post("/roles", body);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["roles"] })
  });
}

export function useUpdateRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, body }: { id: string; body: { name?: string; description?: string; permissionIds?: string[] } }) => {
      const { data } = await api.put(`/roles/${id}`, body);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["roles"] })
  });
}

export function useDeleteRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete(`/roles/${id}`);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["roles"] })
  });
}

export function useUpdateUserStatus() {
  const qc = useQueryClient();
  const activePlatform = useAuthStore((s) => s.activePlatform);
  return useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const { data } = await api.patch(`/users/${id}/status`, { isActive });
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.users(activePlatform) })
  });
}

export function useDeleteUser() {
  const qc = useQueryClient();
  const activePlatform = useAuthStore((s) => s.activePlatform);
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete(`/users/${id}`);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.users(activePlatform) })
  });
}

export function useUpdateUserRole() {
  const qc = useQueryClient();
  const activePlatform = useAuthStore((s) => s.activePlatform);
  return useMutation({
    mutationFn: async ({ id, body }: { id: string; body: { role: string; accessRoleId?: string } }) => {
      const { data } = await api.patch(`/users/${id}/role`, body);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.users(activePlatform) })
  });
}

/** Accept a staff invite (public): set password on the right platform, then auto sign-in. */
export function useAcceptInvite() {
  const setSessions = useAuthStore((s) => s.setSessions);
  return useMutation({
    mutationFn: async (body: { platform: Platform; token: string; password: string }) => {
      const { data } = await axios.post<BackendLoginResponse | { success: boolean; data: BackendLoginResponse }>(
        `${apiBaseForPlatform(body.platform)}/auth/accept-invite`,
        { token: body.token, password: body.password },
        { headers: { "Content-Type": "application/json", "x-platform": body.platform } },
      );
      const payload = unwrapPayload(data);
      const token = payload.accessToken ?? payload.token;
      if (!token) throw new Error("Invite accepted but no access token was returned.");
      const user = toSessionUser(payload.user, [body.platform]);
      const sessions: Partial<Record<Platform, PlatformSession>> = {
        [body.platform]: { user, token, refreshToken: payload.refreshToken },
      };
      setSessions(sessions, body.platform);
      return { user, activePlatform: body.platform } satisfies { user: SessionUser; activePlatform: Platform };
    },
  });
}
