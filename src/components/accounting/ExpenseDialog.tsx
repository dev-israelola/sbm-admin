import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/forms/FormInput";
import { FormSelect } from "@/components/forms/FormSelect";
import { FormTextarea } from "@/components/forms/FormTextarea";
import { FileUploadPlaceholder } from "@/components/forms/FileUploadPlaceholder";
import { useCreateExpense } from "@/features/accounting/useAccounting";
import { useAuthStore } from "@/store/auth-store";
import { EXPENSE_CATEGORY_LABEL } from "@/types/accounting";

const schema = z.object({
  title: z.string().min(2),
  category: z.string().min(2),
  amount: z.coerce.number().min(1),
  date: z.string().min(2),
  vendor: z.string().optional(),
  paymentMethod: z.enum(["Cash", "Bank Transfer", "Card", "Paystack"]),
  note: z.string().optional(),
});
type Values = z.infer<typeof schema>;

interface Props { open: boolean; onOpenChange: (v: boolean) => void; }

export function ExpenseDialog({ open, onOpenChange }: Props) {
  const create = useCreateExpense();
  const user = useAuthStore((s) => s.user);
  const [receiptUrl, setReceiptUrl] = useState<string | undefined>();
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "", category: "product-cost", amount: 0,
      date: new Date().toISOString().slice(0, 10),
      vendor: "", paymentMethod: "Bank Transfer", note: "",
    },
  });

  async function submit(v: Values) {
    await create.mutateAsync({
      title: v.title,
      category: v.category as any,
      amount: v.amount,
      date: v.date,
      vendor: v.vendor,
      paymentMethod: v.paymentMethod,
      note: v.note,
      receiptFile: receiptUrl,
      recordedBy: user?.fullName ?? "Accountant",
    });
    toast.success("Expense logged.");
    onOpenChange(false);
    setReceiptUrl(undefined);
    form.reset();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Log expense</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(submit)} className="space-y-3">
          <FormInput label="Title" {...form.register("title")} error={form.formState.errors.title?.message} />
          <Controller
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormSelect
                label="Category"
                value={field.value}
                onChange={field.onChange}
                options={Object.entries(EXPENSE_CATEGORY_LABEL).map(([v, l]) => ({ value: v, label: l }))}
              />
            )}
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <FormInput label="Amount (₦)" type="number" step="100" {...form.register("amount")} error={form.formState.errors.amount?.message} />
            <FormInput label="Date" type="date" {...form.register("date")} />
          </div>
          <FormInput label="Vendor (optional)" {...form.register("vendor")} />
          <Controller
            control={form.control}
            name="paymentMethod"
            render={({ field }) => (
              <FormSelect
                label="Payment method"
                value={field.value}
                onChange={field.onChange}
                options={[
                  { value: "Cash", label: "Cash" },
                  { value: "Bank Transfer", label: "Bank transfer" },
                  { value: "Card", label: "Card" },
                  { value: "Paystack", label: "Paystack" },
                ]}
              />
            )}
          />
          <FormTextarea label="Note (optional)" {...form.register("note")} />
          <FileUploadPlaceholder label="Receipt (optional)" uploadKind="EXPENSE_RECEIPT" onUploaded={setReceiptUrl} />

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={create.isPending}>{create.isPending ? "Saving…" : "Save expense"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
