import {
  Activity,
  ArrowRightLeft,
  BarChart3,
  Boxes,
  CalendarOff,
  Calculator,
  ClipboardCheck,
  ClipboardList,
  CreditCard,
  FileText,
  Gift,
  LayoutDashboard,
  MapPin,
  MessageSquare,
  Newspaper,
  Package,
  Receipt,
  RotateCcw,
  Settings,
  ShoppingBag,
  Sparkles,
  Ticket,
  Truck,
  Tags,
  Users,
  Warehouse,
  type LucideIcon,
} from "lucide-react";
import type { Role } from "@/types/role";

export interface NavSection {
  title: string;
  items: { to: string; label: string; icon: LucideIcon; badgeKey?: string }[];
}

export const NAV_BY_ROLE: Record<Role, NavSection[]> = {
  admin: [
    {
      title: "Overview",
      items: [
        { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
      ],
    },
    {
      title: "Operations",
      items: [
        { to: "/admin/orders", label: "Orders", icon: ShoppingBag, badgeKey: "pendingOrders" },
        { to: "/admin/delivery", label: "Delivery", icon: Truck, badgeKey: "pendingPickup" },
        { to: "/admin/refunds", label: "Refunds", icon: RotateCcw, badgeKey: "pendingRefunds" },
        { to: "/admin/consultations", label: "Consultations", icon: MessageSquare },
        { to: "/admin/consultation-slots", label: "Consultation slots", icon: CalendarOff },
        { to: "/admin/delivery-terminals", label: "Delivery terminals", icon: MapPin },
      ],
    },
    {
      title: "Catalog",
      items: [
        { to: "/admin/products", label: "Products", icon: Package },
        { to: "/admin/categories", label: "Categories", icon: Tags },
        { to: "/admin/inventory", label: "Inventory", icon: Warehouse, badgeKey: "lowStock" },
        { to: "/admin/customers", label: "Customers", icon: Users },
        { to: "/admin/blog", label: "Journal", icon: Newspaper },
      ],
    },
    {
      title: "Finance",
      items: [
        { to: "/admin/accounting", label: "Accounting", icon: Calculator },
        { to: "/admin/accounting/transactions", label: "All transactions", icon: ArrowRightLeft },
        { to: "/admin/accounting/sales", label: "Sales", icon: Receipt },
        { to: "/admin/accounting/expenses", label: "Expenses", icon: CreditCard },
        { to: "/admin/accounting/reconciliation", label: "Reconciliation", icon: ClipboardCheck },
        { to: "/admin/accounting/profit-loss", label: "Profit & loss", icon: BarChart3 },
        { to: "/admin/rewards", label: "Rewards", icon: Gift },
        { to: "/admin/coupons", label: "Coupons", icon: Ticket },
      ],
    },
    {
      title: "System",
      items: [
        { to: "/admin/reports", label: "Reports", icon: FileText },
        { to: "/admin/team", label: "Team", icon: Users },
        { to: "/admin/settings", label: "Settings", icon: Settings },
        { to: "/admin/audit-logs", label: "Audit logs", icon: Activity },
      ],
    },
  ],
  manager: [
    {
      title: "Overview",
      items: [{ to: "/manager", label: "Dashboard", icon: LayoutDashboard }],
    },
    {
      title: "Operations",
      items: [
        { to: "/manager/orders", label: "Orders", icon: ShoppingBag, badgeKey: "pendingOrders" },
        { to: "/manager/inventory", label: "Inventory", icon: Warehouse, badgeKey: "lowStock" },
        { to: "/manager/delivery", label: "Delivery", icon: Truck, badgeKey: "pendingPickup" },
        { to: "/manager/refunds", label: "Refunds", icon: RotateCcw, badgeKey: "pendingRefunds" },
        { to: "/manager/reports", label: "Reports", icon: FileText },
        { to: "/manager/team", label: "Team", icon: Users },
      ],
    },
  ],
  accountant: [
    {
      title: "Overview",
      items: [{ to: "/accountant", label: "Dashboard", icon: LayoutDashboard }],
    },
    {
      title: "Books",
      items: [
        { to: "/accountant/sales", label: "Sales", icon: Receipt },
        { to: "/accountant/expenses", label: "Expenses", icon: CreditCard },
        { to: "/accountant/refunds", label: "Refunds", icon: RotateCcw },
        { to: "/accountant/reconciliation", label: "Reconciliation", icon: ClipboardCheck },
        { to: "/accountant/profit-loss", label: "Profit & loss", icon: BarChart3 },
        { to: "/accountant/reports", label: "Reports", icon: FileText },
      ],
    },
  ],
  delivery: [
    {
      title: "My deliveries",
      items: [
        { to: "/delivery", label: "Today", icon: LayoutDashboard },
        { to: "/delivery/assignments", label: "Assignments", icon: ClipboardList },
      ],
    },
  ],
  consultant: [
    {
      title: "Consultations",
      items: [
        { to: "/consultant", label: "Today", icon: LayoutDashboard },
        { to: "/consultant/consultations", label: "All consultations", icon: MessageSquare },
        { to: "/consultant/products", label: "Products", icon: Sparkles },
      ],
    },
  ],
};
