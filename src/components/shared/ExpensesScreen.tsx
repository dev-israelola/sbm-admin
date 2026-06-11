import { useMemo, useState } from "react";
import { CreditCard, Plus } from "lucide-react";
import { FilterBar } from "@/components/ui/filter-bar";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { PageHeader } from "@/components/layout/PageHeader";
import { MoneyDisplay } from "@/components/ui/money";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useExpenses } from "@/features/accounting/useAccounting";
import { ExpenseDialog } from "@/components/accounting/ExpenseDialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { EXPENSE_CATEGORY_LABEL, type Expense } from "@/types/accounting";
import { formatDate } from "@/lib/format";

export function ExpensesScreen() {
  const { data, isLoading } = useExpenses();
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("all");
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => {
    if (!data) return undefined;
    const s = q.toLowerCase();
    return data.filter((e) => {
      if (s && !`${e.title} ${e.vendor ?? ""}`.toLowerCase().includes(s)) return false;
      if (category !== "all" && e.category !== category) return false;
      return true;
    });
  }, [data, q, category]);

  const columns: DataTableColumn<Expense>[] = [
    { key: "title", header: "Title", render: (e) => (
      <div>
        <p className="text-[13px] font-medium text-ink">{e.title}</p>
        <p className="data-muted">{e.vendor ?? "—"}</p>
      </div>
    ) },
    { key: "cat", header: "Category", render: (e) => <Badge variant="soft">{EXPENSE_CATEGORY_LABEL[e.category]}</Badge> },
    { key: "amt", header: "Amount", align: "right", render: (e) => <MoneyDisplay value={e.amount} className="font-medium" /> },
    { key: "pm", header: "Method", render: (e) => <span className="data-muted">{e.paymentMethod}</span> },
    { key: "by", header: "Recorded by", render: (e) => <span className="data-muted">{e.recordedBy}</span> },
    { key: "date", header: "Date", align: "right", render: (e) => <span className="data-muted">{formatDate(e.date)}</span> },
  ];

  return (
    <div>
      <PageHeader
        eyebrow="Accounting"
        title="Expenses"
        description="Operating costs — product, packaging, delivery, marketing, staff, platform charges."
        actions={
          <Button size="sm" onClick={() => setOpen(true)}>
            <Plus className="h-3.5 w-3.5" /> Log expense
          </Button>
        }
      />
      <FilterBar searchValue={q} onSearchChange={setQ} searchPlaceholder="Search expense or vendor…" className="mb-4">
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-44 h-9 text-[12px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {Object.entries(EXPENSE_CATEGORY_LABEL).map(([k, l]) => (
              <SelectItem key={k} value={k}>{l}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FilterBar>
      <DataTable
        rows={filtered}
        columns={columns}
        loading={isLoading}
        rowKey={(e) => e.id}
        dense
        emptyState={
          <div className="flex flex-col items-center gap-2 py-4">
            <CreditCard className="h-5 w-5 text-ink-muted" />
            <span>No expenses match the filters.</span>
          </div>
        }
      />

      <ExpenseDialog open={open} onOpenChange={setOpen} />
    </div>
  );
}
