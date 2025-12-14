import { Ticket, User } from "@acme/shared-models";

export type TicketSlice = {
  tickets: Record<string, Ticket>;
  ticketIds: Ticket["id"][];
  isLoading: boolean;
  error: string | null;
  fetchTickets: () => void;
};

export type UserSlice = {
  users: Record<string, User>;
  userIds: User["id"][];
  isLoading: boolean;
  error: string | null;
  fetchUsers: () => void;
};

export type GlobalAppStore = TicketSlice & UserSlice;
