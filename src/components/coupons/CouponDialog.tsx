import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/forms/FormInput";
import { FormSelect } from "@/components/forms/FormSelect";
import { useCreateCoupon } from "@/features/coupons/useCoupons";

const schema = z.object({
  code: z.string().min(2, "Code required").max(40),
  type: z.enum(["PERCENT", "FIXED"]),
  value: z.coerce.number().min(1),
  usageLimit: z.coerce.number().int().min(1),
  minOrder: z.coerce.number().min(0).optional(),
  maxDiscount: z.coerce.number().min(0).optional(),
  expiresAt: z.string().optional(),
});
type Values = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

export function CouponDialog({ open, onOpenChange }: Props) {
  const create = useCreateCoupon();
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { code: "", type: "PERCENT", value: 5, usageLimit: 1 },
  });
  const type = form.watch("type");

  async function submit(v: Values) {
    try {
      await create.mutateAsync({
        code: v.code.trim().toUpperCase(),
        type: v.type,
        // PERCENT: whole percent; FIXED: naira -> kobo.
        value: v.type === "FIXED" ? Math.round(v.value * 100) : Math.round(v.value),
        usageLimit: v.usageLimit,
        minOrderKobo: v.minOrder ? Math.round(v.minOrder * 100) : undefined,
        maxDiscountKobo:
          v.type === "PERCENT" && v.maxDiscount ? Math.round(v.maxDiscount * 100) : undefined,
        expiresAt: v.expiresAt || undefined,
      });
      toast.success("Coupon created");
      onOpenChange(false);
      form.reset({ code: "", type: "PERCENT", value: 5, usageLimit: 1 });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not create coupon");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>New coupon</DialogTitle>
          <DialogDescription>Codes are case-insensitive and applied at checkout.</DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(submit)} className="space-y-3">
          <FormInput
            label="Code"
            placeholder="e.g. WELCOME10"
            {...form.register("code")}
            error={form.formState.errors.code?.message}
          />
          <div className="grid grid-cols-2 gap-3">
            <Controller
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormSelect
                  label="Type"
                  value={field.value}
                  onChange={field.onChange}
                  options={[
                    { value: "PERCENT", label: "Percent off" },
                    { value: "FIXED", label: "Fixed amount" },
                  ]}
                />
              )}
            />
            <FormInput
              label={type === "PERCENT" ? "Discount (%)" : "Amount (₦)"}
              type="number"
              {...form.register("value")}
              error={form.formState.errors.value?.message}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <FormInput label="Usage limit" type="number" {...form.register("usageLimit")} error={form.formState.errors.usageLimit?.message} />
            <FormInput label="Expires (optional)" type="date" {...form.register("expiresAt")} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <FormInput label="Min order (₦, optional)" type="number" {...form.register("minOrder")} />
            {type === "PERCENT" && (
              <FormInput label="Max discount (₦, optional)" type="number" {...form.register("maxDiscount")} />
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={create.isPending}>
              {create.isPending ? "Creating…" : "Create coupon"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
