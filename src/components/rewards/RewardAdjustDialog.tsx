import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/forms/FormInput";
import { FormTextarea } from "@/components/forms/FormTextarea";
import { FormSelect } from "@/components/forms/FormSelect";
import { useAdjustRewards } from "@/features/rewards/useRewards";
import { useAuthStore } from "@/store/auth-store";

const schema = z.object({
  direction: z.enum(["add", "deduct"]),
  amount: z.coerce.number().int().min(1),
  reason: z.string().min(4, "Reason required"),
});
type Values = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  customerId: string;
  customerName: string;
}

export function RewardAdjustDialog({ open, onOpenChange, customerId, customerName }: Props) {
  const adjust = useAdjustRewards();
  const user = useAuthStore((s) => s.user);
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { direction: "add", amount: 50, reason: "" },
  });

  async function submit(v: Values) {
    const delta = v.direction === "add" ? v.amount : -v.amount;
    await adjust.mutateAsync({ customerId, delta, reason: v.reason, by: user?.fullName ?? "Admin" });
    toast.success(`${customerName}: ${v.direction === "add" ? "+" : "-"}${v.amount} pts`);
    onOpenChange(false);
    form.reset();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Adjust reward points</DialogTitle>
          <DialogDescription>
            Manual adjustments are logged in the customer's activity timeline.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(submit)} className="space-y-3">
          <Controller
            control={form.control}
            name="direction"
            render={({ field }) => (
              <FormSelect
                label="Direction"
                value={field.value}
                onChange={field.onChange}
                options={[
                  { value: "add", label: "Add points" },
                  { value: "deduct", label: "Deduct points" },
                ]}
              />
            )}
          />
          <FormInput label="Amount" type="number" {...form.register("amount")} error={form.formState.errors.amount?.message} />
          <FormTextarea label="Reason" placeholder="Required for audit trail." {...form.register("reason")} error={form.formState.errors.reason?.message} />
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={adjust.isPending}>{adjust.isPending ? "Saving…" : "Save adjustment"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
