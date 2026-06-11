import type { Role } from "./role";
import type { Platform } from "./platform";

export interface StaffUser {
  id: string;
  fullName: string;
  email: string;
  role: Role;
  platforms: Platform[];
  phone?: string;
  avatar?: string;
  joinedAt: string;
  active: boolean;
}

export interface Customer {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  joinedAt: string;
  lifetimeOrders: number;
  lifetimeSpend: number;
  rewardsBalance: number;
  city?: string;
  state?: string;
}
