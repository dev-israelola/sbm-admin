import { useState } from "react";
import { UserPlus, Users, MoreHorizontal, Pencil, ShieldOff, Trash } from "lucide-react";
import { FilterBar } from "@/components/ui/filter-bar";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AddStaffDialog } from "@/components/staff/AddStaffDialog";
import { EditStaffDialog } from "@/components/staff/EditStaffDialog";
import { RolesTable } from "@/components/staff/RolesTable";
import { useStaff, useUpdateUserStatus, useDeleteUser } from "@/features/auth/useAuth";
import { useAuthStore } from "@/store/auth-store";
import { toast } from "sonner";
import { PaginationFooter } from "@/components/ui/pagination-footer";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DEFAULT_PAGE_SIZE } from "@/lib/pagination";
import { formatDate } from "@/lib/format";
import { ROLE_LABEL } from "@/types/role";
import type { StaffUser } from "@/types/user";

export function StaffScreen() {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const { data, isLoading } = useStaff({ q, page, limit: DEFAULT_PAGE_SIZE });
  const [adding, setAdding] = useState(false);
  const [editingUser, setEditingUser] = useState<StaffUser | null>(null);

  const currentUser = useAuthStore((s) => s.user);
  const isSuperAdmin = currentUser?.role === "admin";
  
  const updateStatus = useUpdateUserStatus();
  const deleteUser = useDeleteUser();

  const handleRevoke = async (user: StaffUser) => {
    try {
      await updateStatus.mutateAsync({ id: user.id, isActive: !user.active });
      toast.success(`Access ${user.active ? "revoked" : "restored"} for ${user.fullName}`);
    } catch (e: any) {
      toast.error(e.message || "Failed to update status");
    }
  };

  const handleDelete = async (user: StaffUser) => {
    if (confirm(`Are you sure you want to completely remove ${user.fullName}?`)) {
      try {
        await deleteUser.mutateAsync(user.id);
        toast.success("Staff profile permanently removed.");
      } catch (e: any) {
        toast.error(e.message || "Failed to delete user");
      }
    }
  };

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
    { key: "role", header: "Role", render: (u) => <Badge variant="soft">{u.customRoleName || ROLE_LABEL[u.role]}</Badge> },
    {
      key: "status",
      header: "Status",
      render: (u) => (
        <Badge variant={u.active ? "success" : "warn"}>{u.active ? "Active" : "Suspended"}</Badge>
      ),
    },
    { key: "joined", header: "Added", align: "right", render: (u) => <span className="data-muted">{formatDate(u.joinedAt)}</span> },
    {
      key: "actions",
      header: "",
      align: "right",
      render: (u) => (
        isSuperAdmin ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4 text-ink-muted" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setEditingUser(u)}>
                <Pencil className="mr-2 h-4 w-4" /> Edit Role
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleRevoke(u)}>
                <ShieldOff className="mr-2 h-4 w-4" /> {u.active ? 'Revoke Access' : 'Restore Access'}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-500 hover:text-red-600 focus:text-red-600 focus:bg-red-50" onClick={() => handleDelete(u)}>
                <Trash className="mr-2 h-4 w-4" /> Delete Member
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null
      ),
    }
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
      <Tabs defaultValue="members" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="members">Members</TabsTrigger>
          {isSuperAdmin && <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>}
        </TabsList>

        <TabsContent value="members" className="m-0 space-y-4">
          <FilterBar
            searchValue={q}
            onSearchChange={(value) => {
              setQ(value);
              setPage(1);
            }}
            searchPlaceholder="Search name or email…"
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
        </TabsContent>

        {isSuperAdmin && (
          <TabsContent value="roles" className="m-0">
            <RolesTable />
          </TabsContent>
        )}
      </Tabs>

      <AddStaffDialog open={adding} onOpenChange={setAdding} />
      <EditStaffDialog open={!!editingUser} onOpenChange={(val) => !val && setEditingUser(null)} userToEdit={editingUser} />
    </div>
  );
}
