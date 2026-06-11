import type { StaffUser } from "@/types/user";
import type { Role } from "@/types/role";

export const MOCK_STAFF: StaffUser[] = [
  {
    id: "u_admin",
    fullName: "Adaeze Okafor",
    email: "admin@naturale.studio",
    role: "admin",
    platforms: ["harbs", "holistic"],
    phone: "+234 803 555 0001",
    joinedAt: "2024-08-12",
    active: true,
  },
  {
    id: "u_manager",
    fullName: "Tope Bamidele",
    email: "manager@naturale.studio",
    role: "manager",
    platforms: ["harbs"],
    phone: "+234 803 555 0002",
    joinedAt: "2024-09-04",
    active: true,
  },
  {
    id: "u_accountant",
    fullName: "Nneka Eze",
    email: "accountant@naturale.studio",
    role: "accountant",
    platforms: ["harbs"],
    phone: "+234 803 555 0003",
    joinedAt: "2024-10-19",
    active: true,
  },
  {
    id: "u_delivery_1",
    fullName: "Musa Ibrahim",
    email: "musa@naturale.studio",
    role: "delivery",
    platforms: ["harbs"],
    phone: "+234 803 555 0010",
    joinedAt: "2025-01-08",
    active: true,
  },
  {
    id: "u_delivery_2",
    fullName: "Kelechi Okoro",
    email: "kelechi@naturale.studio",
    role: "delivery",
    platforms: ["harbs"],
    phone: "+234 803 555 0011",
    joinedAt: "2025-02-21",
    active: true,
  },
  {
    id: "u_consultant_1",
    fullName: "Ifeoma Nweke",
    email: "ifeoma@naturale.studio",
    role: "consultant",
    platforms: ["harbs"],
    phone: "+234 803 555 0020",
    joinedAt: "2024-11-12",
    active: true,
  },
  {
    id: "u_consultant_2",
    fullName: "Dr. Hauwa Sani",
    email: "hauwa@naturale.studio",
    role: "consultant",
    platforms: ["harbs"],
    phone: "+234 803 555 0021",
    joinedAt: "2025-03-04",
    active: true,
  },
];

export const STAFF_BY_ROLE: Record<Role, StaffUser[]> = {
  admin: MOCK_STAFF.filter((u) => u.role === "admin"),
  manager: MOCK_STAFF.filter((u) => u.role === "manager"),
  accountant: MOCK_STAFF.filter((u) => u.role === "accountant"),
  delivery: MOCK_STAFF.filter((u) => u.role === "delivery"),
  consultant: MOCK_STAFF.filter((u) => u.role === "consultant"),
};

// Demo credentials shown on the login page — anything goes since auth is mocked.
export const DEMO_CREDENTIALS: { role: Role; email: string; password: string }[] = [
  { role: "admin", email: "admin@naturale.studio", password: "naturale" },
  { role: "manager", email: "manager@naturale.studio", password: "naturale" },
  { role: "accountant", email: "accountant@naturale.studio", password: "naturale" },
  { role: "delivery", email: "musa@naturale.studio", password: "naturale" },
  { role: "consultant", email: "ifeoma@naturale.studio", password: "naturale" },
];
