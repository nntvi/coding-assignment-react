import { Ticket } from "@acme/shared-models";
import { fetchData } from "client/src/app/utils/fetch";

const prefix = "/api/tickets";

export const ticketsApi = {
  list: () => fetchData<Ticket[]>(`${prefix}`),
  get: (id: number) => fetchData<Ticket>(`${prefix}/${id}`),
  create: (desc: string) =>
    fetchData<Ticket>(`${prefix}`, {
      method: "POST",
      body: JSON.stringify({ description: desc }),
    }),
  assign: (ticketId: number, userId: number) =>
    fetchData(`${prefix}/${ticketId}/assign/${userId}`, {
      method: "PUT",
    }),
  unassign: (ticketId: number) =>
    fetchData(`${prefix}/${ticketId}/unassign`, {
      method: "PUT",
    }),
  complete: (ticketId: number) =>
    fetchData(`${prefix}/${ticketId}/complete`, {
      method: "PUT",
    }),
  incomplete: (ticketId: number) =>
    fetchData(`${prefix}/${ticketId}/complete`, {
      method: "DELETE",
    }),
};
