import { Ticket, User } from "@acme/shared-models";
import {
  Avatar,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  InputAdornment,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import SearchIcon from "@mui/icons-material/Search";

import { useAssignTicket } from "client/src/app/queries/useTicket";
import { useCallback, useEffect, useMemo, useState } from "react";

type AssignProps = {
  open: boolean;
  onClose: () => void;
  ticket: Ticket;
  users: User[];
};

function stringToHslColor(str: string, s = 45, l = 75) {
  let hash = 0;
  for (let i = 0; i < str.length; i++)
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  const h = Math.abs(hash) % 360;
  return `hsl(${h} ${s}% ${l}%)`;
}

export default function AssignDialog({
  open,
  onClose,
  ticket,
  users,
}: AssignProps) {
  const assignMutation = useAssignTicket();
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  const current = ticket.assigneeId ?? null;
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) => u.name.toLowerCase().includes(q));
  }, [users, query]);

  const handleAssign = useCallback(
    (userId?: number) => {
      if (assignMutation.isPending) return;
      assignMutation.mutate(
        { ticketId: ticket.id, userId },
        { onSettled: onClose }
      );
    },
    [assignMutation, ticket.id, onClose]
  );

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && filtered.length > 0) handleAssign(filtered[0].id);
  };
  const isRowPending = (rowId: number | null) =>
    assignMutation.isPending && rowId === current;

  return (
    <Dialog
      open={open}
      onClose={assignMutation.isPending ? undefined : onClose}
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle sx={{ pr: 6 }}>
        Assign Ticket #{ticket.id}
        <IconButton
          aria-label="close"
          onClick={onClose}
          disabled={assignMutation.isPending}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <TextField
          fullWidth
          size="small"
          placeholder="Search users…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={onKeyDown}
          autoFocus
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 1.5 }}
        />

        <List dense disablePadding>
          <ListItemButton
            selected={current === null}
            disabled={assignMutation.isPending}
            onClick={() => handleAssign(undefined)}
            sx={{
              borderRadius: 1,
              "&.Mui-selected": {
                bgcolor: "action.selected",
                "&:hover": { bgcolor: "action.selected" },
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 36 }}>
              {current === null ? (
                <RadioButtonCheckedIcon color="success" fontSize="small" />
              ) : (
                <RadioButtonUncheckedIcon fontSize="small" />
              )}
            </ListItemIcon>

            <ListItemAvatar>
              <Avatar
                sx={{ bgcolor: "action.selected", color: "text.secondary" }}
              >
                <RemoveCircleOutlineIcon fontSize="small" />
              </Avatar>
            </ListItemAvatar>

            <ListItemText
              primary="Unassigned"
              secondary="Remove current assignee"
              primaryTypographyProps={{ fontWeight: 600 }}
            />

            {isRowPending(null) && <CircularProgress size={16} />}
          </ListItemButton>

          <Divider sx={{ my: 1 }} />

          {filtered.length === 0 ? (
            <Stack alignItems="center" py={3}>
              <Typography variant="body2" color="text.secondary">
                No users match “{query}”
              </Typography>
            </Stack>
          ) : (
            filtered.map((u) => {
              const selected = current === u.id;
              return (
                <ListItemButton
                  key={u.id}
                  selected={selected}
                  disabled={assignMutation.isPending}
                  onClick={() => handleAssign(u.id)}
                  sx={{
                    borderRadius: 1,
                    "&.Mui-selected": {
                      bgcolor: "action.selected",
                      "&:hover": { bgcolor: "action.selected" },
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    {selected ? (
                      <RadioButtonCheckedIcon
                        color="success"
                        fontSize="small"
                      />
                    ) : (
                      <RadioButtonUncheckedIcon fontSize="small" />
                    )}
                  </ListItemIcon>

                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: stringToHslColor(u.name) }}>
                      {u.name.charAt(0).toUpperCase()}
                    </Avatar>
                  </ListItemAvatar>

                  <ListItemText primary={u.name} />

                  {isRowPending(u.id) && <CircularProgress size={16} />}
                </ListItemButton>
              );
            })
          )}
        </List>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={assignMutation.isPending}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
