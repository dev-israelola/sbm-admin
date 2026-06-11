import type { Role } from "@/types/role";

export type Permission =
  | "overview.view"
  | "orders.view"
  | "orders.update"
  | "orders.cancel"
  | "orders.verify"
  | "orders.assignDelivery"
  | "orders.complete"
  | "orders.notes"
  | "products.view"
  | "products.write"
  | "inventory.view"
  | "inventory.adjust"
  | "delivery.view.all"
  | "delivery.view.assigned"
  | "delivery.update"
  | "refunds.view"
  | "refunds.decide"
  | "consultations.view"
  | "consultations.recommend"
  | "customers.view"
  | "rewards.view"
  | "rewards.adjust"
  | "accounting.view"
  | "accounting.expense.write"
  | "accounting.reconcile"
  | "reports.view"
  | "settings.view"
  | "settings.write"
  | "users.manage";

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  admin: [
    "overview.view",
    "orders.view", "orders.update", "orders.cancel", "orders.verify",
    "orders.assignDelivery", "orders.complete", "orders.notes",
    "products.view", "products.write",
    "inventory.view", "inventory.adjust",
    "delivery.view.all", "delivery.view.assigned", "delivery.update",
    "refunds.view", "refunds.decide",
    "consultations.view", "consultations.recommend",
    "customers.view",
    "rewards.view", "rewards.adjust",
    "accounting.view", "accounting.expense.write", "accounting.reconcile",
    "reports.view",
    "settings.view", "settings.write",
    "users.manage",
  ],
  manager: [
    "overview.view",
    "orders.view", "orders.update", "orders.cancel", "orders.verify",
    "orders.assignDelivery", "orders.complete", "orders.notes",
    "products.view",
    "inventory.view", "inventory.adjust",
    "delivery.view.all", "delivery.view.assigned", "delivery.update",
    "refunds.view", "refunds.decide",
    "consultations.view",
    "customers.view",
    "rewards.view",
    "reports.view",
  ],
  accountant: [
    "overview.view",
    "orders.view",
    "products.view",
    "refunds.view",
    "customers.view",
    "accounting.view", "accounting.expense.write", "accounting.reconcile",
    "reports.view",
  ],
  delivery: [
    "delivery.view.assigned",
    "delivery.update",
  ],
  consultant: [
    "consultations.view", "consultations.recommend",
    "products.view",
    "customers.view",
  ],
};

export function can(role: Role | null | undefined, permission: Permission): boolean {
  if (!role) return false;
  return ROLE_PERMISSIONS[role].includes(permission);
}

export function canAny(role: Role | null | undefined, perms: Permission[]): boolean {
  return perms.some((p) => can(role, p));
}
