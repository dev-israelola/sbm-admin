import { ConsultationsScreen } from "@/components/shared/ConsultationsScreen";
import { ConsultationDetailScreen } from "@/components/shared/ConsultationDetailScreen";
import { ProductsScreen } from "@/components/shared/ProductsScreen";

const PATH = "/consultant";

export function ConsultantConsultationsPage() { return <ConsultationsScreen rolePath={PATH} />; }
export function ConsultantConsultationDetailPage() { return <ConsultationDetailScreen rolePath={PATH} />; }
export function ConsultantProductsPage() { return <ProductsScreen rolePath={PATH} />; }
