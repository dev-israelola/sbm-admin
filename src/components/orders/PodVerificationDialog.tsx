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
import { FormSelect } from "@/components/forms/FormSelect";
import { FormTextarea } from "@/components/forms/FormTextarea";
import { FormInput } from "@/components/forms/FormInput";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useVerifyPod } from "@/features/orders/useOrders";
import { useAuthStore } from "@/store/auth-store";

const schema = z.object({
  result: z.enum(["verified", "rejected"]),
  contactMethod: z.enum(["Phone", "WhatsApp", "Email"]),
  expectedDelivery: z.string().optional(),
  note: z.string().min(5, "Tell the team what happened (5+ chars)."),
});
type Values = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  orderId: string;
  orderNumber: string;
  customerName: string;
}

export function PodVerificationDialog({ open, onOpenChange, orderId, orderNumber, customerName }: Props) {
  const verify = useVerifyPod();
  const user = useAuthStore((s) => s.user);
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { result: "verified", contactMethod: "Phone", note: "" },
  });

  async function submit(values: Values) {
    await verify.mutateAsync({
      id: orderId,
      result: values.result,
      note: values.note,
      contactMethod: values.contactMethod,
      expectedDelivery: values.expectedDelivery,
      by: user?.fullName ?? "Admin",
    });
    toast.success(
      values.result === "verified" ? `Order ${orderNumber} verified.` : `Order ${orderNumber} cancelled.`,
      { description: values.result === "rejected" ? "Reserved stock released." : undefined },
    );
    onOpenChange(false);
    form.reset();
  }

  const result = form.watch("result");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Verify POD order</DialogTitle>
          <DialogDescription>
            {orderNumber} · {customerName}. Contact the customer to confirm before fulfilment.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(submit)} className="space-y-4">
          <Controller
            control={form.control}
            name="result"
            render={({ field }) => (
              <RadioGroup value={field.value} onValueChange={field.onChange} className="grid gap-2 sm:grid-cols-2">
                <Label
                  htmlFor="vr-yes"
                  className={`flex items-start gap-2 rounded-lg border p-3 cursor-pointer ${field.value === "verified" ? "border-accent bg-accent/5" : "border-line hover:border-ink/30"}`}
                >
                  <RadioGroupItem id="vr-yes" value="verified" className="mt-0.5" />
                  <span className="flex flex-col gap-0.5">
                    <span className="text-[13px] font-medium text-ink">Verified</span>
                    <span className="text-[11px] text-ink-muted">Move to fulfilment.</span>
                  </span>
                </Label>
                <Label
                  htmlFor="vr-no"
                  className={`flex items-start gap-2 rounded-lg border p-3 cursor-pointer ${field.value === "rejected" ? "border-danger bg-danger/5" : "border-line hover:border-ink/30"}`}
                >
                  <RadioGroupItem id="vr-no" value="rejected" className="mt-0.5" />
                  <span className="flex flex-col gap-0.5">
                    <span className="text-[13px] font-medium text-ink">Rejected</span>
                    <span className="text-[11px] text-ink-muted">Cancel & release stock.</span>
                  </span>
                </Label>
              </RadioGroup>
            )}
          />

          <Controller
            control={form.control}
            name="contactMethod"
            render={({ field, fieldState }) => (
              <FormSelect
                label="Contact method"
                value={field.value}
                onChange={field.onChange}
                options={[
                  { value: "Phone", label: "Phone" },
                  { value: "WhatsApp", label: "WhatsApp" },
                  { value: "Email", label: "Email" },
                ]}
                error={fieldState.error?.message}
              />
            )}
          />

          {result === "verified" && (
            <FormInput
              label="Expected delivery date"
              type="date"
              {...form.register("expectedDelivery")}
            />
          )}

          <FormTextarea
            label={result === "verified" ? "Verification note" : "Reason for rejection"}
            placeholder={result === "verified" ? "Customer confirmed details; delivery scheduled." : "Customer unreachable after 3 attempts."}
            {...form.register("note")}
            error={form.formState.errors.note?.message}
          />

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" variant={result === "rejected" ? "danger" : "primary"} disabled={verify.isPending}>
              {verify.isPending ? "Saving…" : result === "rejected" ? "Reject & cancel" : "Mark verified"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
