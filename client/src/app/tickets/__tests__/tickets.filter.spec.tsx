import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import Tickets from "client/src/app/tickets/pages/tickets.page";
jest.mock("client/src/app/api/tickets", () => ({
  ticketsApi: {
    list: jest.fn().mockResolvedValue([
      {
        id: 1,
        description: "Install a monitor arm",
        assigneeId: 1,
        completed: false,
      },
      { id: 2, description: "Move the desk", assigneeId: 2, completed: true },
    ]),
  },
}));

jest.mock("client/src/app/api/users", () => ({
  usersApi: {
    list: jest.fn().mockResolvedValue([
      { id: 1, name: "Alice" },
      { id: 2, name: "Bob" },
    ]),
  },
}));

function renderWithProviders(ui: React.ReactNode, route = "/") {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
    </QueryClientProvider>
  );
}

describe("Tickets filter", () => {
  it("shows both on All, filters Completed and Incomplete correctly", async () => {
    renderWithProviders(<Tickets />);

    expect(
      await screen.findByText(/Install a monitor arm/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Move the desk/i)).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: /Completed/i }));
    expect(
      screen.queryByText(/Install a monitor arm/i)
    ).not.toBeInTheDocument();
    expect(screen.getByText(/Move the desk/i)).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: /Incomplete/i }));
    expect(screen.getByText(/Install a monitor arm/i)).toBeInTheDocument();
    expect(screen.queryByText(/Move the desk/i)).not.toBeInTheDocument();
  });
});
