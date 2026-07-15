import { useEffect, useMemo, useState } from "react";
import { Plus, MapPin, Check, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { useSettings, useSaveSettings } from "@/features/settings/useSettings";

type DeliveryState = {
  code: string;
  name: string;
  homeDeliveryFee: number;
  cities: (string | { name: string; fee: number })[];
};

type DeliveryOptions = {
  states: DeliveryState[];
  freeHomeDeliveryThreshold: number;
};

type ZoneRow = {
  id: string; // generated index or name
  name: string;
  fee: number | "Default";
  isString: boolean;
};

export function HomeDeliveryZonesScreen() {
  const { data: settings, isLoading } = useSettings();
  const save = useSaveSettings();
  const [selectedStateCode, setSelectedStateCode] = useState<string>("");
  const [stateForm, setStateForm] = useState<{ open: boolean; state?: DeliveryState | null }>({ open: false });
  const [zoneForm, setZoneForm] = useState<{ open: boolean; zone?: ZoneRow | null }>({ open: false });
  const [deleteZone, setDeleteZone] = useState<ZoneRow | null>(null);

  const deliveryOptionsObj = useMemo(() => {
    return settings?.find((s) => s.key === "storefront.deliveryOptions")?.value as DeliveryOptions | undefined;
  }, [settings]);

  const deliveryStates = deliveryOptionsObj?.states ?? [];

  useEffect(() => {
    if (!selectedStateCode && deliveryStates.length > 0) {
      setSelectedStateCode(deliveryStates[0].code);
    }
  }, [deliveryStates, selectedStateCode]);

  const selectedState = useMemo(() => deliveryStates.find((s) => s.code === selectedStateCode), [deliveryStates, selectedStateCode]);

  const zoneRows: ZoneRow[] = useMemo(() => {
    if (!selectedState) return [];
    return selectedState.cities.map((city, idx) => {
      if (typeof city === "string") {
        return {
          id: `idx-${idx}`,
          name: city,
          fee: "Default",
          isString: true
        };
      }
      return {
        id: `idx-${idx}`,
        name: city.name,
        fee: city.fee,
        isString: false
      };
    });
  }, [selectedState]);

  const onUpdateOptions = async (newOptions: DeliveryOptions) => {
    try {
      await save.mutateAsync({ "storefront.deliveryOptions": newOptions });
      toast.success("Delivery options updated");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to save options");
    }
  };

  const updateStateFee = async (newFee: number) => {
    if (!deliveryOptionsObj || !selectedState) return;
    const newState = { ...selectedState, homeDeliveryFee: newFee };
    const newOptions: DeliveryOptions = {
      ...deliveryOptionsObj,
      states: deliveryOptionsObj.states.map(s => s.code === selectedState.code ? newState : s)
    };
    await onUpdateOptions(newOptions);
  };

  const updateZoneFee = async (zoneOriginalId: string, newFee: number, updateIsString: boolean) => {
    if (!deliveryOptionsObj || !selectedState) return;
    const targetIdx = parseInt(zoneOriginalId.replace("idx-", ""));
    const newCities = [...selectedState.cities];
    const city = newCities[targetIdx];
    
    // Convert to object or keep object
    if (typeof city === "string") {
      newCities[targetIdx] = { name: city, fee: newFee };
    } else {
      newCities[targetIdx] = { ...city, fee: newFee };
    }

    if (updateIsString && newFee === 0) {
      // Revert to plain string if they delete the specific fee?
      newCities[targetIdx] = typeof city === "string" ? city : city.name;
    }

    const newState = { ...selectedState, cities: newCities };
    const newOptions = {
      ...deliveryOptionsObj,
      states: deliveryOptionsObj.states.map(s => s.code === selectedState.code ? newState : s)
    };
    await onUpdateOptions(newOptions);
  };

  const removeSelectedZone = async (zoneOriginalId: string) => {
    if (!deliveryOptionsObj || !selectedState) return;
    const targetIdx = parseInt(zoneOriginalId.replace("idx-", ""));
    const newCities = selectedState.cities.filter((_, idx) => idx !== targetIdx);

    const newState = { ...selectedState, cities: newCities };
    const newOptions = {
      ...deliveryOptionsObj,
      states: deliveryOptionsObj.states.map(s => s.code === selectedState.code ? newState : s)
    };
    await onUpdateOptions(newOptions);
    setDeleteZone(null);
  };

  const columns: DataTableColumn<ZoneRow>[] = [
    { key: "name", header: "Zone (City)", render: (z) => <span className="font-medium text-[13px]">{z.name}</span> },
    {
      key: "fee",
      header: "Custom Fee (₦)",
      align: "right",
      render: (z) => <PriceCell zone={z} defaultFee={selectedState?.homeDeliveryFee || 0} onSave={(v) => updateZoneFee(z.id, v, false)} />
    },
    {
      key: "act",
      header: "",
      align: "right",
      render: (z) => (
        <Button size="xs" variant="ghost" onClick={() => setDeleteZone(z)}>
          <Trash2 className="h-4 w-4 text-error" />
        </Button>
      )
    },
  ];

  return (
    <div>
      <PageHeader
        eyebrow="Operations"
        title="Home Delivery Zones"
        description="Set the base delivery fees for states, and define custom delivery zones within them."
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setStateForm({ open: true, state: null })}>
              <Plus className="h-4 w-4" /> Add State
            </Button>
          </div>
        }
      />

      <div className="mb-4 grid gap-4 grid-cols-1 md:grid-cols-3">
        <FormSelect
          label="State"
          value={selectedStateCode}
          onChange={(v) => setSelectedStateCode(v)}
          options={deliveryStates.map((s) => ({
            value: s.code,
            label: `${s.name}`,
          }))}
        />
        {selectedState && (
          <div className="flex flex-col gap-1 w-full max-w-[200px]">
            <label className="text-[12px] font-medium leading-none text-ink-muted">Base State Fee (₦)</label>
            <BaseFeeCell stateFee={selectedState.homeDeliveryFee} onSave={updateStateFee} />
          </div>
        )}
        <div className="flex items-end justify-end">
          <Button onClick={() => setZoneForm({ open: true })} disabled={!selectedStateCode}>
            <Plus className="h-4 w-4" /> Add Zone
          </Button>
        </div>
      </div>

      <DataTable
        rows={zoneRows}
        columns={columns}
        loading={isLoading || save.isPending}
        rowKey={(z) => z.id}
        dense
        emptyState={
          <div className="flex flex-col items-center gap-2 py-4">
            <MapPin className="h-5 w-5 text-ink-muted" />
            <span>No delivery zones listed for this state yet.</span>
          </div>
        }
      />

      {deliveryOptionsObj && (
        <ZoneFormDialog 
          open={zoneForm.open} 
          onOpenChange={(v) => !v && setZoneForm({ open: false })} 
          options={deliveryOptionsObj} 
          stateCode={selectedStateCode} 
        />
      )}
      
      {deliveryOptionsObj && (
        <StateFormDialog 
          open={stateForm.open} 
          onOpenChange={(v) => !v && setStateForm({ open: false })} 
          options={deliveryOptionsObj} 
        />
      )}

      <ConfirmDialog
        open={!!deleteZone}
        onOpenChange={(v) => !v && setDeleteZone(null)}
        title={`Delete ${deleteZone?.name}?`}
        description="Removes this zone from the checkout list immediately."
        confirmLabel="Delete"
        destructive
        onConfirm={async () => {
          if (deleteZone) await removeSelectedZone(deleteZone.id);
        }}
      />
    </div>
  );
}

