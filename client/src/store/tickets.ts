import { type StateCreator } from "zustand";

import { Ticket } from "@acme/shared-models";
import type { GlobalAppStore, TicketSlice } from "./types";

export const createTicketSlice: StateCreator<
  GlobalAppStore,
  [["zustand/immer", never]],
  [],
  TicketSlice
> = (set) => ({
  tickets: [],
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
      set({ tickets, isLoading: false });
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },
});
