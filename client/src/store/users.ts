import { type StateCreator } from "zustand";

import { User } from "@acme/shared-models";
import type { GlobalAppStore, UserSlice } from "./types";

export const createUserSlice: StateCreator<
  GlobalAppStore,
  [["zustand/immer", never]],
  [],
  UserSlice
> = (set) => ({
  users: {},
  userIds: [],
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

      set((state) => {
        state.userIds.length = 0;
        Object.keys(state.users).forEach((key) => delete state.users[key]);
      
        users.forEach((user) => {
          state.userIds.push(user.id);
          state.users[user.id] = user;
        });
        
        state.isLoading = false;
      });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
});
