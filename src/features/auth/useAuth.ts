import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/auth-store";
import type { StaffUser } from "@/types/user";
import type { Customer } from "@/types/user";
import { qk } from "@/lib/query-client";

export function useLogin() {
  const signIn = useAuthStore((s) => s.signIn);
  return useMutation({
    mutationFn: async (body: { email: string; password: string }) => {
      const { data } = await api.post("/auth/login", body);
      signIn(data.user, data.token);
      return data;
    },
  });
}

export function useStaff() {
  const activePlatform = useAuthStore((s) => s.activePlatform);
  return useQuery({
    queryKey: qk.users(activePlatform),
    queryFn: async () => {
      const { data } = await api.get<StaffUser[]>("/users");
      return data;
    },
  });
}

export function useCustomers() {
  const activePlatform = useAuthStore((s) => s.activePlatform);
  return useQuery({
    queryKey: qk.customers(activePlatform),
    queryFn: async () => {
      const { data } = await api.get<Customer[]>("/customers");
      return data;
    },
  });
}
