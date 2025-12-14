import { render, screen } from "@testing-library/react";
import useGlobalStore from "client/src/store";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import TicketDetail from "./index";

jest.mock("client/src/store");

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
  ticketsError: null,
  usersError: null,
  fetchTickets: jest.fn(),
  fetchTicketById: jest.fn(),
  setActiveTicket: jest.fn(),
  fetchUsers: jest.fn(),
  fetchUserById: jest.fn(),
  setActiveUser: jest.fn(),
};

describe("TicketDetail", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseGlobalStore.mockReturnValue(defaultStoreState);
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

    mockUseGlobalStore.mockReturnValue({
      ...defaultStoreState,
      tickets: {
        1: ticket,
      },
      activeTicket: ticket,
      users: {
        2: user,
      },
      activeUser: user,
    });

    render(TestComponent());

    expect(screen.getByText(/Fix bug in login/)).toBeInTheDocument();
    expect(screen.getByText(/Trung Nguyen/)).toBeInTheDocument();
    expect(screen.getByText(/Incomplete/)).toBeInTheDocument();
  });

  it("should display Not Found when ticket does not exist", () => {
    mockUseGlobalStore.mockReturnValue({
      ...defaultStoreState,
      activeTicket: null,
      isLoadingTickets: false,
      ticketsError: "Ticket not found",
    });

    render(TestComponent(["/1000"]));

    expect(screen.getByText(/Ticket not found/i)).toBeInTheDocument();
  });
});
