import {
  Button,
  Chip,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { Filter } from "client/src/app/tickets/pages/tickets.page";
import AllInclusiveIcon from "@mui/icons-material/AllInclusive";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import AddIcon from "@mui/icons-material/Add";
type Props = {
  filter: Filter;
  onFilterChange: (f: Filter) => void;
  onOpenNew: () => void;
  stats?: { all: number; completed: number; incomplete: number };
};

export default function TicketsToolbar({
  filter,
  onFilterChange,
  onOpenNew,
  stats,
}: Props) {
  const handleFilterChange = (
    _e: React.MouseEvent<HTMLElement>,
    value: Filter | null
  ) => {
    if (value !== null) onFilterChange(value);
  };
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      gap={2}
      flexWrap="wrap"
      mb={5}
      mt={2}
    >
      <Stack spacing={0}>
        <Typography variant="h5" fontWeight={600} lineHeight={1.2}>
          Tickets
        </Typography>
        <Typography fontSize={11} variant="body2" color="text.secondary">
          Add, assign and track completion
        </Typography>
      </Stack>
      <Stack direction="row" spacing={2} alignItems="center">
        <ToggleButtonGroup
          value={filter}
          exclusive
          onChange={handleFilterChange}
          size="small"
          sx={{
            border: 0,
            "& .MuiToggleButton-root": {
              textTransform: "none",
              px: 1.25,
              "&.Mui-selected": {
                bgcolor: "primary.main",
                color: "primary.contrastText",
                "&:hover": { bgcolor: "primary.main" },
              },
            },
          }}
        >
          <ToggleButton value="all" aria-label="All tickets">
            <AllInclusiveIcon fontSize="small" style={{ marginRight: 6 }} />
            All
            {typeof stats?.all === "number" && (
              <Chip
                size="small"
                label={stats.all}
                sx={{ ml: 0.75, height: 20 }}
              />
            )}
          </ToggleButton>

          <ToggleButton value="completed" aria-label="Completed tickets">
            <CheckCircleOutlineIcon
              fontSize="small"
              style={{ marginRight: 6 }}
            />
            Completed
            {typeof stats?.completed === "number" && (
              <Chip
                size="small"
                color="success"
                label={stats.completed}
                sx={{ ml: 0.75, height: 20 }}
              />
            )}
          </ToggleButton>
          <ToggleButton value="incomplete" aria-label="Incomplete tickets">
            <RadioButtonUncheckedIcon
              fontSize="small"
              style={{ marginRight: 6 }}
            />
            Incomplete
            {typeof stats?.incomplete === "number" && (
              <Chip
                size="small"
                color="warning"
                label={stats.incomplete}
                sx={{ ml: 0.75, height: 20 }}
              />
            )}
          </ToggleButton>
        </ToggleButtonGroup>
        <Button
          variant="contained"
          color="info"
          startIcon={<AddIcon />}
          onClick={onOpenNew}
        >
          New Ticket
        </Button>
      </Stack>
    </Stack>
  );
}
