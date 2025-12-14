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
  isLoadingUsers: false,
  usersError: null,

  fetchUsers: async () => {
    set({ isLoadingUsers: true, usersError: null });

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
      });
    } catch (error: any) {
      set({ usersError: error.message });
    } finally {
      set({ isLoadingUsers: false });
    }
  },
});
