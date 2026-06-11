import { AccountingOverview } from "@/components/shared/AccountingOverview";
import { SalesRecordsScreen } from "@/components/shared/SalesRecordsScreen";
import { ExpensesScreen } from "@/components/shared/ExpensesScreen";
import { ReconciliationScreen } from "@/components/shared/ReconciliationScreen";
import { ProfitLossScreen } from "@/components/shared/ProfitLossScreen";
import { ReportsScreen } from "@/components/shared/ReportsScreen";
import { RefundsScreen } from "@/components/shared/RefundsScreen";
import { RefundDetailScreen } from "@/components/shared/RefundDetailScreen";

const PATH = "/accountant";

export function AccountantOverviewPage() { return <AccountingOverview />; }
export function AccountantSalesPage() { return <SalesRecordsScreen />; }
export function AccountantExpensesPage() { return <ExpensesScreen />; }
export function AccountantRefundsPage() { return <RefundsScreen rolePath={PATH} />; }
export function AccountantRefundDetailPage() { return <RefundDetailScreen rolePath={PATH} />; }
export function AccountantReconciliationPage() { return <ReconciliationScreen />; }
export function AccountantProfitLossPage() { return <ProfitLossScreen />; }
export function AccountantReportsPage() { return <ReportsScreen />; }
