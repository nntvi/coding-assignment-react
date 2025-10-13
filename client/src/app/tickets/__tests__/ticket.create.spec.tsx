import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import Tickets from "client/src/app/tickets/pages/tickets.page";

const createMock = jest.fn();
const listMock = jest.fn();

jest.mock("client/src/app/api/tickets", () => ({
  ticketsApi: {
    list: (...args: any[]) => listMock(...args),
    create: (...args: any[]) => createMock(...args),
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

describe("Create Ticket", () => {
  it("should create a new ticket", async () => {
    listMock.mockResolvedValueOnce([]);

    createMock.mockImplementation((desc: string) =>
      Promise.resolve({
        id: 123,
        description: desc,
        assigneeId: null,
        completed: false,
      })
    );

    listMock.mockResolvedValue([
      {
        id: 123,
        description: "Write unit tests",
        assigneeId: null,
        completed: false,
      },
    ]);

    renderWithProviders(<Tickets />);

    const newBtn = await screen.findByRole("button", { name: /new ticket/i });
    await userEvent.click(newBtn);

    const input =
      screen.queryByRole("textbox", { name: /description/i }) ||
      screen.getByRole("textbox");
    await userEvent.clear(input as HTMLElement);
    await userEvent.type(input as HTMLElement, "Write unit tests");

    const submitBtn = screen.queryByRole("button", { name: /create/i });
    if (submitBtn) {
      await userEvent.click(submitBtn);
    }

    await waitFor(() =>
      expect(screen.getByText(/Write unit tests/i)).toBeInTheDocument()
    );

    await waitFor(() =>
      expect(createMock).toHaveBeenCalledWith("Write unit tests")
    );

    await waitFor(() =>
      expect(screen.getByText(/Write unit tests/i)).toBeInTheDocument()
    );
  });
});
