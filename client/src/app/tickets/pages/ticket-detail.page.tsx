import { Avatar, Box, Button, Chip, Stack, Typography } from "@mui/material";
import {
  useGetTicket,
  useToggleComplete,
} from "client/src/app/queries/useTicket";
import { useGetUsers } from "client/src/app/queries/useUser";
import { AssignDialog } from "client/src/app/tickets/components";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
export default function TicketDetailsPage() {
  const nav = useNavigate();
  const { ticketId: id } = useParams();
  const ticketId = Number(id);
  const { data: ticket, isLoading, isError } = useGetTicket(ticketId);
  const { data: users = [] } = useGetUsers();
  const toggle = useToggleComplete();
  const [openAssign, setOpenAssign] = useState(false);
  const assigneeName = ticket?.assigneeId
    ? users.find((u) => u.id === ticket.assigneeId)?.name ?? "Unassigned"
    : "Unassigned";

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <Typography variant="body1" color="text.secondary">
          Loading…
        </Typography>
      </Box>
    );
  }

  if (isError || !ticket) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <Typography variant="body1" color="error.main">
          Not found
        </Typography>
      </Box>
    );
  }

  const isCompleted = ticket.completed;
  const next = !isCompleted;

  return (
    <Box
      sx={{
        p: 3,
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mb={2}
        spacing={1}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant="h6" fontWeight={700}>
            Ticket {ticketId}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            •
          </Typography>
          {assigneeName !== "Unassigned" && (
            <Avatar
              sx={{
                width: 24,
                height: 24,
                bgcolor:
                  assigneeName === "Unassigned" ? "grey.200" : "primary.main",
                color:
                  assigneeName === "Unassigned" ? "text.secondary" : "white",
                fontSize: "0.875rem",
              }}
            >
              {assigneeName.charAt(0).toUpperCase()}
            </Avatar>
          )}
          <Typography variant="body2" color="text.primary" fontWeight={500}>
            {assigneeName}
          </Typography>
        </Stack>
        <Chip
          label={isCompleted ? "Completed" : "Incomplete"}
          color={isCompleted ? "success" : "warning"}
          size="small"
          sx={{
            bgcolor: isCompleted ? "success.main" : "warning.main",
            color: "white",
            fontWeight: 600,
            px: 1.5,
            borderRadius: "16px",
            "& .MuiChip-label": {
              px: 0.5,
            },
          }}
        />
      </Stack>

      <Box
        sx={{
          bgcolor: "#f5f5f5",
          borderRadius: "4px",
          mb: 2,
          px: 2,
          py: 1.5,
        }}
      >
        <Typography variant="overline" color="text.secondary" fontWeight={500}>
          DESCRIPTION
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontWeight: 500,
            color: "text.primary",
            whiteSpace: "pre-wrap",
          }}
        >
          {ticket.description}
        </Typography>
      </Box>

      <Stack direction="row" spacing={1} justifyContent="flex-end">
        <Button
          variant="text"
          color="info"
          size="medium"
          onClick={() => {
            nav("/");
          }}
          sx={{
            borderRadius: "4px",
            textTransform: "none",
            fontWeight: 500,
            px: 2,
            py: 0.5,
          }}
        >
          Cancel
        </Button>
        <Button
          variant="outlined"
          color="primary"
          size="medium"
          onClick={() => setOpenAssign(true)}
          sx={{
            borderRadius: "4px",
            textTransform: "none",
            fontWeight: 500,
            px: 2,
            py: 0.5,
          }}
        >
          Assign
        </Button>
        <Button
          variant="contained"
          color="primary"
          size="medium"
          onClick={() => toggle.mutate({ id: ticket.id, next })}
          sx={{
            borderRadius: "4px",
            textTransform: "none",
            fontWeight: 500,
            px: 2,
            py: 0.5,
            "&:hover": {
              bgcolor: "primary.dark",
            },
          }}
        >
          Mark {isCompleted ? "Incomplete" : "Completed"}
        </Button>
      </Stack>

      {openAssign && (
        <AssignDialog
          open
          onClose={() => setOpenAssign(false)}
          ticket={ticket}
          users={users}
        />
      )}
    </Box>
  );
}
