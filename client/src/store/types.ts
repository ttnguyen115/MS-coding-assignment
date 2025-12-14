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
  fetchTickets: () => Promise<void>;
  fetchTicketById: (ticketId: Ticket["id"]) => Promise<void>;
  createTicket: (description: Ticket["description"]) => Promise<void>;
  assignTicket: (ticketId: Ticket["id"], userId: User["id"]) => Promise<void>;
  unassignTicket: (ticketId: Ticket["id"]) => Promise<void>;
  updateTicketStatus: (
    ticketId: Ticket["id"],
    completed: Ticket["completed"]
  ) => Promise<void>;
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
  fetchUsers: () => Promise<void>;
  fetchUserById: (userId: User["id"]) => Promise<void>;
};

export type UserSlice = UserState & UserActions & UserAsyncActions;

export type GlobalAppStore = TicketSlice & UserSlice;
