import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { qk } from "@/lib/query-client";
import { useAuthStore } from "@/store/auth-store";

export type ReportId =
  | "sales"
  | "inventory"
  | "orders"
  | "refunds"
  | "delivery"
  | "pickup"
  | "customer"
  | "profit-loss"
  | "cash-collection"
  | "low-stock";

export type ReportRange = "today" | "7d" | "30d" | "90d" | "ytd";

export type ReportData = Record<string, unknown>;

const REPORT_ENDPOINTS: Record<ReportId, string> = {
  sales: "sales",
  inventory: "inventory",
  orders: "orders",
  refunds: "refunds",
  delivery: "delivery",
  pickup: "pickup",
  customer: "customers",
  "profit-loss": "profit-loss",
  "cash-collection": "cash-collection",
  "low-stock": "low-stock",
};

function startOfToday() {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
}

export interface DateRange {
  dateFrom: string;
  dateTo: string;
}

/** Resolves a preset range to ISO from/to dates. */
export function presetToDates(range: ReportRange): DateRange {
  const now = new Date();
  const from = new Date(now);

  if (range === "today") {
    from.setTime(startOfToday().getTime());
  } else if (range === "ytd") {
    from.setMonth(0, 1);
    from.setHours(0, 0, 0, 0);
  } else {
    const days = Number(range.replace("d", ""));
    from.setDate(now.getDate() - days);
  }

  return { dateFrom: from.toISOString(), dateTo: now.toISOString() };
}

export function reportRangeParams(range: ReportRange) {
  const { dateFrom, dateTo } = presetToDates(range);
  return new URLSearchParams({ dateFrom, dateTo, page: "1", limit: "25" });
}

export function reportEndpoint(reportId: ReportId) {
  return REPORT_ENDPOINTS[reportId];
}

export type ReportFormat = "pdf" | "csv" | "xlsx";

/** Fetches a server-generated report file (auth-attached) as a Blob. Omit `range` for all-time. */
export async function fetchReportFile(
  reportId: ReportId,
  range: DateRange | undefined,
  format: ReportFormat,
): Promise<Blob> {
  const params = new URLSearchParams({ format });
  if (range) {
    params.set("dateFrom", range.dateFrom);
    params.set("dateTo", range.dateTo);
  }
  const { data } = await api.get(`/reports/${reportEndpoint(reportId)}/export?${params.toString()}`, {
    responseType: "blob",
  });
  return data as Blob;
}

export function useReport(reportId: ReportId, range: DateRange) {
  const activePlatform = useAuthStore((s) => s.activePlatform);
  return useQuery({
    queryKey: qk.reports(activePlatform, `${reportId}:${range.dateFrom}:${range.dateTo}`),
    queryFn: async () => {
      const params = new URLSearchParams({
        dateFrom: range.dateFrom,
        dateTo: range.dateTo,
        page: "1",
        limit: "25",
      });
      const { data } = await api.get<ReportData>(`/reports/${reportEndpoint(reportId)}?${params.toString()}`);
      return data;
    },
  });
}
