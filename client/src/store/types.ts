import { Ticket, User } from "@acme/shared-models";

type TicketState = {
  tickets: Record<string, Ticket>;
  activeTicket: Ticket | null;
  ticketIds: Ticket["id"][];
  isLoadingTickets: boolean;
  ticketsError: string | null;
};

type TicketActions = {
  setActiveTicket: (ticket: Ticket) => void;
};

type TicketAsyncActions = {
  fetchTickets: () => void;
  fetchTicketById: (ticketId: Ticket["id"]) => void;
  createTicket: (description: Ticket["description"]) => void;
  assignTicket: (ticketId: Ticket["id"], userId: User["id"]) => void;
  unassignTicket: (ticketId: Ticket["id"]) => void;
  updateTicketStatus: (
    ticketId: Ticket["id"],
    completed: Ticket["completed"]
  ) => void;
};

export type TicketSlice = TicketState & TicketActions & TicketAsyncActions;

type UserState = {
  users: Record<string, User>;
  activeUser: User | null;
  userIds: User["id"][];
  isLoadingUsers: boolean;
  usersError: string | null;
};

type UserActions = {
  setActiveUser: (user: User) => void;
};

type UserAsyncActions = {
  fetchUsers: () => void;
  fetchUserById: (userId: User["id"]) => void;
};

export type UserSlice = UserState & UserActions & UserAsyncActions;

export type GlobalAppStore = TicketSlice & UserSlice;
