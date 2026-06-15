import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { qk } from "@/lib/query-client";
import { useAuthStore } from "@/store/auth-store";
import type { AdminNotification, NotificationList } from "@/types/notification";

type RawNotification = Record<string, any>;

function normalizeNotification(raw: RawNotification): AdminNotification {
  return {
    id: String(raw.id),
    type: String(raw.type ?? "notification"),
    title: String(raw.title ?? "Notification"),
    body: raw.body ? String(raw.body) : undefined,
    resourceType: raw.resourceType ?? null,
    resourceId: raw.resourceId ?? null,
    readAt: raw.readAt ?? null,
    createdAt: String(raw.createdAt ?? new Date().toISOString()),
  };
}

export function useNotifications(limit = 8) {
  const activePlatform = useAuthStore((s) => s.activePlatform);
  const token = useAuthStore((s) => s.token);

  return useQuery({
    queryKey: qk.notifications(activePlatform),
    enabled: Boolean(token),
    queryFn: async (): Promise<NotificationList> => {
      const { data } = await api.get<{ items?: RawNotification[]; unreadCount?: number }>(
        `/notifications?limit=${limit}`,
      );
      return {
        items: (data.items ?? []).map(normalizeNotification),
        unreadCount: Number(data.unreadCount ?? 0),
      };
    },
    refetchInterval: 60_000,
  });
}

export function useMarkNotificationRead() {
  const activePlatform = useAuthStore((s) => s.activePlatform);
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.post(`/notifications/${id}/read`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.notifications(activePlatform) });
    },
  });
}

export function useMarkAllNotificationsRead() {
  const activePlatform = useAuthStore((s) => s.activePlatform);
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await api.post("/notifications/read-all");
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.notifications(activePlatform) });
    },
  });
}
