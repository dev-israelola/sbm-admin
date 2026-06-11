import { useAuthStore } from "@/store/auth-store";
import { DeliveryScreen } from "@/components/shared/DeliveryScreen";

export default function AssignmentsPage() {
  const user = useAuthStore((s) => s.user);
  return (
    <DeliveryScreen
      rolePath="/delivery"
      assigneeId={user?.id}
      title="My assignments"
      description="Update each delivery as you complete it."
    />
  );
}
