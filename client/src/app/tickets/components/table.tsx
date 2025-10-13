import type { Ticket } from "@acme/shared-models";
import {
  Paper,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import type { Location } from "react-router-dom";
import TicketRow from "./row";
type Props = {
  location: Location;
  tickets: Ticket[];
  loading: boolean;
  getAssigneeName: (assigneeId?: number) => string | undefined;
  onToggle: (t: Ticket) => void;
  isToggling: (id: number) => boolean;
  onOpenAssign: (t: Ticket) => void;
};

export default function TicketsTable({
  location,
  tickets,
  loading,
  getAssigneeName,
  onToggle,
  isToggling,
  onOpenAssign,
}: Props) {
  return (
    <Paper variant="outlined" sx={{ overflowX: "auto" }}>
      <Table size="small" aria-label="tickets table">
        <TableHead
          sx={{
            "& .MuiTableCell-head": {
              fontWeight: 600,
              color: "text.primary",
              letterSpacing: 0.2,
              bgcolor: "grey.50",
            },
          }}
        >
          <TableRow>
            <TableCell width={56} align="center">
              #
            </TableCell>
            <TableCell sx={{ width: "48%" }}>Description</TableCell>
            <TableCell sx={{ width: "20%" }}>Assignee</TableCell>
            <TableCell sx={{ width: "14%" }}>Status</TableCell>
            <TableCell align="right" sx={{ width: "18%", pr: 3 }}>
              Actions
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {loading
            ? Array.from({ length: 5 }).map((_, idx) => (
                <TableRow key={`sk-${idx}`}>
                  <TableCell align="center">
                    <Skeleton width={20} />
                  </TableCell>
                  <TableCell>
                    <Skeleton width="95%" />
                  </TableCell>
                  <TableCell>
                    <Skeleton width="70%" />
                  </TableCell>
                  <TableCell>
                    <Skeleton width="60%" />
                  </TableCell>
                  <TableCell align="right">
                    <Stack
                      direction="row"
                      spacing={1}
                      justifyContent="flex-end"
                    >
                      <Skeleton variant="circular" width={24} height={24} />
                      <Skeleton variant="rectangular" width={72} height={24} />
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            : tickets.map((t, i) => (
                <TicketRow
                  key={t.id}
                  index={i}
                  ticket={t}
                  location={location}
                  assigneeName={getAssigneeName(t.assigneeId || 0) ?? "-"}
                  onToggle={() => onToggle(t)}
                  pending={isToggling(t.id)}
                  onOpenAssign={() => onOpenAssign(t)}
                />
              ))}

          {!loading && tickets.length === 0 && (
            <TableRow>
              <TableCell colSpan={5}>
                <Typography align="center" sx={{ py: 2 }}>
                  No tickets found
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Paper>
  );
}
