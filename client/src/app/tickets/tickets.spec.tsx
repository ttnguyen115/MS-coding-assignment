import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import useGlobalStore from "client/src/store";
import { MemoryRouter } from "react-router-dom";

import Tickets from ".";

jest.mock("client/src/store");

const mockUseGlobalStore = useGlobalStore as jest.MockedFunction<
  typeof useGlobalStore
>;

const TestComponent = (
  <MemoryRouter>
    <Tickets />
  </MemoryRouter>
);

const defaultStoreState = {
  tickets: {},
  ticketIds: [],
  users: {},
  fetchTickets: jest.fn(),
  fetchUsers: jest.fn(),
};

describe("Tickets", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseGlobalStore.mockReturnValue(defaultStoreState);
  });

  it("should render successfully", () => {
    const { baseElement } = render(TestComponent);
    expect(baseElement).toBeTruthy();
  });

  it("should display correctly when there are no tickets", () => {
    render(TestComponent);
    expect(screen.getByText("No tickets available")).toBeInTheDocument();
  });

  it("should render tickets with assignee names", () => {
    mockUseGlobalStore.mockReturnValue({
      ...defaultStoreState,
      tickets: {
        1: { id: 1, description: "Fix bug", assigneeId: 1, completed: false },
        2: {
          id: 2,
          description: "Add feature",
          assigneeId: null,
          completed: true,
        },
      },
      ticketIds: [1, 2],
      users: {
        1: { id: 1, name: "Trung Nguyen" },
      },
    });

    render(TestComponent);

    expect(screen.getByText(/Fix bug/)).toBeInTheDocument();
    expect(screen.getByText(/Add feature/)).toBeInTheDocument();
    expect(screen.getByText(/Trung Nguyen/)).toBeInTheDocument();
    expect(screen.getByText(/Unassigned/)).toBeInTheDocument();
  });

  it("should filter tickets by completed status", async () => {
    const user = userEvent.setup();

    mockUseGlobalStore.mockReturnValue({
      ...defaultStoreState,
      tickets: {
        1: {
          id: 1,
          description: "Incomplete task",
          assigneeId: null,
          completed: false,
        },
        2: {
          id: 2,
          description: "Complete task",
          assigneeId: null,
          completed: true,
        },
      },
      ticketIds: [1, 2],
      users: {},
    });

    render(TestComponent);

    expect(screen.getByText(/Incomplete task/)).toBeInTheDocument();
    expect(screen.getByText(/Complete task/)).toBeInTheDocument();

    const completedButton = screen.getByRole("button", { name: /Completed/i });
    await user.click(completedButton);

    await waitFor(() => {
      expect(screen.queryByText(/Incomplete task/)).not.toBeInTheDocument();
      expect(screen.getByText(/Complete task/)).toBeInTheDocument();
    });
  });

  it("should display 'Unknown' for missing user", () => {
    mockUseGlobalStore.mockReturnValue({
      ...defaultStoreState,
      tickets: {
        1: { id: 1, description: "Fix bug", assigneeId: 999, completed: false },
      },
      ticketIds: [1],
      users: {},
    });

    render(TestComponent);

    expect(screen.getByText(/Unknown/)).toBeInTheDocument();
  });
});
