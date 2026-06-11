import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/PageHeader";
import { FormSwitch } from "@/components/forms/FormSwitch";
import { FormInput } from "@/components/forms/FormInput";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useAuthStore } from "@/store/auth-store";
import { PLATFORM_CONFIG } from "@/types/platform";

export function SettingsScreen() {
  const activePlatform = useAuthStore((s) => s.activePlatform);
  const platform = PLATFORM_CONFIG[activePlatform];
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

  useEffect(() => {
    setSettings((current) => ({
      ...current,
      storeName: platform.settingsStoreName,
      storeEmail: platform.settingsStoreEmail,
    }));
  }, [platform.settingsStoreEmail, platform.settingsStoreName]);

  function patch<K extends keyof typeof settings>(k: K, v: (typeof settings)[K]) {
    setSettings((s) => ({ ...s, [k]: v }));
  }
  function save(section: string) {
    toast.success(`${section} settings saved.`);
  }

  return (
    <div>
      <PageHeader eyebrow="System" title="Settings" description="Configure storefront, payment, delivery, tax, rewards and notifications." />

      <Tabs defaultValue="store">
        <TabsList>
          <TabsTrigger value="store">Store</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
          <TabsTrigger value="delivery">Delivery</TabsTrigger>
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
            <Button onClick={() => save("Store")}>Save changes</Button>
          </section>
        </TabsContent>

        <TabsContent value="payment">
          <section className="card max-w-xl space-y-1 p-5">
            <h2 className="font-display text-base mb-2">Payment</h2>
            <FormSwitch label="Enable Paystack" description="Allow customers to pay online via Paystack." checked={settings.paystackEnabled} onCheckedChange={(v) => patch("paystackEnabled", v)} />
            <FormSwitch label="Enable Payment on Delivery" description="Allow customers to pay when their order arrives." checked={settings.podEnabled} onCheckedChange={(v) => patch("podEnabled", v)} />
            <FormSwitch label="POD verification required" description="POD orders must be verified before fulfilment." checked={settings.podVerificationRequired} onCheckedChange={(v) => patch("podVerificationRequired", v)} />
            <FormSwitch label="POD collection reconciliation required" description="Mark POD complete only after accounting reconciles cash." checked={settings.podReconciliationRequired} onCheckedChange={(v) => patch("podReconciliationRequired", v)} />
            <Button className="mt-3" onClick={() => save("Payment")}>Save changes</Button>
          </section>
        </TabsContent>

        <TabsContent value="delivery">
          <section className="card max-w-xl space-y-3 p-5">
            <h2 className="font-display text-base">Delivery</h2>
            <FormInput label="Default delivery fee (₦)" type="number" step="100" value={settings.defaultDeliveryFee} onChange={(e) => patch("defaultDeliveryFee", Number(e.target.value))} />
            <FormInput label="Free shipping threshold (₦)" type="number" step="1000" value={settings.freeShippingThreshold} onChange={(e) => patch("freeShippingThreshold", Number(e.target.value))} />
            <Button onClick={() => save("Delivery")}>Save changes</Button>
          </section>
        </TabsContent>

        <TabsContent value="tax">
          <section className="card max-w-xl space-y-3 p-5">
            <h2 className="font-display text-base">Tax</h2>
            <FormInput label="VAT %" type="number" step="0.1" value={settings.taxPercent} onChange={(e) => patch("taxPercent", Number(e.target.value))} />
            <Button onClick={() => save("Tax")}>Save changes</Button>
          </section>
        </TabsContent>

        <TabsContent value="rewards">
          <section className="card max-w-xl space-y-3 p-5">
            <h2 className="font-display text-base">Rewards</h2>
            <FormInput label="Points per ₦100 spent" type="number" step="0.01" value={settings.pointsPerNaira * 100} onChange={(e) => patch("pointsPerNaira", Number(e.target.value) / 100)} />
            <FormInput label="₦ per point at redemption" type="number" step="0.5" value={settings.pointValue} onChange={(e) => patch("pointValue", Number(e.target.value))} />
            <Button onClick={() => save("Rewards")}>Save changes</Button>
          </section>
        </TabsContent>

        <TabsContent value="notif">
          <section className="card max-w-xl space-y-1 p-5">
            <h2 className="font-display text-base mb-2">Notifications</h2>
            <FormSwitch label="New order" description="Alert ops when an order is placed." checked={settings.notifNewOrder} onCheckedChange={(v) => patch("notifNewOrder", v)} />
            <FormSwitch label="Low stock" description="Alert catalog team when SKU crosses threshold." checked={settings.notifLowStock} onCheckedChange={(v) => patch("notifLowStock", v)} />
            <FormSwitch label="Refund requested" description="Alert support team for refund decisions." checked={settings.notifRefundRequest} onCheckedChange={(v) => patch("notifRefundRequest", v)} />
            <Button className="mt-3" onClick={() => save("Notifications")}>Save changes</Button>
          </section>
        </TabsContent>
      </Tabs>
    </div>
  );
}
