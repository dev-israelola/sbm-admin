import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/forms/FormInput";
import { FormSelect } from "@/components/forms/FormSelect";
import { useUpdateUserRole, useRoles } from "@/features/auth/useAuth";
import { toast } from "sonner";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  role: z.string().min(1, "Please select an access role"),
});

type Values = z.infer<typeof schema>;

export function EditStaffDialog({ open, onOpenChange, userToEdit }: { open: boolean; onOpenChange: (v: boolean) => void; userToEdit?: any }) {
  const updateRole = useUpdateUserRole();
  const { data: dynamicRoles, isLoading: rolesLoading } = useRoles();
  
  const dynamicOptions = dynamicRoles?.map((r) => ({
    value: r.id, 
    label: r.name 
  })) || [];

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", role: "" },
  });

  useEffect(() => {
    if (open && userToEdit) {
      form.reset({
        name: userToEdit.fullName || "",
        email: userToEdit.email,
        role: userToEdit.accessRoleId || "", // Wait, userToEdit doesnt have accessRoleId exposed yet! We use userToEdit.role? No, the new system uses accessRole. Wait, if accessRoleId is missing, we shouldn't crash.
      });
    }
  }, [open, userToEdit, form]);

  async function submit(v: Values) {
    if (!userToEdit) return;
    try {
      const selectedRole = dynamicRoles?.find(r => r.id === v.role);
      let baseFallback = "MANAGER";
      
      if (selectedRole) {
         const n = selectedRole.name.toLowerCase();
         if (n.includes('admin')) baseFallback = "ADMIN";
         else if (n.includes('accountant') || n.includes('finance')) baseFallback = "ACCOUNTANT";
         else if (n.includes('consultant')) baseFallback = "CONSULTANT";
         else if (n.includes('delivery') || n.includes('dispatch')) baseFallback = "DELIVERY_STAFF";
      }

      await updateRole.mutateAsync({
         id: userToEdit.id,
         body: {
           role: baseFallback,
           accessRoleId: v.role
         }
      });
      toast.success(`Role updated for ${v.name}.`);
      onOpenChange(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update the user role.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Staff Assignment</DialogTitle>
          <DialogDescription>
            Change the assigned operational role for this staff member.
          </DialogDescription>
        </DialogHeader>
        <form id="edit-staff-form" onSubmit={form.handleSubmit(submit)} className="space-y-4">
          <Controller
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormInput label="Full Name" {...field} disabled error={form.formState.errors.name?.message} />
            )}
          />
          <Controller
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormInput label="Email address" type="email" {...field} disabled error={form.formState.errors.email?.message} />
            )}
          />
          <Controller
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormSelect
                label={rolesLoading ? "Loading roles..." : "Assigned Role"}
                value={field.value}
                onChange={field.onChange}
                options={dynamicOptions}
                error={form.formState.errors.role?.message}
                disabled={rolesLoading}
              />
            )}
          />
        </form>
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button type="submit" form="edit-staff-form" disabled={updateRole.isPending || rolesLoading}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
