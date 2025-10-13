import { Ticket } from "@acme/shared-models";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ticketsApi } from "client/src/app/api/tickets";

export function useGetTickets() {
  return useQuery<Ticket[]>({
    queryKey: ["tickets"],
    queryFn: ticketsApi.list,
  });
}

export function useGetTicket(ticketId: number) {
  const qc = useQueryClient();
  return useQuery<Ticket>({
    queryKey: ["ticket", ticketId],
    queryFn: () => ticketsApi.get(ticketId),
    initialData: () => {
      const tickets = qc.getQueryData<Ticket[]>(["tickets"]);
      return tickets?.find((ticket) => ticket.id === ticketId);
    },
    staleTime: 2000,
    enabled: !!ticketId,
  });
}

export function useCreateTicket() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ description }: { description: string }) =>
      ticketsApi.create(description),
    onMutate: async ({ description }) => {
      await qc.cancelQueries({ queryKey: ["tickets"] });

      const prev = qc.getQueryData<Ticket[]>(["tickets"]) ?? [];
      const tempId = -Date.now();
      const temp: Ticket = {
        id: tempId,
        description,
        assigneeId: null,
        completed: false,
      };

      qc.setQueryData<Ticket[]>(["tickets"], [...prev, temp]);

      return { prev, tempId };
    },

    onError: (_e, _vars, context) => {
      if (context?.prev) qc.setQueryData(["tickets"], context.prev);
    },

    onSuccess: (created, _vars, context) => {
      qc.setQueryData<Ticket[]>(["tickets"], (old) => {
        if (!old) return [created];
        const idx = old.findIndex((t) => t.id === context?.tempId);
        if (idx === -1) return [...old, created];
        const next = [...old];
        next[idx] = created;
        return next;
      });
      qc.setQueryData<Ticket>(["ticket", created.id], created);
    },

    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["tickets"] });
    },
  });
}

export function useToggleComplete() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, next }: { id: number; next: boolean }) => {
      return next ? ticketsApi.complete(id) : ticketsApi.incomplete(id);
    },
    onMutate: async ({ id, next }) => {
      await qc.cancelQueries({ queryKey: ["tickets"] });
      await qc.cancelQueries({ queryKey: ["ticket", id] });

      const prevList = qc.getQueryData<Ticket[]>(["tickets"]);
      const prevTicket = qc.getQueryData<Ticket>(["ticket", id]);

      if (prevList) {
        qc.setQueryData<Ticket[]>(
          ["tickets"],
          prevList.map((t) => (t.id === id ? { ...t, completed: next } : t))
        );
      }
      if (prevTicket) {
        qc.setQueryData<Ticket>(["ticket", id], {
          ...prevTicket,
          completed: next,
        });
      }
      return { prevList, prevTicket };
    },
    onError: (err, vars, context) => {
      if (context?.prevList) {
        qc.setQueryData<Ticket[]>(["tickets"], context.prevList);
      }
      if (context?.prevTicket) {
        qc.setQueryData<Ticket>(["ticket", vars.id], context.prevTicket);
      }
    },
    onSettled: (_data, _error, vars) => {
      qc.invalidateQueries({ queryKey: ["tickets"] });
      qc.invalidateQueries({ queryKey: ["ticket", vars.id] });
    },
  });
}

export function useAssignTicket() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      ticketId,
      userId,
    }: {
      ticketId: number;
      userId?: number;
    }) => {
      return typeof userId === "number"
        ? ticketsApi.assign(ticketId, userId)
        : ticketsApi.unassign(ticketId);
    },
    onMutate: async ({ ticketId, userId }) => {
      await Promise.all([
        qc.cancelQueries({ queryKey: ["tickets"] }),
        qc.cancelQueries({ queryKey: ["ticket", ticketId] }),
      ]);

      const prevList = qc.getQueryData<Ticket[]>(["tickets"]);
      const prevTicket = qc.getQueryData<Ticket>(["ticket", ticketId]);

      const patch = (t: Ticket) =>
        t.id === ticketId ? { ...t, assigneeId: userId ?? null } : t;

      if (prevList) qc.setQueryData<Ticket[]>(["tickets"], prevList.map(patch));
      if (prevTicket)
        qc.setQueryData<Ticket>(["ticket", ticketId], patch(prevTicket));

      return { prevList, prevTicket };
    },
    onError: (err, { ticketId }, context) => {
      if (context?.prevList)
        qc.setQueryData<Ticket[]>(["tickets"], context.prevList);
      if (context?.prevTicket)
        qc.setQueryData<Ticket>(
          ["ticket", ticketId],
          context.prevTicket as Ticket
        );
    },
    onSettled: (_data, _error, vars) => {
      qc.invalidateQueries({ queryKey: ["tickets"] });
      qc.invalidateQueries({ queryKey: ["ticket", vars.ticketId] });
    },
  });
}
