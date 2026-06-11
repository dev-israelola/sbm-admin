export type Role =
  | "admin"
  | "manager"
  | "accountant"
  | "delivery"
  | "consultant";

export const ROLE_LABEL: Record<Role, string> = {
  admin: "Admin",
  manager: "Manager",
  accountant: "Accountant",
  delivery: "Delivery staff",
  consultant: "Consultant",
};

export const ROLE_HOME: Record<Role, string> = {
  admin: "/admin",
  manager: "/manager",
  accountant: "/accountant",
  delivery: "/delivery",
  consultant: "/consultant",
};
