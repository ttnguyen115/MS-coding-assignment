import { type StateCreator } from "zustand";

import { Ticket, User } from "@acme/shared-models";
import type { GlobalAppStore, TicketSlice } from "./types";

export const createTicketSlice: StateCreator<
  GlobalAppStore,
  [["zustand/immer", never]],
  [],
  TicketSlice
> = (set) => ({
  tickets: {},
  activeTicket: null,
  ticketIds: [],
  isLoadingTickets: false,
  ticketsError: null,

  setActiveTicket: (ticket: Ticket) => {
    set({ activeTicket: ticket });
  },

  fetchTickets: async () => {
    set({ isLoadingTickets: true, ticketsError: null });

    try {
      const response = await fetch("/api/tickets");

      if (!response.ok) {
        throw new Error(`Cannot fetch tickets: ${response.statusText}`);
      }

      const tickets: Ticket[] = await response.json();
      set((state) => {
        state.ticketIds.length = 0;
        Object.keys(state.tickets).forEach((key) => delete state.tickets[key]);

        tickets.forEach((ticket) => {
          state.ticketIds.push(ticket.id);
          state.tickets[ticket.id] = ticket;
        });
      });
    } catch (error: any) {
      set({ ticketsError: error.message });
    } finally {
      set({ isLoadingTickets: false });
    }
  },

  fetchTicketById: async (ticketId: Ticket["id"]) => {
    set({ isLoadingTickets: true, ticketsError: null });

    try {
      const response = await fetch(`/api/tickets/${ticketId}`);

      if (!response.ok) {
        throw new Error(`Cannot fetch ticket with ID: ${response.statusText}`);
      }

      const ticket: Ticket = await response.json();
      set({ activeTicket: ticket });
    } catch (error: any) {
      set({ ticketsError: error.message });
    } finally {
      set({ isLoadingTickets: false });
    }
  },

  createTicket: async (description: Ticket["description"]) => {},

  assignTicket: async (ticketId: Ticket["id"], userId: User["id"]) => {},

  unassignTicket: async (ticketId: Ticket["id"]) => {},

  updateTicketStatus: async (
    ticketId: Ticket["id"],
    completed: Ticket["completed"]
  ) => {},
});
