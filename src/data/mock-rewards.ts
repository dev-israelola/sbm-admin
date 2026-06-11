import type { RewardActivity, CustomerRewardsSummary } from "@/types/rewards";
import { MOCK_CUSTOMERS } from "./mock-customers";

export const MOCK_REWARDS: CustomerRewardsSummary[] = MOCK_CUSTOMERS.map((c) => ({
    customerId: c.id,
    customerName: c.fullName,
    customerEmail: c.email,
    current: c.rewardsBalance,
    lifetime: c.rewardsBalance + Math.round(c.lifetimeSpend / 200),
    redeemed: Math.max(0, Math.round(c.lifetimeSpend / 600)),
    lastActivity: new Date(Date.now() - (Math.random() * 60) * 24 * 60 * 60 * 1000).toISOString(),
    status: c.rewardsBalance < 1000 ? "active" : "active",
  }));

export const MOCK_REWARD_ACTIVITY: RewardActivity[] = MOCK_REWARDS.slice(0, 12).flatMap((r, i) => [
  {
    id: `rw_${r.customerId}_1`,
    customerId: r.customerId,
    date: new Date(Date.now() - (3 + i) * 24 * 60 * 60 * 1000).toISOString(),
    type: "earned",
    points: 95 + (i * 7),
    orderNumber: `HRB-${1010 + i}`,
    note: "Order completed",
  },
  {
    id: `rw_${r.customerId}_2`,
    customerId: r.customerId,
    date: new Date(Date.now() - (20 + i) * 24 * 60 * 60 * 1000).toISOString(),
    type: "redeemed",
    points: -60 - i * 3,
    orderNumber: `HRB-${1000 + i}`,
    note: "Applied at checkout",
  },
  ...(i % 4 === 0
    ? [
        {
          id: `rw_${r.customerId}_3`,
          customerId: r.customerId,
          date: new Date(Date.now() - (40 + i) * 24 * 60 * 60 * 1000).toISOString(),
          type: "reversed" as const,
          points: -((i * 11) + 30),
          orderNumber: `HRB-${990 + i}`,
          note: "Order refunded — points reversed",
        },
      ]
    : []),
]);
