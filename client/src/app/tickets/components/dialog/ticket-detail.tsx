import { Dialog } from "@mui/material";
import TicketDetailsPage from "client/src/app/tickets/pages/ticket-detail.page";
export default function TicketDetailsModal() {
  return (
    <Dialog open fullWidth maxWidth="sm" aria-labelledby="ticket-detail">
      <TicketDetailsPage />
    </Dialog>
  );
}
