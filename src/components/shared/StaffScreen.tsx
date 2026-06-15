import { useState } from "react";
import { UserPlus, Users } from "lucide-react";
import { FilterBar } from "@/components/ui/filter-bar";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AddStaffDialog } from "@/components/staff/AddStaffDialog";
import { useStaff } from "@/features/auth/useAuth";
import { PaginationFooter } from "@/components/ui/pagination-footer";
import { DEFAULT_PAGE_SIZE } from "@/lib/pagination";
import { formatDate } from "@/lib/format";
import { ROLE_LABEL } from "@/types/role";
import type { StaffUser } from "@/types/user";

export function StaffScreen() {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const { data, isLoading } = useStaff({ q, page, limit: DEFAULT_PAGE_SIZE });
  const [adding, setAdding] = useState(false);

  const columns: DataTableColumn<StaffUser>[] = [
    {
      key: "name",
      header: "Name",
      render: (u) => (
        <div>
          <p className="text-[13px] font-medium text-ink">{u.fullName}</p>
          <p className="data-muted">{u.email}</p>
        </div>
      ),
    },
    { key: "role", header: "Role", render: (u) => <Badge variant="soft">{ROLE_LABEL[u.role]}</Badge> },
    {
      key: "status",
      header: "Status",
      render: (u) => (
        <Badge variant={u.active ? "success" : "warn"}>{u.active ? "Active" : "Invite pending"}</Badge>
      ),
    },
    { key: "joined", header: "Added", align: "right", render: (u) => <span className="data-muted">{formatDate(u.joinedAt)}</span> },
  ];

  return (
    <div>
      <PageHeader
        eyebrow="System"
        title="Team"
        description="Manage staff accounts. Invite new members by email — they set their own password."
        actions={
          <Button size="sm" onClick={() => setAdding(true)}>
            <UserPlus className="h-3.5 w-3.5" /> Add staff
          </Button>
        }
      />
      <FilterBar
        searchValue={q}
        onSearchChange={(value) => {
          setQ(value);
          setPage(1);
        }}
        searchPlaceholder="Search name or email…"
        className="mb-4"
      />
      <DataTable
        rows={data?.items}
        columns={columns}
        loading={isLoading}
        rowKey={(u) => u.id}
        emptyState={
          <div className="flex flex-col items-center gap-2 py-4">
            <Users className="h-5 w-5 text-ink-muted" />
            <span>No staff yet.</span>
          </div>
        }
      />
      <PaginationFooter meta={data?.meta} page={page} loading={isLoading} itemLabel="staff" onPageChange={setPage} />

      <AddStaffDialog open={adding} onOpenChange={setAdding} />
    </div>
  );
}
