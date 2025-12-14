import { Ticket } from "@acme/shared-models";
import useGlobalStore from "client/src/store";
import { useEffect, useMemo, useState } from "react";
import styles from "./tickets.module.css";

export interface TicketsProps {
  tickets: Ticket[];
}

type FilterStatus = "all" | "completed" | "incomplete";

export function Tickets() {
  const { tickets, users, ticketIds, fetchTickets, fetchUsers } =
    useGlobalStore();
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");

  const filteredTicketIds = useMemo(() => {
    return ticketIds.filter((id) => {
      const ticket = tickets[id];

      if (!ticket) return false;

      if (filterStatus === "completed") {
        return ticket.completed === true;
      } else if (filterStatus === "incomplete") {
        return ticket.completed === false;
      }

      return true;
    });
  }, [ticketIds, tickets, filterStatus]);

  const renderFilterBox = (
    <div>
      <button onClick={() => setFilterStatus("all")}>All</button>
      <button onClick={() => setFilterStatus("completed")}>Completed</button>
      <button onClick={() => setFilterStatus("incomplete")}>Incomplete</button>
    </div>
  );

  useEffect(() => {
    Promise.allSettled([fetchTickets(), fetchUsers()]);
  }, []);

  return (
    <div className={styles["tickets"]}>
      <h2>Tickets</h2>
      {renderFilterBox}
      {filteredTicketIds.length > 0 ? (
        <ul>
          {filteredTicketIds.map((id) => {
            const ticket = tickets[id];
            const assigneeName = ticket.assigneeId
              ? users[ticket.assigneeId]?.name ?? "Unknown"
              : "Unassigned";

            return (
              <li key={ticket.id}>
                Ticket: {ticket.id}, {ticket.description} | Status:{" "}
                {ticket.completed ? "Completed" : "Incomplete"} | Assignee:{" "}
                {assigneeName}
              </li>
            );
          })}
        </ul>
      ) : (
        <span>No ticket available</span>
      )}
    </div>
  );
}

export default Tickets;
