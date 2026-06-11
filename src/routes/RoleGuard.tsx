import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/auth-store";
import type { Role } from "@/types/role";

interface RoleGuardProps {
  roles: Role[];
}

export function RoleGuard({ roles }: RoleGuardProps) {
  const user = useAuthStore((s) => s.user);
  if (!user) return <Navigate to="/login" replace />;
  if (!roles.includes(user.role)) {
    return <Navigate to="/403" replace />;
  }
  return <Outlet />;
}
