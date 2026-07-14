// Thin role-scoped wrappers for shared screens. Lazy-loaded by the router.
import { AdminOverview } from "@/components/admin/AdminOverview";
import { OrdersScreen } from "@/components/shared/OrdersScreen";
import { OrderDetailScreen } from "@/components/shared/OrderDetailScreen";
import { RefundsScreen } from "@/components/shared/RefundsScreen";
import { RefundDetailScreen } from "@/components/shared/RefundDetailScreen";
import { InventoryScreen } from "@/components/shared/InventoryScreen";
import { InventoryMovementsScreen } from "@/components/shared/InventoryMovementsScreen";
import { ProductsScreen } from "@/components/shared/ProductsScreen";
import { ProductFormScreen } from "@/components/shared/ProductFormScreen";
import { CategoriesScreen } from "@/components/shared/CategoriesScreen";
import { CategoryFormScreen } from "@/components/shared/CategoryFormScreen";
import { DeliveryOperationsScreen } from "@/components/shared/DeliveryOperationsScreen";
import { DeliveryDetailScreen } from "@/components/shared/DeliveryDetailScreen";
import { PickupHandoffsScreen } from "@/components/shared/PickupHandoffsScreen";
import { PickupStationsScreen } from "@/components/shared/PickupStationsScreen";
import { ConsultationsScreen } from "@/components/shared/ConsultationsScreen";
import { ConsultationDetailScreen } from "@/components/shared/ConsultationDetailScreen";
import { ConsultationBlocksScreen } from "@/components/shared/ConsultationBlocksScreen";
import { DeliveryTerminalsScreen } from "@/components/shared/DeliveryTerminalsScreen";
import { BlogScreen } from "@/components/shared/BlogScreen";
import { CustomersScreen } from "@/components/shared/CustomersScreen";
import { RewardsScreen } from "@/components/shared/RewardsScreen";
import { CouponsScreen } from "@/components/shared/CouponsScreen";
import { AccountingOverview } from "@/components/shared/AccountingOverview";
import { SalesRecordsScreen } from "@/components/shared/SalesRecordsScreen";
import { ExpensesScreen } from "@/components/shared/ExpensesScreen";
import { ReconciliationScreen } from "@/components/shared/ReconciliationScreen";
import { ProfitLossScreen } from "@/components/shared/ProfitLossScreen";
import { ReportsScreen } from "@/components/shared/ReportsScreen";
import { SettingsScreen } from "@/components/shared/SettingsScreen";
import { StaffScreen } from "@/components/shared/StaffScreen";
import { AuditLogsScreen } from "@/components/shared/AuditLogsScreen";
import { TransactionsScreen } from "@/components/shared/TransactionsScreen";

const PATH = "/admin";

export function AdminOverviewPage() { return <AdminOverview />; }
export function AdminTeamPage() { return <StaffScreen />; }
export function AdminOrdersPage() { return <OrdersScreen rolePath={PATH} />; }
export function AdminOrderDetailPage() { return <OrderDetailScreen rolePath={PATH} />; }
export function AdminRefundsPage() { return <RefundsScreen rolePath={PATH} />; }
export function AdminRefundDetailPage() { return <RefundDetailScreen rolePath={PATH} />; }
export function AdminInventoryPage() { return <InventoryScreen rolePath={PATH} />; }
export function AdminMovementsPage() { return <InventoryMovementsScreen rolePath={PATH} />; }
export function AdminProductsPage() { return <ProductsScreen rolePath={PATH} />; }
export function AdminProductNewPage() { return <ProductFormScreen rolePath={PATH} mode="new" />; }
export function AdminProductEditPage() { return <ProductFormScreen rolePath={PATH} mode="edit" />; }
export function AdminCategoriesPage() { return <CategoriesScreen rolePath={PATH} />; }
export function AdminCategoryNewPage() { return <CategoryFormScreen rolePath={PATH} mode="new" />; }
export function AdminCategoryEditPage() { return <CategoryFormScreen rolePath={PATH} mode="edit" />; }
export function AdminDeliveryPage() { return <DeliveryOperationsScreen rolePath={PATH} />; }
export function AdminDeliveryDetailPage() { return <DeliveryDetailScreen rolePath={PATH} />; }
export function AdminPickupHandoffsPage() { return <PickupHandoffsScreen rolePath={PATH} />; }
export function AdminPickupStationsPage() { return <PickupStationsScreen />; }
export function AdminConsultationsPage() { return <ConsultationsScreen rolePath={PATH} />; }
export function AdminConsultationDetailPage() { return <ConsultationDetailScreen rolePath={PATH} />; }
export function AdminConsultationSlotsPage() { return <ConsultationBlocksScreen />; }
export function AdminDeliveryTerminalsPage() { return <DeliveryTerminalsScreen />; }
export function AdminBlogPage() { return <BlogScreen />; }
export function AdminCustomersPage() { return <CustomersScreen />; }
export function AdminRewardsPage() { return <RewardsScreen />; }
export function AdminCouponsPage() { return <CouponsScreen />; }
export function AdminAccountingOverviewPage() { return <AccountingOverview />; }
export function AdminAccountingTransactionsPage() { return <TransactionsScreen />; }
export function AdminAccountingSalesPage() { return <SalesRecordsScreen />; }
export function AdminAccountingExpensesPage() { return <ExpensesScreen />; }
export function AdminAccountingRefundsPage() { return <RefundsScreen rolePath={PATH} />; }
export function AdminAccountingReconciliationPage() { return <ReconciliationScreen />; }
export function AdminAccountingProfitLossPage() { return <ProfitLossScreen />; }
export function AdminReportsPage() { return <ReportsScreen />; }
export function AdminSettingsPage() { return <SettingsScreen />; }
export function AdminAuditLogsPage() { return <AuditLogsScreen />; }
