import { useSearchParams } from "react-router-dom";
import { PageHeader } from "@/components/layout/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DeliveryScreen } from "@/components/shared/DeliveryScreen";
import { PickupHandoffsScreen } from "@/components/shared/PickupHandoffsScreen";

type DeliveryTab = "home" | "handoffs";

export function DeliveryOperationsScreen({
  rolePath,
}: {
  rolePath: string;
}) {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentTab = searchParams.get("tab");
  const activeTab = ["home", "handoffs"].includes(currentTab as string) ? (currentTab as DeliveryTab) : "home";

  function handleTabChange(value: string) {
    const next = value as DeliveryTab;
    const nextParams = new URLSearchParams(searchParams);
    if (next === "home") {
      nextParams.delete("tab");
    } else {
      nextParams.set("tab", next);
    }
    setSearchParams(nextParams, { replace: true });
  }

  return (
    <div>
      <PageHeader
        eyebrow="Operations"
        title="Delivery"
        description="Track home delivery and pickup handoffs from one place."
      />

      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="mb-4">
          <TabsTrigger value="home">Home delivery</TabsTrigger>
          <TabsTrigger value="handoffs">Pickup handoffs</TabsTrigger>
        </TabsList>

        <TabsContent value="home">
          <DeliveryScreen rolePath={rolePath} embedded />
        </TabsContent>

        <TabsContent value="handoffs">
          <PickupHandoffsScreen rolePath={rolePath} embedded />
        </TabsContent>
      </Tabs>
    </div>
  );
}
