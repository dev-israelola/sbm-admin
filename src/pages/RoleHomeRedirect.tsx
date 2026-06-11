import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth-store";
import { ROLE_HOME } from "@/types/role";

export default function RoleHomeRedirect() {
  const user = useAuthStore((s) => s.user);
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={ROLE_HOME[user.role]} replace />;
}
