import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/PageHeader";
import { FormSwitch } from "@/components/forms/FormSwitch";
import { FormInput } from "@/components/forms/FormInput";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useAuthStore } from "@/store/auth-store";
import { PLATFORM_CONFIG } from "@/types/platform";
import { useSaveSettings, useSettings } from "@/features/settings/useSettings";

const SETTING_KEY = "admin.settings";
const BULK_KEY = "pricing.bulkDiscount";

export function SettingsScreen() {
  const activePlatform = useAuthStore((s) => s.activePlatform);
  const platform = PLATFORM_CONFIG[activePlatform];
  const savedSettings = useSettings();
  const saveSettings = useSaveSettings();
  const [settings, setSettings] = useState({
    storeName: platform.settingsStoreName,
    storeEmail: platform.settingsStoreEmail,
    storePhone: "+234 803 555 1234",
    paystackEnabled: true,
    podEnabled: true,
    podVerificationRequired: true,
    podReconciliationRequired: true,
    defaultDeliveryFee: 2500,
    freeShippingThreshold: 50000,
    taxPercent: 0,
    pointsPerNaira: 0.01,
    pointValue: 5,
    notifNewOrder: true,
    notifLowStock: true,
    notifRefundRequest: true,
  });
  // Global quantity discount (`pricing.bulkDiscount`) — read by the backend pricing engine.
  const [bulk, setBulk] = useState({ enabled: true, minQty: 3, percent: 3 });

  useEffect(() => {
    setSettings((current) => ({
      ...current,
      storeName: platform.settingsStoreName,
      storeEmail: platform.settingsStoreEmail,
    }));
  }, [platform.settingsStoreEmail, platform.settingsStoreName]);

  useEffect(() => {
    const row = savedSettings.data?.find((item) => item.key === SETTING_KEY);
    if (row?.value && typeof row.value === "object") {
      setSettings((current) => ({ ...current, ...(row.value as Partial<typeof settings>) }));
    }
    const bulkRow = savedSettings.data?.find((item) => item.key === BULK_KEY);
    if (bulkRow?.value && typeof bulkRow.value === "object") {
      setBulk((current) => ({ ...current, ...(bulkRow.value as Partial<typeof bulk>) }));
    }
  }, [savedSettings.data]);

  function patch<K extends keyof typeof settings>(k: K, v: (typeof settings)[K]) {
    setSettings((s) => ({ ...s, [k]: v }));
  }
  async function save(section: string) {
    await saveSettings.mutateAsync({ [SETTING_KEY]: settings });
    toast.success(`${section} settings saved.`);
  }
  async function saveBulk() {
    await saveSettings.mutateAsync({
      [BULK_KEY]: {
        enabled: bulk.enabled,
        minQty: Math.max(1, Math.round(bulk.minQty)),
        percent: Math.max(0, Math.min(100, bulk.percent)),
      },
    });
    toast.success("Quantity discount saved.");
  }

  return (
    <div>
      <PageHeader eyebrow="System" title="Settings" description="Configure storefront, payment, delivery, tax, rewards and notifications." />

      <Tabs defaultValue="store">
        <TabsList>
          <TabsTrigger value="store">Store</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
          <TabsTrigger value="delivery">Delivery</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
          <TabsTrigger value="tax">Tax</TabsTrigger>
          <TabsTrigger value="rewards">Rewards</TabsTrigger>
          <TabsTrigger value="notif">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="store">
          <section className="card max-w-xl space-y-3 p-5">
            <h2 className="font-display text-base">Store</h2>
            <FormInput label="Store name" value={settings.storeName} onChange={(e) => patch("storeName", e.target.value)} />
            <FormInput label="Contact email" value={settings.storeEmail} onChange={(e) => patch("storeEmail", e.target.value)} />
            <FormInput label="Contact phone" value={settings.storePhone} onChange={(e) => patch("storePhone", e.target.value)} />
            <Button onClick={() => save("Store")} disabled={saveSettings.isPending}>Save changes</Button>
          </section>
        </TabsContent>

        <TabsContent value="payment">
          <section className="card max-w-xl space-y-1 p-5">
            <h2 className="font-display text-base mb-2">Payment</h2>
            <FormSwitch label="Enable Paystack" description="Allow customers to pay online via Paystack." checked={settings.paystackEnabled} onCheckedChange={(v) => patch("paystackEnabled", v)} />
            <FormSwitch label="Enable Payment on Delivery" description="Allow customers to pay when their order arrives." checked={settings.podEnabled} onCheckedChange={(v) => patch("podEnabled", v)} />
            <FormSwitch label="POD verification required" description="POD orders must be verified before fulfilment." checked={settings.podVerificationRequired} onCheckedChange={(v) => patch("podVerificationRequired", v)} />
            <FormSwitch label="POD collection reconciliation required" description="Mark POD complete only after accounting reconciles cash." checked={settings.podReconciliationRequired} onCheckedChange={(v) => patch("podReconciliationRequired", v)} />
            <Button className="mt-3" onClick={() => save("Payment")} disabled={saveSettings.isPending}>Save changes</Button>
          </section>
        </TabsContent>

        <TabsContent value="delivery">
          <section className="card max-w-xl space-y-3 p-5">
            <h2 className="font-display text-base">Delivery</h2>
            <FormInput label="Default delivery fee (₦)" type="number" step="100" value={settings.defaultDeliveryFee} onChange={(e) => patch("defaultDeliveryFee", Number(e.target.value))} />
            <FormInput label="Free shipping threshold (₦)" type="number" step="1000" value={settings.freeShippingThreshold} onChange={(e) => patch("freeShippingThreshold", Number(e.target.value))} />
            <Button onClick={() => save("Delivery")} disabled={saveSettings.isPending}>Save changes</Button>
          </section>
        </TabsContent>

        <TabsContent value="pricing">
          <section className="card max-w-xl space-y-3 p-5">
            <h2 className="font-display text-base">Quantity discount</h2>
            <p className="text-[13px] text-ink-muted">
              Automatic bulk discount on every product. When a customer buys the threshold quantity or
              more of the same product, the unit price drops by this percent. A per-product discount set
              on a product overrides this default for that product.
            </p>
            <FormSwitch
              label="Enable quantity discount"
              description="Applies the default to all products."
              checked={bulk.enabled}
              onCheckedChange={(v) => setBulk((b) => ({ ...b, enabled: v }))}
            />
            <FormInput
              label="Buy quantity (threshold)"
              type="number"
              step="1"
              min="1"
              value={bulk.minQty}
              onChange={(e) => setBulk((b) => ({ ...b, minQty: Number(e.target.value) }))}
            />
            <FormInput
              label="Discount (%)"
              type="number"
              step="1"
              min="0"
              max="100"
              value={bulk.percent}
              onChange={(e) => setBulk((b) => ({ ...b, percent: Number(e.target.value) }))}
            />
            <Button onClick={saveBulk} disabled={saveSettings.isPending}>Save changes</Button>
          </section>
        </TabsContent>

        <TabsContent value="tax">
          <section className="card max-w-xl space-y-3 p-5">
            <h2 className="font-display text-base">Tax</h2>
            <FormInput label="VAT %" type="number" step="0.1" value={settings.taxPercent} onChange={(e) => patch("taxPercent", Number(e.target.value))} />
            <Button onClick={() => save("Tax")} disabled={saveSettings.isPending}>Save changes</Button>
          </section>
        </TabsContent>

        <TabsContent value="rewards">
          <section className="card max-w-xl space-y-3 p-5">
            <h2 className="font-display text-base">Rewards</h2>
            <FormInput label="Points per ₦100 spent" type="number" step="0.01" value={settings.pointsPerNaira * 100} onChange={(e) => patch("pointsPerNaira", Number(e.target.value) / 100)} />
            <FormInput label="₦ per point at redemption" type="number" step="0.5" value={settings.pointValue} onChange={(e) => patch("pointValue", Number(e.target.value))} />
            <Button onClick={() => save("Rewards")} disabled={saveSettings.isPending}>Save changes</Button>
          </section>
        </TabsContent>

        <TabsContent value="notif">
          <section className="card max-w-xl space-y-1 p-5">
            <h2 className="font-display text-base mb-2">Notifications</h2>
            <FormSwitch label="New order" description="Alert ops when an order is placed." checked={settings.notifNewOrder} onCheckedChange={(v) => patch("notifNewOrder", v)} />
            <FormSwitch label="Low stock" description="Alert catalog team when SKU crosses threshold." checked={settings.notifLowStock} onCheckedChange={(v) => patch("notifLowStock", v)} />
            <FormSwitch label="Refund requested" description="Alert support team for refund decisions." checked={settings.notifRefundRequest} onCheckedChange={(v) => patch("notifRefundRequest", v)} />
            <Button className="mt-3" onClick={() => save("Notifications")} disabled={saveSettings.isPending}>Save changes</Button>
          </section>
        </TabsContent>
      </Tabs>
    </div>
  );
}
