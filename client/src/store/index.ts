import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

import { createTicketSlice } from "./tickets";
import { createUserSlice } from "./users";

import type { GlobalAppStore } from "./types";

const useGlobalStore = create<GlobalAppStore>()(
  devtools(
    immer((...args) => ({
      ...createTicketSlice(...args),
      ...createUserSlice(...args),
    }))
  )
);

export default useGlobalStore;
