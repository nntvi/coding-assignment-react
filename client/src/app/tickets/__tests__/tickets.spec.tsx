import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import Tickets from "client/src/app/tickets/pages/tickets.page";
jest.mock("client/src/app/api/tickets", () => ({
  ticketsApi: {
    list: jest.fn().mockResolvedValue([]),
  },
}));
jest.mock("client/src/app/api/users", () => ({
  usersApi: {
    list: jest.fn().mockResolvedValue([]),
  },
}));

describe("Tickets page", () => {
  it("renders heading", async () => {
    const qc = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    render(
      <QueryClientProvider client={qc}>
        <MemoryRouter initialEntries={["/"]}>
          <Tickets />
        </MemoryRouter>
      </QueryClientProvider>
    );
    expect(await screen.findByText(/Tickets/i)).toBeInTheDocument();
  });
});
