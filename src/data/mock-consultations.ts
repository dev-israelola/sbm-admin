import type { Consultation, ConsultationRecommendation } from "@/types/consultation";
import { MOCK_CUSTOMERS } from "./mock-customers";

const CONCERNS = [
  "Sleep & rest",
  "Stress & calm",
  "Digestion",
  "Energy & vitality",
  "Immunity",
  "Hormonal balance",
  "Joint comfort",
  "Hair & scalp",
  "Respiratory wellness",
  "Skin recovery",
];

const GOALS = [
  "Calmer evenings, deeper sleep",
  "Reduce post-meal bloating",
  "Steady energy through the workday",
  "Reduce seasonal congestion",
  "Even tone over 8 weeks",
  "Support cycle regularity",
  "Strengthen hair over six months",
  "Reduce joint stiffness in mornings",
];

const STATUSES: Consultation["status"][] = [
  "pending",
  "scheduled",
  "completed",
  "completed",
  "recommendation-sent",
  "cancelled",
];

export const MOCK_CONSULTATIONS: Consultation[] = Array.from({ length: 25 }).map((_, i) => {
  const customer = MOCK_CUSTOMERS[i % MOCK_CUSTOMERS.length];
  const status = STATUSES[i % STATUSES.length];
  const date = new Date(Date.now() + (i % 3 === 0 ? 5 : -1) * (i + 1) * 24 * 60 * 60 * 1000);
  const consultant =
    status === "pending"
      ? undefined
      : i % 2 === 0
        ? { id: "u_consultant_1", name: "Ifeoma Nweke" }
        : { id: "u_consultant_2", name: "Dr. Hauwa Sani" };

  return {
    id: `con_${String(i + 1).padStart(3, "0")}`,
    customerId: customer.id,
    customerName: customer.fullName,
    customerEmail: customer.email,
    customerPhone: customer.phone,
    primaryConcern: CONCERNS[i % CONCERNS.length],
    goal: GOALS[i % GOALS.length],
    preferredDate: date.toISOString().slice(0, 10),
    preferredTime: `${String(9 + (i % 8)).padStart(2, "0")}:${i % 2 === 0 ? "00" : "30"}`,
    notes: i % 4 === 0 ? "Currently on prescription medication — please advise." : undefined,
    status,
    consultantId: consultant?.id,
    consultantName: consultant?.name,
    recommendationId:
      status === "recommendation-sent" || status === "completed"
        ? `rec_${String(i + 1).padStart(3, "0")}`
        : undefined,
    createdAt: new Date(Date.now() - (i + 1) * 24 * 60 * 60 * 1000).toISOString(),
  };
});

export const MOCK_RECOMMENDATIONS: ConsultationRecommendation[] = MOCK_CONSULTATIONS
  .filter((c) => c.recommendationId)
  .map((c) => ({
    id: c.recommendationId!,
    consultationId: c.id,
    consultantId: c.consultantId ?? "u_consultant_1",
    consultantName: c.consultantName ?? "Ifeoma Nweke",
    title: `${c.primaryConcern} protocol`,
    note:
      "We're starting with the nervous system. Six weeks of nightly drops and the calm-belly infusion. We re-assess at the consultation follow-up.",
    routine: [
      {
        time: "Morning",
        steps: [
          "Moringa + Iron Botanical — 2 capsules with breakfast",
          "Hibiscus + Rose Hip Wellness Tea — 1 cup",
        ],
      },
      {
        time: "Evening",
        steps: [
          "Calm-Belly Peppermint Infusion — 1 cup after dinner",
          "Ashwagandha Calm Drops — 1 ml under tongue, 30 min before bed",
          "Lavender Sleep Pillow Mist — over bedding",
        ],
      },
      {
        time: "Weekly",
        steps: ["Digestive Bitters Tonic — 5 ml before two meals a week"],
      },
    ],
    products: [
      { productId: "p_018", usage: "AM with breakfast" },
      { productId: "p_022", usage: "AM, hot or chilled" },
      { productId: "p_023", usage: "After dinner" },
      { productId: "p_016", usage: "30 min before sleep" },
      { productId: "p_020", usage: "Spritz over pillow nightly" },
    ],
    additionalAdvice: "Avoid caffeine after 2pm. Re-assess in 6 weeks.",
    sent: c.status === "recommendation-sent",
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
  }));
