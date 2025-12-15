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
  userIds: [],
  isUpdatingTicket: null,
  updateTicketStatus: jest.fn(),
  assignTicket: jest.fn(),
  unassignTicket: jest.fn(),
  fetchTickets: jest.fn(),
  fetchUsers: jest.fn(),
  createTicket: jest.fn(),
};

describe("Tickets", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseGlobalStore.mockImplementation((selector: any) => {
      if (typeof selector === 'function') {
        return selector(defaultStoreState);
      }
      return defaultStoreState;
    });
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
    const testState = {
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
      userIds: [1],
    };

    mockUseGlobalStore.mockImplementation((selector: any) => {
      if (typeof selector === 'function') {
        return selector(testState);
      }
      return testState;
    });

    render(TestComponent);

    expect(screen.getByText(/Fix bug/)).toBeInTheDocument();
    expect(screen.getByText(/Add feature/)).toBeInTheDocument();
    
    const selectBoxes = screen.getAllByRole('combobox');
    expect(selectBoxes.length).toBeGreaterThan(0);
    
    expect(screen.getAllByText(/Unassigned/).length).toBeGreaterThan(0);
  });

  it("should filter tickets by completed status", async () => {
    const user = userEvent.setup();

    const testState = {
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
      userIds: [],
    };

    mockUseGlobalStore.mockImplementation((selector: any) => {
      if (typeof selector === 'function') {
        return selector(testState);
      }
      return testState;
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

  it("should display select box for missing user", () => {
    const testState = {
      ...defaultStoreState,
      tickets: {
        1: { id: 1, description: "Fix bug", assigneeId: 999, completed: false },
      },
      ticketIds: [1],
      users: {},
      userIds: [],
    };

    mockUseGlobalStore.mockImplementation((selector: any) => {
      if (typeof selector === 'function') {
        return selector(testState);
      }
      return testState;
    });

    render(TestComponent);

    const selectBox = screen.getByRole('combobox');
    expect(selectBox).toBeInTheDocument();
    expect(screen.getByText(/Fix bug/)).toBeInTheDocument();
  });
});
