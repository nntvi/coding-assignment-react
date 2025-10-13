import { Link as RouterLink, type Location } from "react-router-dom";
import {
  TableRow,
  TableCell,
  Stack,
  Chip,
  IconButton,
  CircularProgress,
  Tooltip,
  Link,
  Typography,
} from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";
import UndoIcon from "@mui/icons-material/Undo";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import type { Ticket } from "@acme/shared-models";

type Props = {
  index: number;
  ticket: Ticket;
  location: Location;
  assigneeName: string;
  onToggle: () => void;
  pending: boolean;
  onOpenAssign: () => void;
};

export default function TicketRow({
  index,
  ticket,
  location,
  assigneeName,
  onToggle,
  pending,
  onOpenAssign,
}: Props) {
  console.log("🚀 ~ TicketRow ~ ticket:", ticket);
  const isCompleted = ticket.completed;

  return (
    <TableRow
      hover
      sx={{
        transition: "background 0.2s ease-in-out",
        "&:hover": { bgcolor: "action.hover" },
      }}
    >
      <TableCell align="center" sx={{ py: 1.25, width: 56 }}>
        <Typography variant="body2" fontWeight={500}>
          {index + 1}
        </Typography>
      </TableCell>

      <TableCell sx={{ py: 1.25, maxWidth: 0 }}>
        <Link
          component={RouterLink}
          to={`/tickets/${ticket.id}`}
          state={{ backgroundLocation: location }}
          underline="hover"
          sx={{
            color: "text.primary",
            "&:visited": { color: "text.primary" },
            display: "block",
            cursor: "pointer",
          }}
        >
          <Typography
            variant="body2"
            title={ticket.description}
            sx={{
              fontWeight: 500,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              whiteSpace: "normal",
            }}
          >
            {ticket.description}
          </Typography>
        </Link>
      </TableCell>

      <TableCell sx={{ py: 1.25 }}>
        <Typography
          variant="body2"
          color="text.secondary"
          noWrap
          title={assigneeName}
        >
          {assigneeName || "-"}
        </Typography>
      </TableCell>

      <TableCell sx={{ py: 1.25 }}>
        <Chip
          label={isCompleted ? "Completed" : "Incomplete"}
          size="small"
          sx={{
            bgcolor: isCompleted ? "success.main" : "warning.main",
            color: "white",
            fontWeight: 500,
            px: 1,
            borderRadius: "16px",
            transition: "all 0.3s ease",
            "& .MuiChip-label": {
              px: 0.5,
            },
          }}
        />
      </TableCell>

      <TableCell align="right" sx={{ py: 1.25 }}>
        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <Tooltip
            title={isCompleted ? "Mark as Incomplete" : "Mark as Completed"}
            arrow
          >
            <span>
              <IconButton
                size="small"
                disabled={pending}
                onClick={(e) => {
                  e.stopPropagation();
                  onToggle();
                }}
                sx={{
                  bgcolor: pending
                    ? "action.disabledBackground"
                    : "background.paper",
                  color: isCompleted ? "warning.main" : "success.main",
                  "&:hover": {
                    bgcolor: isCompleted ? "warning.light" : "success.light",
                    color: "#fff",
                  },
                }}
              >
                {pending ? (
                  <CircularProgress size={14} sx={{ color: "common.white" }} />
                ) : isCompleted ? (
                  <UndoIcon fontSize="small" />
                ) : (
                  <DoneIcon fontSize="small" />
                )}
              </IconButton>
            </span>
          </Tooltip>

          <Tooltip title="Assign user" placement="right">
            <IconButton
              size="small"
              color="primary"
              aria-label="assign"
              onClick={(e) => {
                e.stopPropagation();
                onOpenAssign();
              }}
              sx={{
                bgcolor: "background.paper",
                "&:hover": {
                  bgcolor: "action.hover",
                },
              }}
            >
              <AssignmentIndIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      </TableCell>
    </TableRow>
  );
}
