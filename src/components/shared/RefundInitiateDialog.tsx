import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth-store";
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
import { FileUploadPlaceholder } from "@/components/forms/FileUploadPlaceholder";
import { REFUND_REASONS, PREFERRED_RESOLUTIONS } from "@/lib/constants";
import { useCreateAdminRefund } from "@/features/refunds/useRefunds";
import type { AdminOrder } from "@/types/order";

const schema = z.object({
  orderItemId: z.string().min(1, "Choose an item or the entire order"),
  reason: z.string().min(1, "Choose a reason"),
  description: z.string().min(10, "Tell us a little more (10+ chars)"),
  preferredResolution: z.string().min(1, "Pick a preferred resolution"),
});

const PRE_DELIVERY_REASONS = [
  "Ordered by mistake",
  "Found a better price",
  "Changed my mind",
  "Taking too long to ship",
  "Other"
];

type FormValues = z.infer<typeof schema>;

interface RefundInitiateDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  order: AdminOrder;
}

export function RefundInitiateDialog({ open, onOpenChange, order }: RefundInitiateDialogProps) {
  const [evidence, setEvidence] = useState<string | undefined>();
  const create = useCreateAdminRefund();
  const navigate = useNavigate();
  const activePlatform = useAuthStore((s) => s.activePlatform);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      orderItemId: "all",
      reason: "",
      description: "",
      preferredResolution: "Refund",
    },
  });

  async function onSubmit(values: FormValues) {
    const isAll = values.orderItemId === "all";
    const product = isAll ? null : order.items.find((i) => (i.orderItemId ?? i.productId) === values.orderItemId);
    const response = await create.mutateAsync({
      orderId: order.id,
      orderNumber: order.number,
      orderItemId: isAll ? undefined : values.orderItemId,
      productId: product?.productId ?? "",
      productName: product?.name ?? "Entire Order",
      reason: values.reason,
      description: values.description,
      preferredResolution: values.preferredResolution,
      evidenceFileName: evidence,
    });
    toast.success(isAll ? "Cancellation override requested" : "Admin refund triggered", {
      description: "You bypass JWT locks. The system will now route it to the Ledger queue.",
    });
    onOpenChange(false);
    form.reset();
    setEvidence(undefined);
    navigate(`/${activePlatform}/refunds/${response.id}`);
  }

  const isPreDelivery = !["delivered", "picked-up", "completed"].includes(order.status);
  const activeReasons = isPreDelivery ? PRE_DELIVERY_REASONS : REFUND_REASONS;
  const itemOptions = [
    { value: "all", label: "Entire Order (Cancel all items)" },
    ...order.items.map((i) => ({ value: i.orderItemId ?? i.productId, label: i.name }))
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{isPreDelivery ? "Override: Cancel Order" : "Override: Issue Return"}</DialogTitle>
          <DialogDescription>
            Admin Refund Override · Order {order.number}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Controller
            control={form.control}
            name="orderItemId"
            render={({ field, fieldState }) => (
              <FormSelect
                label="Item to refund"
                value={field.value}
                onChange={field.onChange}
                options={itemOptions}
                error={fieldState.error?.message}
              />
            )}
          />
          <Controller
            control={form.control}
            name="reason"
            render={({ field, fieldState }) => (
              <FormSelect
                label="Reason"
                value={field.value}
                onChange={field.onChange}
                options={activeReasons.map((r) => ({ value: r, label: r }))}
                error={fieldState.error?.message}
              />
            )}
          />
          <FormTextarea
            label="Internal/Customer notes"
            placeholder={isPreDelivery ? "Tell us why you are overriding this cancellation." : "Note what went wrong for the customer."}
            {...form.register("description")}
            error={form.formState.errors.description?.message}
          />
          {!isPreDelivery && (
            <FileUploadPlaceholder
              label="Upload evidence provided by customer (optional)"
              hint="Photo or PDF, up to 5MB."
              onFileSelected={setEvidence}
            />
          )}
          <Controller
            control={form.control}
            name="preferredResolution"
            render={({ field, fieldState }) => (
              <FormSelect
                label="Preferred resolution"
                value={field.value}
                onChange={field.onChange}
                options={PREFERRED_RESOLUTIONS.map((r) => ({ value: r, label: r }))}
                error={fieldState.error?.message}
              />
            )}
          />

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={create.isPending}>
              {create.isPending ? "Executing…" : "Trigger Override"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
