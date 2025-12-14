import { type StateCreator } from "zustand";

import { Ticket } from "@acme/shared-models";
import type { GlobalAppStore, TicketSlice } from "./types";

export const createTicketSlice: StateCreator<
  GlobalAppStore,
  [["zustand/immer", never]],
  [],
  TicketSlice
> = (set) => ({
  tickets: {},
  ticketIds: [],
  isLoading: false,
  error: null,

  fetchTickets: async () => {
    set({ isLoading: true, error: null });

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
        
        state.isLoading = false;
      });
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },
});
