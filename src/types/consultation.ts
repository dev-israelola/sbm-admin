export type ConsultationStatus =
  | "pending"
  | "scheduled"
  | "completed"
  | "cancelled"
  | "recommendation-sent";

export interface Consultation {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  primaryConcern: string;
  goal: string;
  preferredDate: string;
  preferredTime: string;
  notes?: string;
  status: ConsultationStatus;
  consultantId?: string;
  consultantName?: string;
  recommendationId?: string;
  createdAt: string;
}

export interface RecommendationProductRef {
  productId: string;
  usage: string;
}

export interface RoutineBlock {
  time: "Morning" | "Evening" | "Weekly";
  steps: string[];
}

export interface ConsultationRecommendation {
  id: string;
  consultationId: string;
  consultantId: string;
  consultantName: string;
  title: string;
  note: string;
  routine: RoutineBlock[];
  products: RecommendationProductRef[];
  additionalAdvice?: string;
  sent: boolean;
  createdAt: string;
}
