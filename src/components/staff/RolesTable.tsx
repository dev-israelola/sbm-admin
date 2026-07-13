import { useState } from "react";
import { Plus, ShieldAlert, Pencil, Trash } from "lucide-react";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRoles, useDeleteRole } from "@/features/auth/useAuth";
import { RoleDialog } from "@/components/staff/RoleDialog";
import { toast } from "sonner";

export function RolesTable() {
  const { data: roles, isLoading } = useRoles();
  const deleteRole = useDeleteRole();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<any>(null);

  const handleEdit = (role: any) => {
    setEditingRole(role);
    setDialogOpen(true);
  };

  const handleCreate = () => {
    setEditingRole(null);
    setDialogOpen(true);
  };

  const handleDelete = async (role: any) => {
    if (role.isSystem) return;
    if (confirm(`Are you sure you want to permanently delete the custom role "${role.name}"?`)) {
      try {
        await deleteRole.mutateAsync(role.id);
        toast.success("Custom role removed.");
      } catch (err: any) {
        toast.error(err.message || "Failed to remove role");
      }
    }
  };

  const columns: DataTableColumn<any>[] = [
    {
      key: "name",
      header: "Role Name",
      render: (r) => (
        <div>
          <p className="text-[13px] font-medium text-ink">{r.name}</p>
          {r.description && <p className="data-muted text-xs">{r.description}</p>}
        </div>
      ),
    },
    {
      key: "type",
      header: "Type",
      render: (r) => (
        <Badge variant={r.isSystem ? "soft" : "outline"}>
          {r.isSystem ? "System Default" : "Custom Role"}
        </Badge>
      ),
    },
    {
      key: "permissions",
      header: "Permissions",
      render: (r) => (
        <span className="text-[13px] text-ink-muted">
          {r.permissions?.length || 0} limits
        </span>
      ),
    },
    {
      key: "users",
      header: "Assigned Staff",
      align: "right",
      render: (r) => <span className="data-muted">{r._count?.users || 0} user(s)</span>,
    },
    {
      key: "actions",
      header: "",
      align: "right",
      render: (r) => (
        <div className="flex items-center justify-end gap-2">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleEdit(r)}>
            <Pencil className="h-4 w-4 text-ink-muted hover:text-ink" />
          </Button>
          {!r.isSystem && (
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => handleDelete(r)}>
              <Trash className="h-4 w-4" />
            </Button>
          )}
        </div>
      ),
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-ink-muted">
          Manage access levels and specific module permissions for your team.
        </p>
        <Button size="sm" onClick={handleCreate}>
          <Plus className="h-3.5 w-3.5" /> Create custom role
        </Button>
      </div>

      <DataTable
        rows={roles}
        columns={columns}
        loading={isLoading}
        rowKey={(r) => r.id}
        emptyState={
          <div className="flex flex-col items-center gap-2 py-4">
            <ShieldAlert className="h-5 w-5 text-ink-muted" />
            <span>No roles configured.</span>
          </div>
        }
      />

      <RoleDialog open={dialogOpen} onOpenChange={setDialogOpen} roleToEdit={editingRole} />
    </div>
  );
}
