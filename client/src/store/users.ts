import { type StateCreator } from "zustand";

import { User } from "@acme/shared-models";
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
      const response = await fetch("/api/users");

      if (!response.ok) {
        throw new Error(`Cannot fetch users: ${response.statusText}`);
      }

      const users: User[] = await response.json();
      set({ users, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
});
