import { useState } from "react";
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
import { FormTextarea } from "@/components/forms/FormTextarea";
import { FileUploadPlaceholder } from "@/components/forms/FileUploadPlaceholder";
import { useConfirmPodPayment } from "@/features/orders/useOrders";
import { useAuthStore } from "@/store/auth-store";
import { koboToNaira, nairaToKobo } from "@/lib/format";

const schema = z.object({
  amount: z.coerce.number().min(1, "Amount required"),
  method: z.enum(["cash", "bank-transfer", "pos"]),
  collectedBy: z.string().min(2, "Required"),
  reference: z.string().optional(),
  note: z.string().optional(),
});
type Values = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  orderId: string;
  orderNumber: string;
  /** Outstanding amount in kobo. */
  defaultAmount: number;
}

export function PodPaymentCollectionDialog({ open, onOpenChange, orderId, orderNumber, defaultAmount }: Props) {
  const user = useAuthStore((s) => s.user);
  const confirm = useConfirmPodPayment();
  const [proofUrl, setProofUrl] = useState<string | null>(null);
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      amount: koboToNaira(defaultAmount),
      method: "cash",
      collectedBy: user?.fullName ?? "",
      reference: "",
      note: "",
    },
  });

  function reset() {
    form.reset();
    setProofUrl(null);
  }

  async function submit(values: Values) {
    await confirm.mutateAsync({
      id: orderId,
      amount: nairaToKobo(values.amount),
      method: values.method,
      collectedBy: values.collectedBy,
      collectedAt: new Date().toISOString(),
      reference: values.reference,
      note: values.note,
      proofUrl: proofUrl ?? undefined,
    });
    toast.success(`Payment recorded on ${orderNumber}.`);
    onOpenChange(false);
    reset();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Record POD payment</DialogTitle>
          <DialogDescription>{orderNumber}. Submitting moves the order to "cash collected" and queues reconciliation.</DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(submit)} className="space-y-3">
          <FormInput
            label="Amount collected (₦)"
            type="number"
            step="1"
            {...form.register("amount")}
            error={form.formState.errors.amount?.message}
          />
          <Controller
            control={form.control}
            name="method"
            render={({ field }) => (
              <FormSelect
                label="Collection method"
                value={field.value}
                onChange={field.onChange}
                options={[
                  { value: "cash", label: "Cash" },
                  { value: "bank-transfer", label: "Bank transfer" },
                  { value: "pos", label: "POS / card" },
                ]}
              />
            )}
          />
          <FormInput label="Collected by" {...form.register("collectedBy")} error={form.formState.errors.collectedBy?.message} />
          <FormInput label="Reference (optional)" placeholder="POS slip, transfer ref…" {...form.register("reference")} />
          <FormTextarea label="Note (optional)" {...form.register("note")} />
          <FileUploadPlaceholder
            label="Upload proof (optional)"
            hint="Receipt or POS slip"
            uploadKind="PAYMENT_PROOF"
            onUploaded={(url) => setProofUrl(url)}
          />

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={confirm.isPending}>
              {confirm.isPending ? "Saving…" : "Confirm collection"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
