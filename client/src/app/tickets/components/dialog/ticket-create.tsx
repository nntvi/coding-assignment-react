import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  CircularProgress,
} from "@mui/material";
import { useCreateTicket } from "client/src/app/queries/useTicket";

type Props = { open: boolean; onClose: () => void };

export default function TicketDialog({ open, onClose }: Props) {
  const [desc, setDesc] = useState("");
  const create = useCreateTicket();

  const canSubmit = desc.trim().length > 0 && !create.isPending;

  const handleSubmit = () => {
    if (!canSubmit) return;
    create.mutate(
      { description: desc.trim() },
      {
        onSuccess: () => {
          setDesc("");
          onClose();
        },
      }
    );
  };

  return (
    <Dialog
      open={open}
      onClose={create.isPending ? undefined : onClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>New Ticket</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            label="Description"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            autoFocus
            fullWidth
            placeholder="e.g. Install a monitor arm"
            disabled={create.isPending}
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, mb: 1 }}>
        <Button onClick={onClose} disabled={create.isPending}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!canSubmit}
        >
          {create.isPending ? <CircularProgress size={18} /> : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
