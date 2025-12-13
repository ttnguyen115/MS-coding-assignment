import { type StateCreator } from "zustand";

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
      const response = await fetch('/api/tickets');
      const data = await response.json();
      set({ tickets: data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message })
    } finally {
      set({ isLoading: false });
    }
  },
});
