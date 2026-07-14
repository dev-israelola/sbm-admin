import { AdminOverview } from "@/components/admin/AdminOverview";
import { OrdersScreen } from "@/components/shared/OrdersScreen";
import { OrderDetailScreen } from "@/components/shared/OrderDetailScreen";
import { RefundsScreen } from "@/components/shared/RefundsScreen";
import { RefundDetailScreen } from "@/components/shared/RefundDetailScreen";
import { InventoryScreen } from "@/components/shared/InventoryScreen";
import { InventoryMovementsScreen } from "@/components/shared/InventoryMovementsScreen";
import { DeliveryOperationsScreen } from "@/components/shared/DeliveryOperationsScreen";
import { DeliveryDetailScreen } from "@/components/shared/DeliveryDetailScreen";
import { PickupHandoffsScreen } from "@/components/shared/PickupHandoffsScreen";
import { ReportsScreen } from "@/components/shared/ReportsScreen";
import { StaffScreen } from "@/components/shared/StaffScreen";

import { ReviewsScreen } from "@/components/shared/ReviewsScreen";

const PATH = "/manager";

export function ManagerOverviewPage() { return <AdminOverview roleScope="manager" />; }
export function ManagerTeamPage() { return <StaffScreen />; }
export function ManagerOrdersPage() { return <OrdersScreen rolePath={PATH} />; }
export function ManagerOrderDetailPage() { return <OrderDetailScreen rolePath={PATH} />; }
export function ManagerInventoryPage() { return <InventoryScreen rolePath={PATH} />; }
export function ManagerMovementsPage() { return <InventoryMovementsScreen rolePath={PATH} />; }
export function ManagerDeliveryPage() { return <DeliveryOperationsScreen rolePath={PATH} />; }
export function ManagerDeliveryDetailPage() { return <DeliveryDetailScreen rolePath={PATH} />; }
export function ManagerPickupHandoffsPage() { return <PickupHandoffsScreen rolePath={PATH} />; }
export function ManagerRefundsPage() { return <RefundsScreen rolePath={PATH} />; }
export function ManagerRefundDetailPage() { return <RefundDetailScreen rolePath={PATH} />; }
export function ManagerReportsPage() { return <ReportsScreen />; }
export function ManagerReviewsPage() { return <ReviewsScreen rolePath={PATH} />; }
