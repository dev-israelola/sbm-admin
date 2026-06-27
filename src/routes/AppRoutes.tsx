import { lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ProtectedRoute } from "./ProtectedRoute";
import { RoleGuard } from "./RoleGuard";

// public
const LoginPage = lazy(() => import("@/pages/LoginPage"));
const CompleteRegistrationPage = lazy(() => import("@/pages/CompleteRegistrationPage"));
const ForbiddenPage = lazy(() => import("@/pages/ForbiddenPage"));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));
const RoleHomeRedirect = lazy(() => import("@/pages/RoleHomeRedirect"));

// admin
const adminMod = () => import("@/pages/admin");
const AdminOverviewPage = lazy(() => adminMod().then((m) => ({ default: m.AdminOverviewPage })));
const AdminOrdersPage = lazy(() => adminMod().then((m) => ({ default: m.AdminOrdersPage })));
const AdminOrderDetailPage = lazy(() => adminMod().then((m) => ({ default: m.AdminOrderDetailPage })));
const AdminRefundsPage = lazy(() => adminMod().then((m) => ({ default: m.AdminRefundsPage })));
const AdminRefundDetailPage = lazy(() => adminMod().then((m) => ({ default: m.AdminRefundDetailPage })));
const AdminInventoryPage = lazy(() => adminMod().then((m) => ({ default: m.AdminInventoryPage })));
const AdminMovementsPage = lazy(() => adminMod().then((m) => ({ default: m.AdminMovementsPage })));
const AdminProductsPage = lazy(() => adminMod().then((m) => ({ default: m.AdminProductsPage })));
const AdminProductNewPage = lazy(() => adminMod().then((m) => ({ default: m.AdminProductNewPage })));
const AdminProductEditPage = lazy(() => adminMod().then((m) => ({ default: m.AdminProductEditPage })));
const AdminDeliveryPage = lazy(() => adminMod().then((m) => ({ default: m.AdminDeliveryPage })));
const AdminDeliveryDetailPage = lazy(() => adminMod().then((m) => ({ default: m.AdminDeliveryDetailPage })));
const AdminConsultationsPage = lazy(() => adminMod().then((m) => ({ default: m.AdminConsultationsPage })));
const AdminConsultationDetailPage = lazy(() => adminMod().then((m) => ({ default: m.AdminConsultationDetailPage })));
const AdminConsultationSlotsPage = lazy(() => adminMod().then((m) => ({ default: m.AdminConsultationSlotsPage })));
const AdminDeliveryTerminalsPage = lazy(() => adminMod().then((m) => ({ default: m.AdminDeliveryTerminalsPage })));
const AdminBlogPage = lazy(() => adminMod().then((m) => ({ default: m.AdminBlogPage })));
const AdminCustomersPage = lazy(() => adminMod().then((m) => ({ default: m.AdminCustomersPage })));
const AdminRewardsPage = lazy(() => adminMod().then((m) => ({ default: m.AdminRewardsPage })));
const AdminCouponsPage = lazy(() => adminMod().then((m) => ({ default: m.AdminCouponsPage })));
const AdminAccountingOverviewPage = lazy(() => adminMod().then((m) => ({ default: m.AdminAccountingOverviewPage })));
const AdminAccountingSalesPage = lazy(() => adminMod().then((m) => ({ default: m.AdminAccountingSalesPage })));
const AdminAccountingExpensesPage = lazy(() => adminMod().then((m) => ({ default: m.AdminAccountingExpensesPage })));
const AdminAccountingRefundsPage = lazy(() => adminMod().then((m) => ({ default: m.AdminAccountingRefundsPage })));
const AdminAccountingReconciliationPage = lazy(() => adminMod().then((m) => ({ default: m.AdminAccountingReconciliationPage })));
const AdminAccountingProfitLossPage = lazy(() => adminMod().then((m) => ({ default: m.AdminAccountingProfitLossPage })));
const AdminReportsPage = lazy(() => adminMod().then((m) => ({ default: m.AdminReportsPage })));
const AdminSettingsPage = lazy(() => adminMod().then((m) => ({ default: m.AdminSettingsPage })));
const AdminTeamPage = lazy(() => adminMod().then((m) => ({ default: m.AdminTeamPage })));

