import { useEffect, useMemo, useState } from "react";
import { Plus, Truck, Check } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FormInput } from "@/components/forms/FormInput";
import { FormSelect } from "@/components/forms/FormSelect";
import { formatNaira } from "@/lib/format";
import {
  useDeliveryCompanies,
  useDeliveryTerminals,
  useCreateCompany,
  useCreateTerminal,
  useUpdateTerminal,
  useDeleteTerminal,
  type AdminDeliveryTerminal,
} from "@/features/delivery/useTerminals";

export function DeliveryTerminalsScreen() {
  const { data: companies, isLoading: companiesLoading } = useDeliveryCompanies();
  const [companyId, setCompanyId] = useState<string>("");
  const [stateFilter, setStateFilter] = useState<string>("");
  const [addCarrierOpen, setAddCarrierOpen] = useState(false);
  const [terminalForm, setTerminalForm] = useState<{ open: boolean; terminal?: AdminDeliveryTerminal }>({ open: false });
  const [deleteFor, setDeleteFor] = useState<AdminDeliveryTerminal | null>(null);

  // Default to the first carrier once loaded.
  useEffect(() => {
    if (!companyId && companies && companies.length > 0) setCompanyId(companies[0].id);
  }, [companies, companyId]);

  const { data: terminals, isLoading: terminalsLoading } = useDeliveryTerminals(companyId || undefined);
  const update = useUpdateTerminal(companyId || undefined);
  const remove = useDeleteTerminal(companyId || undefined);

  const states = useMemo(
    () => Array.from(new Set((terminals ?? []).map((t) => t.state))).sort(),
    [terminals],
  );
  const rows = useMemo(
    () => (stateFilter ? (terminals ?? []).filter((t) => t.state === stateFilter) : terminals ?? []),
    [terminals, stateFilter],
  );
  const pricedCount = (terminals ?? []).filter((t) => t.price > 0).length;

  const columns: DataTableColumn<AdminDeliveryTerminal>[] = [
    { key: "state", header: "State", render: (t) => <span className="text-[13px]">{t.state}</span> },
    {
      key: "name",
      header: "Terminal",
      render: (t) => (
        <div>
          <p className="text-[13px] font-medium text-ink">{t.name}</p>
          <p className="data-muted max-w-[320px] truncate">{t.address}</p>
        </div>
      ),
    },
    { key: "code", header: "Code", render: (t) => <span className="data-muted">{t.code || "—"}</span> },
    {
      key: "price",
      header: "Delivery fee",
      align: "right",
      render: (t) => <PriceCell terminal={t} onSave={(kobo) => update.mutateAsync({ id: t.id, price: kobo })} />,
    },
    {
      key: "active",
      header: "Active",
      align: "center",
      render: (t) => (
        <Switch
          checked={t.isActive}
          onCheckedChange={(v) => update.mutate({ id: t.id, isActive: v })}
        />
      ),
    },
    {
      key: "act",
      header: "",
      align: "right",
      render: (t) => (
        <div className="flex justify-end gap-2">
          <Button size="xs" variant="outline" onClick={() => setTerminalForm({ open: true, terminal: t })}>
            Edit
          </Button>
          <Button size="xs" variant="ghost" onClick={() => setDeleteFor(t)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        eyebrow="Operations"
        title="Delivery terminals"
        description="Interstate pickup terminals shown at checkout. Set the delivery fee for each terminal — customers pick a carrier, state, then their nearest terminal."
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setAddCarrierOpen(true)}>
              <Plus className="h-4 w-4" /> Carrier
            </Button>
            <Button onClick={() => setTerminalForm({ open: true })} disabled={!companyId}>
              <Plus className="h-4 w-4" /> Terminal
            </Button>
          </div>
        }
      />

      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        <FormSelect
          label="Carrier"
          value={companyId}
          onChange={(v) => {
            setCompanyId(v);
            setStateFilter("");
          }}
          options={(companies ?? []).map((c) => ({
            value: c.id,
            label: `${c.name}${c._count ? ` (${c._count.terminals})` : ""}`,
          }))}
        />
        <FormSelect
          label="State"
          value={stateFilter}
          onChange={setStateFilter}
          options={[{ value: "", label: "All states" }, ...states.map((s) => ({ value: s, label: s }))]}
        />
        <div className="flex items-end">
          <p className="text-[12px] text-ink-muted">
            {pricedCount} of {terminals?.length ?? 0} terminals have a fee set.
          </p>
        </div>
      </div>

      <DataTable
        rows={rows}
        columns={columns}
        loading={companiesLoading || terminalsLoading}
        rowKey={(t) => t.id}
        dense
        emptyState={
          <div className="flex flex-col items-center gap-2 py-4">
            <Truck className="h-5 w-5 text-ink-muted" />
            <span>No terminals for this carrier yet.</span>
          </div>
        }
      />

      <CarrierFormDialog open={addCarrierOpen} onOpenChange={setAddCarrierOpen} />
      <TerminalFormDialog
        key={terminalForm.terminal?.id ?? "new"}
        open={terminalForm.open}
        onOpenChange={(v) => setTerminalForm((s) => ({ ...s, open: v }))}
        companyId={companyId}
        terminal={terminalForm.terminal}
      />

      <ConfirmDialog
        open={!!deleteFor}
        onOpenChange={(v) => !v && setDeleteFor(null)}
        title={`Delete ${deleteFor?.name ?? "terminal"}?`}
        description="Removes this terminal from checkout. Past orders are unaffected."
        confirmLabel="Delete"
        destructive
        onConfirm={async () => {
          if (deleteFor) await remove.mutateAsync(deleteFor.id);
        }}
      />
    </div>
  );
}

// Inline editable delivery-fee cell (naira input → kobo on save).
function PriceCell({ terminal, onSave }: { terminal: AdminDeliveryTerminal; onSave: (kobo: number) => Promise<unknown> }) {
  const [naira, setNaira] = useState(String(terminal.price ? terminal.price / 100 : ""));
  const [saving, setSaving] = useState(false);
  useEffect(() => setNaira(String(terminal.price ? terminal.price / 100 : "")), [terminal.price]);
  const dirty = Math.round((Number(naira) || 0) * 100) !== terminal.price;

  async function save() {
    setSaving(true);
    try {
      await onSave(Math.round((Number(naira) || 0) * 100));
      toast.success(`Fee updated · ${terminal.name}`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not update fee");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex items-center justify-end gap-1.5">
      <span className="text-ink-muted text-[12px]">₦</span>
      <Input
        type="number"
        value={naira}
        onChange={(e) => setNaira(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && dirty && save()}
        className="h-8 w-24 text-right tabular-nums"
        placeholder="0"
      />
      <Button size="xs" variant={dirty ? "primary" : "ghost"} disabled={!dirty || saving} onClick={save}>
        <Check className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}

// --- Add / edit terminal -----------------------------------------------------
function TerminalFormDialog({
  open,
  onOpenChange,
  companyId,
  terminal,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  companyId: string;
  terminal?: AdminDeliveryTerminal;
}) {
  const create = useCreateTerminal();
  const update = useUpdateTerminal(companyId || undefined);
  const editing = !!terminal;
  const form = useForm<{ state: string; name: string; address: string; code: string; phone: string; price: number }>({
    defaultValues: {
      state: terminal?.state ?? "",
      name: terminal?.name ?? "",
      address: terminal?.address ?? "",
      code: terminal?.code ?? "",
      phone: terminal?.phone ?? "",
      price: terminal ? terminal.price / 100 : 3500,
    },
  });

  async function submit(v: { state: string; name: string; address: string; code: string; phone: string; price: number }) {
    const body = {
      state: v.state.trim(),
      name: v.name.trim(),
      address: v.address.trim(),
      code: v.code.trim() || undefined,
      phone: v.phone.trim() || undefined,
      price: Math.round((Number(v.price) || 0) * 100),
    };
    try {
      if (editing) {
        await update.mutateAsync({ id: terminal!.id, ...body });
        toast.success("Terminal updated");
      } else {
        await create.mutateAsync({ companyId, ...body });
        toast.success("Terminal added");
      }
      onOpenChange(false);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not save terminal");
    }
  }

  const busy = create.isPending || update.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{editing ? "Edit terminal" : "Add terminal"}</DialogTitle>
          <DialogDescription>Delivery fee is entered in naira.</DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(submit)} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <FormInput label="State" {...form.register("state", { required: true })} />
            <FormInput label="Terminal name" {...form.register("name", { required: true })} />
          </div>
          <FormInput label="Address" {...form.register("address", { required: true })} />
          <div className="grid grid-cols-2 gap-3">
            <FormInput label="Terminal code (optional)" {...form.register("code")} />
            <FormInput label="Phone (optional)" {...form.register("phone")} />
          </div>
          <FormInput label="Delivery fee (₦)" type="number" {...form.register("price")} />
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={busy}>
              {busy ? "Saving…" : editing ? "Save changes" : "Add terminal"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// --- Add carrier -------------------------------------------------------------
function CarrierFormDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const create = useCreateCompany();
  const form = useForm<{ name: string }>({ defaultValues: { name: "" } });

  async function submit(v: { name: string }) {
    try {
      await create.mutateAsync({ name: v.name.trim() });
      toast.success("Carrier added");
      onOpenChange(false);
      form.reset({ name: "" });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not add carrier");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Add carrier</DialogTitle>
          <DialogDescription>A logistics company (e.g. GIG Logistics). Add its terminals afterwards.</DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(submit)} className="space-y-3">
          <FormInput label="Carrier name" placeholder="e.g. GIG Logistics" {...form.register("name", { required: true })} />
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={create.isPending}>
              {create.isPending ? "Adding…" : "Add carrier"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
