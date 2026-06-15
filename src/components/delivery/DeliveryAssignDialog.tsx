import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FormSelect } from "@/components/forms/FormSelect";
import { FormInput } from "@/components/forms/FormInput";
import { useAssignDelivery } from "@/features/delivery/useDeliveries";
import { useStaff } from "@/features/auth/useAuth";
import { nairaToKobo } from "@/lib/format";

const schema = z.object({
  type: z.enum(["internal", "third-party"]),
  assigneeId: z.string().optional(),
  provider: z.string().optional(),
  trackingNumber: z.string().optional(),
  deliveryFee: z.coerce.number().min(0),
});
type Values = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  deliveryId: string;
  orderNumber: string;
}

export function DeliveryAssignDialog({ open, onOpenChange, deliveryId, orderNumber }: Props) {
  const assign = useAssignDelivery();
  const staff = useStaff(open);
  const riders = (staff.data?.items ?? []).filter((u) => u.role === "delivery" && u.active);
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { type: "internal", deliveryFee: 2500 },
  });
  const type = form.watch("type");

  async function submit(v: Values) {
    const assignee = riders.find((u) => u.id === v.assigneeId);
    if (v.type === "internal" && !assignee) {
      toast.error("Please select an active delivery staff member.");
      return;
    }
    await assign.mutateAsync({
      id: deliveryId,
      type: v.type,
      assigneeId: v.type === "internal" ? v.assigneeId : undefined,
      assigneeName: v.type === "internal" ? assignee?.fullName : undefined,
      provider: v.type === "third-party" ? v.provider : "Internal Rider",
      trackingNumber: v.type === "third-party" ? v.trackingNumber : undefined,
      deliveryFee: nairaToKobo(v.deliveryFee),
    });
    toast.success(`Delivery for ${orderNumber} assigned.`);
    onOpenChange(false);
    form.reset();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Assign delivery</DialogTitle>
          <DialogDescription>{orderNumber} — choose internal rider or a third-party logistics provider.</DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(submit)} className="space-y-3">
          <Controller
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormSelect
                label="Delivery type"
                value={field.value}
                onChange={field.onChange}
                options={[
                  { value: "internal", label: "Internal rider" },
                  { value: "third-party", label: "Third-party logistics" },
                ]}
              />
            )}
          />
          {type === "internal" ? (
            <Controller
              control={form.control}
              name="assigneeId"
              render={({ field }) => (
                <FormSelect
                  label="Rider"
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  options={riders.map((u) => ({ value: u.id, label: u.fullName }))}
                  placeholder={staff.isLoading ? "Loading riders..." : "Select rider"}
                />
              )}
            />
          ) : (
            <>
              <FormInput label="Logistics provider" placeholder="GIG, Sendbox, Topship…" {...form.register("provider")} />
              <FormInput label="Tracking number" {...form.register("trackingNumber")} />
            </>
          )}
          <FormInput label="Delivery fee (₦)" type="number" step="100" {...form.register("deliveryFee")} />
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={assign.isPending}>
              {assign.isPending ? "Saving…" : "Assign"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
