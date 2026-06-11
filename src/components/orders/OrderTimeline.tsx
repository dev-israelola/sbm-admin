import { Check } from "lucide-react";
import type { OrderTimelineEntry } from "@/types/order";
import { formatDateTime } from "@/lib/format";
import { ORDER_STATUS_COPY } from "./status-badges";
import { cn } from "@/lib/utils";

export function OrderTimeline({ entries }: { entries: OrderTimelineEntry[] }) {
  return (
    <ol className="relative pl-7">
      <span className="absolute left-3 top-1 bottom-1 w-px bg-line" aria-hidden />
      {entries.map((e, idx) => {
        const copy = ORDER_STATUS_COPY[e.status];
        const last = idx === entries.length - 1;
        return (
          <li key={idx} className={cn("relative", !last && "pb-5")}>
            <span
              className={cn(
                "absolute -left-7 top-0.5 grid place-items-center h-5 w-5 rounded-full border",
                last ? "bg-accent text-accent-ink border-accent" : "bg-surface border-line text-ink-muted",
              )}
            >
              <Check className="h-3 w-3" strokeWidth={3} />
            </span>
            <div className="flex items-baseline justify-between flex-wrap gap-2">
              <p className="text-[13px] font-medium text-ink">{copy.title}</p>
              <p className="text-[11px] text-ink-muted tabular-nums">{formatDateTime(e.timestamp)}</p>
            </div>
            <p className="text-[12px] text-ink-muted leading-relaxed">
              {e.note ?? copy.body} {e.by && <span className="text-ink-muted/70">· {e.by}</span>}
            </p>
          </li>
        );
      })}
    </ol>
  );
}
