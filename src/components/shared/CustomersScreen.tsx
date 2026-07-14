import { useState } from "react";
import { Users } from "lucide-react";
import { FilterBar } from "@/components/ui/filter-bar";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { PageHeader } from "@/components/layout/PageHeader";
import { MoneyDisplay } from "@/components/ui/money";
import { DateRangeFilter } from "@/components/shared/DateRangeFilter";
import { useCustomers } from "@/features/auth/useAuth";
import { PaginationFooter } from "@/components/ui/pagination-footer";
import { DEFAULT_PAGE_SIZE } from "@/lib/pagination";
import { formatDate } from "@/lib/format";
import type { Customer } from "@/types/user";

export function CustomersScreen() {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [dateFrom, setDateFrom] = useState<string | undefined>();
  const [dateTo, setDateTo] = useState<string | undefined>();

  const { data, isLoading } = useCustomers({ q, dateFrom, dateTo, page, limit: DEFAULT_PAGE_SIZE });

  const columns: DataTableColumn<Customer>[] = [
    {
      key: "name",
      header: "Customer",
      render: (c) => (
        <div>
          <p className="text-[13px] font-medium text-ink">{c.fullName}</p>
          <p className="data-muted">{c.email}</p>
        </div>
      ),
    },
    { key: "loc", header: "Location", render: (c) => <span className="data-cell">{c.city ? `${c.city}, ${c.state}` : "—"}</span> },
    { key: "orders", header: "Orders", align: "right", render: (c) => <span className="tabular-nums">{c.lifetimeOrders}</span> },
    { key: "spend", header: "Lifetime spend", align: "right", render: (c) => <MoneyDisplay value={c.lifetimeSpend} className="font-medium" /> },
    { key: "rew", header: "Points", align: "right", render: (c) => <span className="tabular-nums text-ink-muted">{c.rewardsBalance}</span> },
    { key: "joined", header: "Joined", align: "right", render: (c) => <span className="data-muted">{formatDate(c.joinedAt)}</span> },
  ];

  return (
    <div>
      <PageHeader eyebrow="Catalog" title="Customers" description="Customer accounts and lifetime activity." />
      <FilterBar
        searchValue={q}
        onSearchChange={(value) => {
          setQ(value);
          setPage(1);
        }}
        searchPlaceholder="Search name or email…"
        className="mb-4"
      >
        <DateRangeFilter
          onRangeChange={(range) => {
            setDateFrom(range.dateFrom);
            setDateTo(range.dateTo);
            setPage(1);
          }}
        />
      </FilterBar>
      <DataTable
        rows={data?.items}
        columns={columns}
        loading={isLoading}
        rowKey={(c) => c.id}
        emptyState={
          <div className="flex flex-col items-center gap-2 py-4">
            <Users className="h-5 w-5 text-ink-muted" />
            <span>No customers match the filters.</span>
          </div>
        }
      />
      <PaginationFooter meta={data?.meta} page={page} loading={isLoading} itemLabel="customers" onPageChange={setPage} />
    </div>
  );
}
