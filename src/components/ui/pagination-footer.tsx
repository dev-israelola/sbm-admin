import { Button } from "@/components/ui/button";
import type { PaginationMeta } from "@/lib/pagination";

interface PaginationFooterProps {
  meta?: PaginationMeta;
  page: number;
  loading?: boolean;
  itemLabel: string;
  onPageChange: (page: number) => void;
}

export function PaginationFooter({ meta, page, loading, itemLabel, onPageChange }: PaginationFooterProps) {
  const current = meta?.page ?? page;
  const limit = meta?.limit ?? 20;
  const total = meta?.total ?? 0;
  const start = total === 0 ? 0 : (current - 1) * limit + 1;
  const end = total === 0 ? 0 : Math.min(current * limit, total);

  return (
    <div className="mt-4 flex flex-col gap-2 text-[12px] text-ink-muted sm:flex-row sm:items-center sm:justify-between">
      <span>
        {loading
          ? `Loading ${itemLabel}...`
          : total === 0
            ? `No ${itemLabel} found`
            : `Showing ${start}-${end} of ${total} ${itemLabel}`}
      </span>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          size="xs"
          variant="outline"
          disabled={loading || !meta?.hasPrev}
          onClick={() => onPageChange(Math.max(1, current - 1))}
        >
          Previous
        </Button>
        <span className="min-w-20 text-center">
          Page {current} of {meta?.totalPages ?? 1}
        </span>
        <Button
          type="button"
          size="xs"
          variant="outline"
          disabled={loading || !meta?.hasNext}
          onClick={() => onPageChange(current + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
