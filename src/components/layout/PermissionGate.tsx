import type * as React from "react";
import { useAuthStore } from "@/store/auth-store";
import { can, type Permission } from "@/lib/permissions";

interface PermissionGateProps {
  permission: Permission;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export function PermissionGate({ permission, fallback = null, children }: PermissionGateProps) {
  const role = useAuthStore((s) => s.user?.role ?? null);
  if (!can(role, permission)) return <>{fallback}</>;
  return <>{children}</>;
}
