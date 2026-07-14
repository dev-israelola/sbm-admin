import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { qk } from "@/lib/query-client";
import { DEFAULT_PAGE_SIZE, paginated } from "@/lib/pagination";
import { useAuthStore } from "@/store/auth-store";

export interface FrontendAuditLog {
  id: string;
  actorName: string;
  actorEmail: string;
  actorRole: string;
  action: string;
  resourceType?: string;
  resourceId?: string;
  beforeData?: any;
  afterData?: any;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

function normalizeAuditLog(raw: any): FrontendAuditLog {
  const actor = raw.actorUser || {};
  return {
    id: raw.id,
    actorName: actor.fullName || actor.firstName || "System Action",
    actorEmail: actor.email || "system",
    actorRole: actor.role || "SYSTEM",
    action: raw.action,
    resourceType: raw.resourceType,
    resourceId: raw.resourceId,
    beforeData: raw.beforeData,
    afterData: raw.afterData,
    ipAddress: raw.ipAddress,
    userAgent: raw.userAgent,
    createdAt: raw.createdAt,
  };
}

export function useAuditLogs(params: { page?: number; limit?: number; dateFrom?: string; dateTo?: string } = {}) {
  const activePlatform = useAuthStore((s) => s.activePlatform);
  const page = params.page ?? 1;
  const limit = params.limit ?? DEFAULT_PAGE_SIZE;
  return useQuery({
    queryKey: qk.auditLogs(activePlatform, params),
    queryFn: async () => {
      const search = new URLSearchParams();
      search.set("page", String(page));
      search.set("limit", String(limit));
      if (params.dateFrom) search.set("dateFrom", params.dateFrom);
      if (params.dateTo) search.set("dateTo", params.dateTo);
      const { data } = await api.get<unknown[] | { items?: unknown[]; meta?: any }>(`/audit-logs?${search.toString()}`);
      const result = paginated(data, page, limit);
      return {
        items: result.items.map((item) => normalizeAuditLog(item)),
        meta: result.meta,
      };
    },
  });
}