// manager
const mgrMod = () => import("@/pages/manager");
const ManagerOverviewPage = lazy(() => mgrMod().then((m) => ({ default: m.ManagerOverviewPage })));
const ManagerOrdersPage = lazy(() => mgrMod().then((m) => ({ default: m.ManagerOrdersPage })));
const ManagerOrderDetailPage = lazy(() => mgrMod().then((m) => ({ default: m.ManagerOrderDetailPage })));
const ManagerInventoryPage = lazy(() => mgrMod().then((m) => ({ default: m.ManagerInventoryPage })));
const ManagerMovementsPage = lazy(() => mgrMod().then((m) => ({ default: m.ManagerMovementsPage })));
const ManagerDeliveryPage = lazy(() => mgrMod().then((m) => ({ default: m.ManagerDeliveryPage })));
const ManagerDeliveryDetailPage = lazy(() => mgrMod().then((m) => ({ default: m.ManagerDeliveryDetailPage })));
const ManagerRefundsPage = lazy(() => mgrMod().then((m) => ({ default: m.ManagerRefundsPage })));
const ManagerRefundDetailPage = lazy(() => mgrMod().then((m) => ({ default: m.ManagerRefundDetailPage })));
const ManagerReportsPage = lazy(() => mgrMod().then((m) => ({ default: m.ManagerReportsPage })));
const ManagerTeamPage = lazy(() => mgrMod().then((m) => ({ default: m.ManagerTeamPage })));

// accountant
const accMod = () => import("@/pages/accountant");
const AccountantOverviewPage = lazy(() => accMod().then((m) => ({ default: m.AccountantOverviewPage })));
const AccountantSalesPage = lazy(() => accMod().then((m) => ({ default: m.AccountantSalesPage })));
const AccountantExpensesPage = lazy(() => accMod().then((m) => ({ default: m.AccountantExpensesPage })));
const AccountantRefundsPage = lazy(() => accMod().then((m) => ({ default: m.AccountantRefundsPage })));
const AccountantRefundDetailPage = lazy(() => accMod().then((m) => ({ default: m.AccountantRefundDetailPage })));
const AccountantReconciliationPage = lazy(() => accMod().then((m) => ({ default: m.AccountantReconciliationPage })));
const AccountantProfitLossPage = lazy(() => accMod().then((m) => ({ default: m.AccountantProfitLossPage })));
const AccountantReportsPage = lazy(() => accMod().then((m) => ({ default: m.AccountantReportsPage })));

// delivery
const DeliveryDashboardPage = lazy(() => import("@/pages/delivery/DeliveryDashboardPage"));
const AssignmentsPage = lazy(() => import("@/pages/delivery/AssignmentsPage"));
const AssignmentDetailPage = lazy(() => import("@/pages/delivery/AssignmentDetailPage"));

