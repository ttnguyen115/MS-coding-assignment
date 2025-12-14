import { Ticket, User } from "@acme/shared-models";

export type TicketSlice = {
  tickets: Record<string, Ticket>;
  ticketIds: Ticket["id"][];
  isLoadingTickets: boolean;
  ticketsError: string | null;
  fetchTickets: () => void;
};

export type UserSlice = {
  users: Record<string, User>;
  userIds: User["id"][];
  isLoadingUsers: boolean;
  usersError: string | null;
  fetchUsers: () => void;
};

export type GlobalAppStore = TicketSlice & UserSlice;
