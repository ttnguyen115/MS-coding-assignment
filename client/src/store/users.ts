import { type StateCreator } from "zustand";

import type { GlobalAppStore, UserSlice } from "./types";

export const createUserSlice: StateCreator<
  GlobalAppStore,
  [["zustand/immer", never]],
  [],
  UserSlice
> = (set) => ({
  users: [],
  isLoading: false,
  error: null,

  fetchUsers: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await fetch("/api/tickets");
      const data = await response.json();
      set({ users: data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },
});
