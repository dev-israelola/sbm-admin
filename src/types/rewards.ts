export type RewardActivityType = "earned" | "redeemed" | "reversed" | "adjusted" | "expired";

export interface RewardActivity {
  id: string;
  customerId: string;
  date: string;
  type: RewardActivityType;
  points: number;
  orderNumber?: string;
  note: string;
  by?: string;
}

export interface CustomerRewardsSummary {
  customerId: string;
  customerName: string;
  customerEmail: string;
  current: number;
  lifetime: number;
  redeemed: number;
  lastActivity?: string;
  status: "active" | "frozen";
}
