import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { DeliveryScreen } from "@/components/shared/DeliveryScreen";
import { PickupHandoffsScreen } from "@/components/shared/PickupHandoffsScreen";
import { PickupStationsScreen } from "@/components/shared/PickupStationsScreen";

type DeliveryTab = "home" | "handoffs" | "stations";

export function DeliveryOperationsScreen({
  rolePath,
  showStations = true,
}: {
  rolePath: string;
  showStations?: boolean;
}) {
  const [searchParams, setSearchParams] = useSearchParams();

  const allowedTabs = useMemo<DeliveryTab[]>(
    () => (showStations ? ["home", "handoffs", "stations"] : ["home", "handoffs"]),
    [showStations],
  );

  const currentTab = searchParams.get("tab");
  const activeTab = allowedTabs.includes(currentTab as DeliveryTab) ? (currentTab as DeliveryTab) : "home";

  function handleTabChange(value: string) {
    const next = value as DeliveryTab;
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete("station");
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
        description="Track home delivery, pickup handoffs, and station availability from one place."
        actions={
          showStations && activeTab === "stations" ? (
            <Button
              size="sm"
              onClick={() => {
                const nextParams = new URLSearchParams(searchParams);
                nextParams.set("tab", "stations");
                nextParams.set("station", "new");
                setSearchParams(nextParams, { replace: true });
              }}
            >
              <Plus className="h-3.5 w-3.5" /> New station
            </Button>
          ) : undefined
        }
      />

      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="mb-4">
          <TabsTrigger value="home">Home delivery</TabsTrigger>
          <TabsTrigger value="handoffs">Pickup handoffs</TabsTrigger>
          {showStations && <TabsTrigger value="stations">Pickup stations</TabsTrigger>}
        </TabsList>

        <TabsContent value="home">
          <DeliveryScreen rolePath={rolePath} embedded />
        </TabsContent>

        <TabsContent value="handoffs">
          <PickupHandoffsScreen rolePath={rolePath} embedded />
        </TabsContent>

        {showStations && (
          <TabsContent value="stations">
            <PickupStationsScreen embedded />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
