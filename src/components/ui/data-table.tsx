import type * as React from "react";
import { Skeleton } from "./skeleton";
import { cn } from "@/lib/utils";

export interface DataTableColumn<T> {
  key: string;
  header: React.ReactNode;
  render: (row: T) => React.ReactNode;
  width?: string;
  align?: "left" | "right" | "center";
  className?: string;
}

interface DataTableProps<T> {
  rows: T[] | undefined;
  columns: DataTableColumn<T>[];
  loading?: boolean;
  rowKey: (row: T) => string;
  onRowClick?: (row: T) => void;
  emptyState?: React.ReactNode;
  className?: string;
  dense?: boolean;
}

export function DataTable<T>({
  rows,
  columns,
  loading,
  rowKey,
  onRowClick,
  emptyState,
  className,
  dense,
}: DataTableProps<T>) {
  return (
    <div className={cn("card overflow-hidden", className)}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="bg-surface-muted/70 text-[11px] uppercase tracking-[0.14em] text-ink-muted">
              {columns.map((c) => (
                <th
                  key={c.key}
                  style={{ width: c.width }}
                  className={cn(
                    "whitespace-nowrap px-4 py-3 text-left font-medium sm:px-5",
                    c.align === "right" && "text-right",
                    c.align === "center" && "text-center",
                  )}
                >
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={i} className="border-t border-line/60">
                  {columns.map((c) => (
                    <td key={c.key} className="px-4 py-3 sm:px-5">
                      <Skeleton className="h-3.5 w-2/3" />
                    </td>
                  ))}
                </tr>
              ))
            ) : !rows || rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-12 text-center text-sm text-ink-muted sm:px-5">
                  {emptyState ?? "No records found."}
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr
                  key={rowKey(row)}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  className={cn(
                    "border-t border-line/60 transition-colors",
                    onRowClick && "cursor-pointer hover:bg-surface-muted/60",
                  )}
                >
                  {columns.map((c) => (
                    <td
                      key={c.key}
                      className={cn(
                        "px-4 align-middle sm:px-5",
                        dense ? "py-2.5" : "py-3.5",
                        c.align === "right" && "text-right",
                        c.align === "center" && "text-center",
                        c.className,
                      )}
                    >
                      {c.render(row)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
