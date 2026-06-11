import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Store } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSearchParams } from "react-router-dom";
import { PageHeader } from "@/components/layout/PageHeader";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoneyDisplay } from "@/components/ui/money";
import { FormInput } from "@/components/forms/FormInput";
import { FormSwitch } from "@/components/forms/FormSwitch";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
  usePickupStations,
  useCreatePickupStation,
  useUpdatePickupStation,
  useDeletePickupStation,
} from "@/features/pickup/usePickup";
import type { PickupStation } from "@/types/delivery";

const schema = z.object({
  name: z.string().min(2),
  state: z.string().min(2),
  city: z.string().min(2),
  address: z.string().min(3),
  fee: z.coerce.number().min(0),
  hours: z.string().min(3),
  phone: z.string().min(6),
  active: z.boolean(),
});

type Values = z.infer<typeof schema>;

export function PickupStationsScreen({ embedded = false }: { embedded?: boolean }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data, isLoading } = usePickupStations();
  const create = useCreatePickupStation();
  const update = useUpdatePickupStation();
  const remove = useDeletePickupStation();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<PickupStation | null>(null);
  const [deleting, setDeleting] = useState<PickupStation | null>(null);

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      state: "",
      city: "",
      address: "",
      fee: 1500,
      hours: "Mon-Sat - 9am-6pm",
      phone: "",
      active: true,
    },
  });

  function openNew() {
    setEditing(null);
    form.reset({
      name: "",
      state: "",
      city: "",
      address: "",
      fee: 1500,
      hours: "Mon-Sat - 9am-6pm",
      phone: "",
      active: true,
    });
    setOpen(true);
  }

  function closeDialog() {
    setOpen(false);
    if (embedded && searchParams.get("station") === "new") {
      const nextParams = new URLSearchParams(searchParams);
      nextParams.delete("station");
      setSearchParams(nextParams, { replace: true });
    }
  }

  function openEdit(station: PickupStation) {
    setEditing(station);
    form.reset({
      name: station.name,
      state: station.state,
      city: station.city,
      address: station.address,
      fee: station.fee,
      hours: station.hours,
      phone: station.phone,
      active: station.active,
    });
    setOpen(true);
  }

  async function submit(values: Values) {
    if (editing) {
      await update.mutateAsync({ id: editing.id, ...values });
      toast.success("Station updated.");
    } else {
      await create.mutateAsync(values);
      toast.success("Station added.");
    }
    closeDialog();
  }

  useEffect(() => {
    if (embedded && searchParams.get("station") === "new" && !open) {
      openNew();
    }
  }, [embedded, open, searchParams]);

  const columns: DataTableColumn<PickupStation>[] = [
    {
      key: "name",
      header: "Station",
      render: (station) => (
        <div>
          <p className="text-[13px] font-medium text-ink">{station.name}</p>
          <p className="data-muted">{station.address}</p>
        </div>
      ),
    },
    {
      key: "loc",
      header: "Location",
      render: (station) => <span className="data-cell">{station.city}, {station.state}</span>,
    },
    {
      key: "fee",
      header: "Fee",
      align: "right",
      render: (station) => <MoneyDisplay value={station.fee} />,
    },
    {
      key: "hours",
      header: "Hours",
      render: (station) => <span className="data-muted">{station.hours}</span>,
    },
    {
      key: "phone",
      header: "Phone",
      render: (station) => <span className="data-muted">{station.phone}</span>,
    },
    {
      key: "active",
      header: "Active",
      render: (station) => (
        <Badge variant={station.active ? "success" : "neutral"}>
          {station.active ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "",
      align: "right",
      render: (station) => (
        <div className="flex justify-end gap-1">
          <Button size="xs" variant="ghost" onClick={() => openEdit(station)}>
            <Pencil className="h-3 w-3" />
          </Button>
          <Button size="xs" variant="ghost" onClick={() => setDeleting(station)}>
            <Trash2 className="h-3 w-3 text-danger" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      {!embedded && (
        <PageHeader
          eyebrow="Operations"
          title="Pickup stations"
          description="Stations customers can choose at checkout for in-person collection."
          actions={
            <Button size="sm" onClick={openNew}>
              <Plus className="h-3.5 w-3.5" /> New station
            </Button>
          }
        />
      )}
      <DataTable
        rows={data}
        columns={columns}
        loading={isLoading}
        rowKey={(station) => station.id}
        emptyState={
          <div className="flex flex-col items-center gap-2 py-4">
            <Store className="h-5 w-5 text-ink-muted" />
            <span>No pickup stations yet - add one to enable pickup at checkout.</span>
          </div>
        }
      />

      <Dialog
        open={open}
        onOpenChange={(nextOpen) => {
          if (nextOpen) {
            setOpen(true);
            return;
          }
          closeDialog();
        }}
      >
        <DialogContent className="flex max-w-lg flex-col overflow-hidden p-0">
          <DialogHeader className="border-b border-line/70 px-4 pb-4 pt-5 pr-12 sm:px-6 sm:pb-5 sm:pt-6">
            <DialogTitle>{editing ? "Edit station" : "New pickup station"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(submit)} className="flex min-h-0 flex-1 flex-col">
            <div className="min-h-0 space-y-3 overflow-y-auto px-4 py-5 sm:px-6">
              <FormInput
                label="Station name"
                {...form.register("name")}
                error={form.formState.errors.name?.message}
              />
              <div className="grid gap-3 sm:grid-cols-2">
                <FormInput
                  label="State"
                  {...form.register("state")}
                  error={form.formState.errors.state?.message}
                />
                <FormInput
                  label="City"
                  {...form.register("city")}
                  error={form.formState.errors.city?.message}
                />
              </div>
              <FormInput
                label="Street address"
                {...form.register("address")}
                error={form.formState.errors.address?.message}
              />
              <div className="grid gap-3 sm:grid-cols-2">
                <FormInput label="Pickup fee (N)" type="number" step="100" {...form.register("fee")} />
                <FormInput
                  label="Phone"
                  {...form.register("phone")}
                  error={form.formState.errors.phone?.message}
                />
              </div>
              <FormInput
                label="Hours"
                {...form.register("hours")}
                error={form.formState.errors.hours?.message}
              />
              <FormSwitch
                label="Active"
                description="Inactive stations don't appear at checkout."
                checked={form.watch("active")}
                onCheckedChange={(value) => form.setValue("active", value)}
              />
            </div>
            <DialogFooter className="border-t border-line/70 bg-surface px-4 py-4 sm:px-6">
              <Button type="button" variant="ghost" onClick={closeDialog}>
                Cancel
              </Button>
              <Button type="submit" disabled={create.isPending || update.isPending}>
                {create.isPending || update.isPending
                  ? "Saving..."
                  : editing
                    ? "Save changes"
                    : "Add station"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleting}
        onOpenChange={(value) => !value && setDeleting(null)}
        title="Remove this pickup station?"
        description="Customers will no longer be able to select this station at checkout."
        destructive
        confirmLabel="Remove station"
        onConfirm={async () => {
          if (deleting) {
            await remove.mutateAsync(deleting.id);
            toast.success("Station removed.");
          }
        }}
      />
    </div>
  );
}
