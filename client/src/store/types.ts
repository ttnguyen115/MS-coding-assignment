import { Ticket, User } from "@acme/shared-models";

export type TicketSlice = {
  tickets: Ticket[];
  isLoading: boolean;
  error: string | null;
  fetchTickets: () => void;
};

export type UserSlice = {
  users: User[];
  isLoading: boolean;
  error: string | null;
  fetchUsers: () => void;
};

export type GlobalAppStore = TicketSlice & UserSlice;
