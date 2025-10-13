import { AppBar, Box, Container, Toolbar, Typography } from "@mui/material";
import TicketDetailsModal from "client/src/app/tickets/components/dialog/ticket-detail";
import TicketDetailsPage from "client/src/app/tickets/pages/ticket-detail.page";
import Tickets from "client/src/app/tickets/pages/tickets.page";
import { Route, Routes, useLocation } from "react-router-dom";

const App = () => {
  const location = useLocation();
  const state = location.state as { backgroundLocation?: Location } | undefined;
  return (
    <>
      <AppBar position="sticky" elevation={0}>
        <Toolbar>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Ticketing App
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md">
        <Box py={3}>
          <Routes location={state?.backgroundLocation ?? location}>
            <Route path="/" element={<Tickets />} />
            <Route path="/tickets/:ticketId" element={<TicketDetailsPage />} />
          </Routes>
          {state?.backgroundLocation && (
            <Routes>
              <Route
                path="/tickets/:ticketId"
                element={<TicketDetailsModal />}
              />
            </Routes>
          )}
        </Box>
      </Container>
    </>
  );
};

export default App;
