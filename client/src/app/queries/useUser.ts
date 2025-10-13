import { User } from "@acme/shared-models";
import { useQuery } from "@tanstack/react-query";
import { usersApi } from "client/src/app/api/users";

export function useGetUsers() {
  return useQuery<User[]>({
    queryKey: ["users"],
    queryFn: usersApi.list,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}
