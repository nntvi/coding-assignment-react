import { Ticket } from "@acme/shared-models";
import { Alert, Box } from "@mui/material";
import {
  useGetTickets,
  useToggleComplete,
} from "client/src/app/queries/useTicket";
import { useGetUsers } from "client/src/app/queries/useUser";
import {
  AssignDialog,
  TicketDialog,
  TicketsTable,
  TicketsToolbar,
} from "client/src/app/tickets/components";
import { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";

export type Filter = "all" | "completed" | "incomplete";

export function Tickets() {
  const location = useLocation();
  const [filter, setFilter] = useState<Filter>("all");
  const [openTicket, setOpenTicket] = useState(false);
  const [pendingToggleId, setPendingToggleId] = useState<number | null>(null);
  const [assignTicket, setAssignTicket] = useState<Ticket | null>(null);

  const { data: tickets = [], isLoading, isError, refetch } = useGetTickets();
  const { data: users = [] } = useGetUsers();
  const toggle = useToggleComplete();

  const filteredTickets = useMemo(() => {
    return tickets.filter((t) =>
      filter === "all"
        ? true
        : filter === "completed"
        ? t.completed
        : !t.completed
    );
  }, [tickets, filter]);
  const getAssigneeName = (assigneeId?: number) =>
    assigneeId ? users.find((u) => u.id === assigneeId)?.name : "-";
  const handleToggle = (t: Ticket) => {
    setPendingToggleId(t.id);
    const next = !t.completed;
    toggle.mutate(
      { id: t.id, next },
      { onSettled: () => setPendingToggleId(null) }
    );
  };
  return (
    <Box mt={2}>
      <TicketsToolbar
        filter={filter}
        onFilterChange={setFilter}
        onOpenNew={() => setOpenTicket(true)}
      />
      {isError && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => refetch()}>
          Error loading tickets
        </Alert>
      )}
      <TicketsTable
        location={location}
        tickets={filteredTickets}
        loading={isLoading}
        getAssigneeName={getAssigneeName}
        onToggle={handleToggle}
        isToggling={(id) => toggle.isPending && pendingToggleId === id}
        onOpenAssign={setAssignTicket}
      />
      {openTicket && (
        <TicketDialog open={openTicket} onClose={() => setOpenTicket(false)} />
      )}
      {assignTicket && (
        <AssignDialog
          open
          onClose={() => setAssignTicket(null)}
          ticket={assignTicket}
          users={users}
        />
      )}
    </Box>
  );
}

export default Tickets;