// consultant
const ConsultantDashboardPage = lazy(() => import("@/pages/consultant/ConsultantDashboardPage"));
const conMod = () => import("@/pages/consultant");
const ConsultantConsultationsPage = lazy(() => conMod().then((m) => ({ default: m.ConsultantConsultationsPage })));
const ConsultantConsultationDetailPage = lazy(() => conMod().then((m) => ({ default: m.ConsultantConsultationDetailPage })));
const ConsultantProductsPage = lazy(() => conMod().then((m) => ({ default: m.ConsultantProductsPage })));

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/complete-registration" element={<CompleteRegistrationPage />} />
      <Route path="/403" element={<ForbiddenPage />} />
      <Route path="/" element={<RoleHomeRedirect />} />

      <Route element={<ProtectedRoute />}>
        {/* Admin */}
        <Route element={<RoleGuard roles={["admin"]} />}>
          <Route path="/admin" element={<DashboardLayout />}>
            <Route index element={<AdminOverviewPage />} />
            <Route path="orders" element={<AdminOrdersPage />} />
            <Route path="orders/:id" element={<AdminOrderDetailPage />} />
            <Route path="refunds" element={<AdminRefundsPage />} />
            <Route path="refunds/:id" element={<AdminRefundDetailPage />} />
            <Route path="inventory" element={<AdminInventoryPage />} />
            <Route path="inventory/movements" element={<AdminMovementsPage />} />
            <Route path="products" element={<AdminProductsPage />} />
            <Route path="products/new" element={<AdminProductNewPage />} />
            <Route path="products/:id/edit" element={<AdminProductEditPage />} />
            <Route path="delivery" element={<AdminDeliveryPage />} />
            <Route path="delivery/:id" element={<AdminDeliveryDetailPage />} />
            <Route path="pickup-handoffs" element={<Navigate to="/admin/delivery?tab=handoffs" replace />} />
            <Route path="pickup-stations" element={<Navigate to="/admin/delivery?tab=stations" replace />} />
            <Route path="consultations" element={<AdminConsultationsPage />} />
            <Route path="consultation-slots" element={<AdminConsultationSlotsPage />} />
            <Route path="delivery-terminals" element={<AdminDeliveryTerminalsPage />} />
            <Route path="blog" element={<AdminBlogPage />} />
            <Route path="consultations/:id" element={<AdminConsultationDetailPage />} />
            <Route path="customers" element={<AdminCustomersPage />} />
            <Route path="rewards" element={<AdminRewardsPage />} />
            <Route path="coupons" element={<AdminCouponsPage />} />
            <Route path="accounting" element={<AdminAccountingOverviewPage />} />
            <Route path="accounting/sales" element={<AdminAccountingSalesPage />} />
            <Route path="accounting/expenses" element={<AdminAccountingExpensesPage />} />
            <Route path="accounting/refunds" element={<AdminAccountingRefundsPage />} />
            <Route path="accounting/reconciliation" element={<AdminAccountingReconciliationPage />} />
            <Route path="accounting/profit-loss" element={<AdminAccountingProfitLossPage />} />
            <Route path="reports" element={<AdminReportsPage />} />
            <Route path="team" element={<AdminTeamPage />} />
            <Route path="settings" element={<AdminSettingsPage />} />
          </Route>
        </Route>

        {/* Manager */}
        <Route element={<RoleGuard roles={["manager", "admin"]} />}>
          <Route path="/manager" element={<DashboardLayout />}>
            <Route index element={<ManagerOverviewPage />} />
            <Route path="orders" element={<ManagerOrdersPage />} />
            <Route path="orders/:id" element={<ManagerOrderDetailPage />} />
            <Route path="inventory" element={<ManagerInventoryPage />} />
            <Route path="inventory/movements" element={<ManagerMovementsPage />} />
            <Route path="delivery" element={<ManagerDeliveryPage />} />
            <Route path="delivery/:id" element={<ManagerDeliveryDetailPage />} />
            <Route path="pickup-handoffs" element={<Navigate to="/manager/delivery?tab=handoffs" replace />} />
            <Route path="refunds" element={<ManagerRefundsPage />} />
            <Route path="refunds/:id" element={<ManagerRefundDetailPage />} />
            <Route path="reports" element={<ManagerReportsPage />} />
            <Route path="team" element={<ManagerTeamPage />} />
          </Route>
        </Route>

        {/* Accountant */}
        <Route element={<RoleGuard roles={["accountant", "admin"]} />}>
          <Route path="/accountant" element={<DashboardLayout />}>
            <Route index element={<AccountantOverviewPage />} />
            <Route path="sales" element={<AccountantSalesPage />} />
            <Route path="expenses" element={<AccountantExpensesPage />} />
            <Route path="refunds" element={<AccountantRefundsPage />} />
            <Route path="refunds/:id" element={<AccountantRefundDetailPage />} />
            <Route path="reconciliation" element={<AccountantReconciliationPage />} />
            <Route path="profit-loss" element={<AccountantProfitLossPage />} />
            <Route path="reports" element={<AccountantReportsPage />} />
          </Route>
        </Route>

        {/* Delivery */}
        <Route element={<RoleGuard roles={["delivery", "admin"]} />}>
          <Route path="/delivery" element={<DashboardLayout />}>
            <Route index element={<DeliveryDashboardPage />} />
            <Route path="assignments" element={<AssignmentsPage />} />
            <Route path="assignments/:id" element={<AssignmentDetailPage />} />
          </Route>
        </Route>

        {/* Consultant */}
        <Route element={<RoleGuard roles={["consultant", "admin"]} />}>
          <Route path="/consultant" element={<DashboardLayout />}>
            <Route index element={<ConsultantDashboardPage />} />
            <Route path="consultations" element={<ConsultantConsultationsPage />} />
            <Route path="consultations/:id" element={<ConsultantConsultationDetailPage />} />
            <Route path="products" element={<ConsultantProductsPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