// Inline editable base fee cell
function BaseFeeCell({ stateFee, onSave }: { stateFee: number; onSave: (v: number) => Promise<unknown> }) {
  const [naira, setNaira] = useState(String(stateFee));
  const [saving, setSaving] = useState(false);
  
  useEffect(() => setNaira(String(stateFee)), [stateFee]);
  
  const dirty = Math.round(Number(naira) || 0) !== stateFee;

  async function saveAction() {
    setSaving(true);
    await onSave(Number(naira) || 0);
    setSaving(false);
  }

  return (
    <div className="flex items-center gap-1.5 h-[36px]">
      <Input
        type="number"
        value={naira}
        onChange={(e) => setNaira(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && dirty && saveAction()}
        className="h-full w-full tabular-nums bg-white"
      />
      <Button size="xs" variant={dirty ? "primary" : "ghost"} disabled={!dirty || saving} onClick={saveAction} className="h-full px-3">
        <Check className="h-4 w-4" /> Save
      </Button>
    </div>
  );
}

function PriceCell({ zone, defaultFee, onSave }: { zone: ZoneRow; defaultFee: number; onSave: (v: number) => Promise<unknown> }) {
  const isDefault = zone.fee === "Default";
  const startNaira = isDefault ? "" : String(zone.fee as number);
  const [naira, setNaira] = useState(startNaira);
  const [saving, setSaving] = useState(false);
  
  useEffect(() => {
    setNaira(zone.fee === "Default" ? "" : String(zone.fee as number));
  }, [zone.fee]);
  
  const currentFee = zone.fee === "Default" ? 0 : zone.fee;
  const isCurrentlyEmpty = naira === "";
  const parsedFee = isCurrentlyEmpty ? 0 : Math.round(Number(naira) || 0);
  const dirty = isCurrentlyEmpty ? !isDefault : parsedFee !== currentFee;

  async function saveAction() {
    setSaving(true);
    await onSave(Number(naira) || 0); // If empty, sending 0 normally forces default behavior in our setup if we want
    setSaving(false);
  }

  return (
    <div className="flex items-center justify-end gap-1.5">
      <span className="text-ink-muted text-[12px]">{isCurrentlyEmpty ? "(Default ₦" + defaultFee + ") " : "₦"}</span>
      <Input
        type="number"
        value={naira}
        onChange={(e) => setNaira(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && dirty && saveAction()}
        className="h-8 w-24 text-right tabular-nums"
        placeholder={String(defaultFee)}
      />
      <Button size="xs" variant={dirty ? "primary" : "ghost"} disabled={!dirty || saving} onClick={saveAction}>
        <Check className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}

function ZoneFormDialog({ open, onOpenChange, options, stateCode }: { open: boolean; onOpenChange: (v: boolean) => void; options: DeliveryOptions; stateCode: string; }) {
  const save = useSaveSettings();
  const form = useForm<{ name: string; fee: number | "" }>({ defaultValues: { name: "", fee: "" } });

  async function submit(v: { name: string; fee: number | "" }) {
    if (!stateCode) return;
    const targetState = options.states.find(s => s.code === stateCode);
    if (!targetState) return;

    const newCity = v.fee !== "" ? { name: v.name.trim(), fee: Math.round(Number(v.fee)) } : v.name.trim();

    const newState = { ...targetState, cities: [...targetState.cities, newCity] };
    const newOptions = { ...options, states: options.states.map(s => s.code === stateCode ? newState : s) };

    try {
      await save.mutateAsync({ "storefront.deliveryOptions": newOptions });
      toast.success("Zone added");
      onOpenChange(false);
      form.reset({ name: "", fee: "" });
    } catch (e) {
      toast.error("Failed to add zone");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Add Zone</DialogTitle>
          <DialogDescription>Leave fee empty to use the state's base delivery fee.</DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(submit)} className="space-y-3">
          <FormInput label="Zone name" {...form.register("name", { required: true })} />
          <FormInput label="Custom delivery fee (₦)" type="number" {...form.register("fee")} placeholder="Empty = base fee" />
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={save.isPending}>{save.isPending ? "Adding..." : "Add Zone"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function StateFormDialog({ open, onOpenChange, options }: { open: boolean; onOpenChange: (v: boolean) => void; options: DeliveryOptions }) {
  const save = useSaveSettings();
  const form = useForm<{ name: string; code: string; fee: number }>({ defaultValues: { name: "", code: "", fee: 3500 } });

  async function submit(v: { name: string; code: string; fee: number }) {
    const newState: DeliveryState = {
      name: v.name.trim(),
      code: v.code.trim().toUpperCase(),
      homeDeliveryFee: Math.round(Number(v.fee)),
      cities: [],
    };
    const newOptions = { ...options, states: [...options.states, newState].sort((a,b) => a.name.localeCompare(b.name)) };

    try {
      await save.mutateAsync({ "storefront.deliveryOptions": newOptions });
      toast.success("State added");
      onOpenChange(false);
      form.reset({ name: "", code: "", fee: 3500 });
    } catch (e) {
      toast.error("Failed to add state");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Add State</DialogTitle>
          <DialogDescription>Add a new state for home delivery.</DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(submit)} className="space-y-3">
          <div className="grid grid-cols-[1fr,80px] gap-3">
            <FormInput label="State name" {...form.register("name", { required: true })} placeholder="e.g. Kano" />
            <FormInput label="Code" {...form.register("code", { required: true })} placeholder="KN" maxLength={2} />
          </div>
          <FormInput label="Base delivery fee (₦)" type="number" {...form.register("fee", { required: true })} />
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={save.isPending}>{save.isPending ? "Adding..." : "Add State"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
