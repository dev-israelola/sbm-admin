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
import { useAdjustInventory } from "@/features/products/useProducts";
import { useAuthStore } from "@/store/auth-store";

const schema = z.object({
  action: z.enum(["add", "subtract", "damaged"]),
  quantity: z.coerce.number().int().min(1, "Required"),
  reason: z.string().min(3, "Reason needed"),
});
type Values = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  productId: string;
  productName: string;
}

export function InventoryAdjustDialog({ open, onOpenChange, productId, productName }: Props) {
  const user = useAuthStore((s) => s.user);
  const adjust = useAdjustInventory();
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { action: "add", quantity: 1, reason: "" },
  });

  async function submit(v: Values) {
    const delta = v.action === "add" ? v.quantity : -v.quantity;
    await adjust.mutateAsync({ id: productId, delta, reason: v.reason, by: user?.fullName ?? "Admin" });
    toast.success(`Stock ${v.action === "add" ? "added" : "adjusted"} for ${productName}.`);
    onOpenChange(false);
    form.reset();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Adjust stock</DialogTitle>
          <DialogDescription>{productName}. Adjustments are logged in the movement history.</DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(submit)} className="space-y-3">
          <Controller
            control={form.control}
            name="action"
            render={({ field }) => (
              <FormSelect
                label="Action"
                value={field.value}
                onChange={field.onChange}
                options={[
                  { value: "add", label: "Add stock (restock)" },
                  { value: "subtract", label: "Subtract (stocktake)" },
                  { value: "damaged", label: "Mark damaged" },
                ]}
              />
            )}
          />
          <FormInput
            label="Quantity"
            type="number"
            {...form.register("quantity")}
            error={form.formState.errors.quantity?.message}
          />
          <FormTextarea
            label="Reason / note"
            placeholder="Required for the audit trail."
            {...form.register("reason")}
            error={form.formState.errors.reason?.message}
          />

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={adjust.isPending}>
              {adjust.isPending ? "Saving…" : "Save adjustment"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
