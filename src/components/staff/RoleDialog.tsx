import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/forms/FormInput";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { usePermissions, useCreateRole, useUpdateRole } from "@/features/auth/useAuth";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
});

type Values = z.infer<typeof schema>;

export function RoleDialog({ open, onOpenChange, roleToEdit }: { open: boolean, onOpenChange: (v: boolean) => void, roleToEdit?: any }) {
  const { data: allPermissions, isLoading: permsLoading } = usePermissions();
  const create = useCreateRole();
  const update = useUpdateRole();
  
  const [selectedPerms, setSelectedPerms] = useState<string[]>([]);

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", description: "" },
  });

  useEffect(() => {
    if (open) {
      if (roleToEdit) {
        form.reset({ name: roleToEdit.name, description: roleToEdit.description || "" });
        const existingIds = roleToEdit.permissions?.map((p: any) => p.permission?.id).filter(Boolean) || [];
        setSelectedPerms(existingIds);
      } else {
        form.reset({ name: "", description: "" });
        setSelectedPerms([]);
      }
    }
  }, [open, roleToEdit, form]);

  const togglePermission = (id: string, checked: boolean) => {
    setSelectedPerms(prev => checked ? [...prev, id] : prev.filter(p => p !== id));
  };

  async function submit(v: Values) {
    try {
      if (roleToEdit) {
        await update.mutateAsync({ 
          id: roleToEdit.id, 
          body: { ...v, permissionIds: selectedPerms } 
        });
        toast.success("Role updated securely.");
      } else {
        await create.mutateAsync({ ...v, permissionIds: selectedPerms });
        toast.success("Custom role deployed.");
      }
      onOpenChange(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save the role.");
    }
  }

  const isSystem = roleToEdit?.isSystem;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{roleToEdit ? "Edit Staff Role" : "Create Custom Role"}</DialogTitle>
          <DialogDescription>
            {isSystem ? "System roles are strictly managed. You can only adjust description and permissions." : "Assemble the precise access constraints for this custom persona."}
          </DialogDescription>
        </DialogHeader>

        <form id="role-form" onSubmit={form.handleSubmit(submit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Controller
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormInput
                  label="Role Name"
                  {...field}
                  error={form.formState.errors.name?.message}
                  disabled={isSystem} // Cannot rename system default roles to prevent breaking code
                  placeholder="e.g. Content Writer"
                />
              )}
            />
            <Controller
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormInput
                  label="Description"
                  {...field}
                  error={form.formState.errors.description?.message}
                  placeholder="Internal summary"
                />
              )}
            />
          </div>

          <div className="pt-2">
            <h4 className="text-sm font-semibold text-ink mb-3">Permissions</h4>
            {permsLoading ? (
              <p className="text-sm text-ink-muted">Loading available permissions...</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto px-1">
                {allPermissions?.map((perm) => (
                  <div key={perm.id} className="flex items-start space-x-2 border rounded-md border-surface-active p-2">
                    <Checkbox
                      id={perm.id}
                      checked={selectedPerms.includes(perm.id)}
                      onCheckedChange={(checked) => togglePermission(perm.id, checked as boolean)}
                    />
                    <div className="grid gap-1.5 leading-none mt-0.5">
                      <label
                        htmlFor={perm.id}
                        className="text-[13px] font-medium leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {perm.key}
                      </label>
                      <p className="text-[11px] text-ink-muted">
                        {perm.description || "System functional access"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </form>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button type="submit" form="role-form" disabled={create.isPending || update.isPending}>
            {roleToEdit ? "Save Configuration" : "Deploy Role"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
