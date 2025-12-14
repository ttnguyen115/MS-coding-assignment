import { type StateCreator } from "zustand";

import { Ticket, User } from "@acme/shared-models";
import { sanitizeDescription, validateDescription } from "../utils/sanitize";
import type { GlobalAppStore, TicketSlice } from "./types";

export const createTicketSlice: StateCreator<
  GlobalAppStore,
  [["zustand/immer", never]],
  [],
  TicketSlice
> = (set, get) => ({
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
          state.tickets[ticket.id] = {
            ...ticket,
            description: sanitizeDescription(ticket.description),
          };
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
      set({
        activeTicket: {
          ...ticket,
          description: sanitizeDescription(ticket.description),
        },
      });
    } catch (error: any) {
      set({ ticketsError: error.message });
    } finally {
      set({ isLoadingTickets: false });
    }
  },

  createTicket: async (description: Ticket["description"]) => {
    set({ isLoadingTickets: true, ticketsError: null });

    try {
      const validation = validateDescription(description);
      if (!validation.isValid) {
        throw new Error(validation.error);
      }

      const sanitizedDescription = sanitizeDescription(description);

      const response = await fetch("/api/tickets/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description: sanitizedDescription,
        }),
      });

      if (!response.ok) {
        throw new Error(
          `Cannot create ticket with description: ${response.statusText}`
        );
      }

      get().fetchTickets();
    } catch (error: any) {
      set({ ticketsError: error.message });
    } finally {
      set({ isLoadingTickets: false });
    }
  },

  assignTicket: async (ticketId: Ticket["id"], userId: User["id"]) => {
    set({ isLoadingTickets: true, ticketsError: null });

    try {
      const response = await fetch(
        `/api/tickets/${ticketId}/assign/${userId}`,
        {
          method: "PUT",
        }
      );

      if (!response.ok) {
        throw new Error(
          `Cannot assign ticket ${ticketId} for user ${userId}: ${response.statusText}`
        );
      }

      get().fetchTickets();
    } catch (error: any) {
      set({ ticketsError: error.message });
    } finally {
      set({ isLoadingTickets: false });
    }
  },

  unassignTicket: async (ticketId: Ticket["id"]) => {
    set({ isLoadingTickets: true, ticketsError: null });

    try {
      const response = await fetch(
        `/api/tickets/${ticketId}/unassign`,
        {
          method: "PUT",
        }
      );

      if (!response.ok) {
        throw new Error(
          `Cannot unassign ticket ${ticketId}: ${response.statusText}`
        );
      }

      get().fetchTickets();
    } catch (error: any) {
      set({ ticketsError: error.message });
    } finally {
      set({ isLoadingTickets: false });
    }
  },

  updateTicketStatus: async (
    ticketId: Ticket["id"],
    completed: Ticket["completed"]
  ) => {
    set({ isLoadingTickets: true, ticketsError: null });

    try {
      const response = await fetch(
        `/api/tickets/${ticketId}/complete`,
        {
          method: "PUT",
        }
      );

      if (!response.ok) {
        throw new Error(
          `Cannot change status ticket ${ticketId}: ${response.statusText}`
        );
      }

      get().fetchTickets();
    } catch (error: any) {
      set({ ticketsError: error.message });
    } finally {
      set({ isLoadingTickets: false });
    }
  },
});
