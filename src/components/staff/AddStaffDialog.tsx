import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/forms/FormInput";
import { FormSelect } from "@/components/forms/FormSelect";
import { useInviteStaff } from "@/features/auth/useAuth";
import { useAuthStore } from "@/store/auth-store";

// Backend UserRole enum values + labels.
const ALL_ROLE_OPTIONS = [
  { value: "ADMIN", label: "Admin" },
  { value: "MANAGER", label: "Manager" },
  { value: "ACCOUNTANT", label: "Accountant" },
  { value: "CONSULTANT", label: "Consultant" },
  { value: "DELIVERY_STAFF", label: "Delivery staff" },
];

const schema = z.object({
  name: z.string().min(2, "Enter the staff member's name"),
  email: z.string().email("Enter a valid email"),
  role: z.string().min(2, "Choose a role"),
});
type Values = z.infer<typeof schema>;

export function AddStaffDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const invite = useInviteStaff();
  const currentRole = useAuthStore((s) => s.user?.role);
  // Managers can only invite non-privileged staff.
  const roleOptions =
    currentRole === "manager"
      ? ALL_ROLE_OPTIONS.filter((r) => r.value !== "ADMIN" && r.value !== "MANAGER")
      : ALL_ROLE_OPTIONS;

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", role: roleOptions[roleOptions.length - 1].value },
  });

  async function submit(v: Values) {
    try {
      await invite.mutateAsync(v);
      toast.success(`Invite sent to ${v.email}.`);
      onOpenChange(false);
      form.reset();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not send the invite.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add staff member</DialogTitle>
          <DialogDescription>
            They'll receive an email invite to set their password and activate their account.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(submit)} className="space-y-3">
          <FormInput label="Full name" {...form.register("name")} error={form.formState.errors.name?.message} />
          <FormInput label="Email" type="email" {...form.register("email")} error={form.formState.errors.email?.message} />
          <Controller
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormSelect
                label="Role"
                value={field.value}
                onChange={field.onChange}
                options={roleOptions}
                error={form.formState.errors.role?.message}
              />
            )}
          />
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={invite.isPending}>
              {invite.isPending ? "Sending…" : "Send invite"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
