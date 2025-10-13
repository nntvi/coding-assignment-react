import { User } from "@acme/shared-models";
import { fetchData } from "client/src/app/utils/fetch";

const prefix = "/api/users";
export const usersApi = {
  list: () => fetchData<User[]>(`${prefix}`),
  get: (id: number) => fetchData<User>(`${prefix}/${id}`),
};
