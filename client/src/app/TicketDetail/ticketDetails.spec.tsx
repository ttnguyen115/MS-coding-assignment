import { render, screen } from "@testing-library/react";
import useGlobalStore from "client/src/store";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import TicketDetail from "./index";

const mockUseGlobalStore = useGlobalStore as jest.MockedFunction<
  typeof useGlobalStore
>;

const TestComponent = (initialEntries: string[] = ["/1"]) => (
  <MemoryRouter initialEntries={initialEntries}>
    <Routes>
      <Route path="/:id" element={<TicketDetail />} />
    </Routes>
  </MemoryRouter>
);

const defaultStoreState = {
  tickets: {},
  ticketIds: [],
  users: {},
  userIds: [],
  activeTicket: null,
  activeUser: null,
  isLoadingTickets: false,
  isLoadingUsers: false,
  isUpdatingTicket: null,
  ticketsError: null,
  usersError: null,
  fetchTickets: jest.fn(),
  fetchTicketById: jest.fn(),
  setActiveTicket: jest.fn(),
  fetchUsers: jest.fn(),
  fetchUserById: jest.fn(),
  setActiveUser: jest.fn(),
  updateTicketStatus: jest.fn(),
  assignTicket: jest.fn(),
  unassignTicket: jest.fn(),
};

describe("TicketDetail", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseGlobalStore.mockImplementation((selector: any) => {
      if (typeof selector === "function") {
        return selector(defaultStoreState);
      }
      return defaultStoreState;
    });
  });

  it("should render successfully", () => {
    render(TestComponent());

    expect(screen.getByText(/Back to the main page/)).toBeInTheDocument();
  });

  it("should display ticket information when ticket is loaded", () => {
    const ticket = {
      id: 1,
      description: "Fix bug in login",
      assigneeId: 2,
      completed: false,
    };
    const user = { id: 2, name: "Trung Nguyen" };

    const testState = {
      ...defaultStoreState,
      tickets: {
        1: ticket,
      },
      activeTicket: ticket,
      users: {
        2: user,
      },
      userIds: [2],
      activeUser: user,
    };

    mockUseGlobalStore.mockImplementation((selector: any) => {
      if (typeof selector === "function") {
        return selector(testState);
      }
      return testState;
    });

    render(TestComponent());

    expect(screen.getByText(/Fix bug in login/)).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: /Trung Nguyen/ })
    ).toBeInTheDocument();
    expect(screen.getByText(/Incomplete/)).toBeInTheDocument();
  });

  it("should display Not Found when ticket does not exist", () => {
    const testState = {
      ...defaultStoreState,
      activeTicket: null,
      isLoadingTickets: false,
      ticketsError: "Ticket not found",
    };

    mockUseGlobalStore.mockImplementation((selector: any) => {
      if (typeof selector === "function") {
        return selector(testState);
      }
      return testState;
    });

    render(TestComponent(["/1000"]));

    expect(screen.getByText(/Ticket not found/i)).toBeInTheDocument();
  });
});
