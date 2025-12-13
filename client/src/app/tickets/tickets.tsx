import { Ticket } from "@acme/shared-models";
import useGlobalStore from "client/src/store";
import { useEffect } from "react";
import styles from "./tickets.module.css";

export interface TicketsProps {
  tickets: Ticket[];
}

export function Tickets() {
  const { fetchTickets, tickets } = useGlobalStore();

  useEffect(() => {
    fetchTickets();
  }, []);

  return (
    <div className={styles["tickets"]}>
      <h2>Tickets</h2>
      {tickets.length > 0 ? (
        <ul>
          {tickets.map((ticket) => (
            <li key={ticket.id}>
              Ticket: {ticket.id}, {ticket.description} | Status:{" "}
              {ticket.completed ? "Completed" : "Pending"}
            </li>
          ))}
        </ul>
      ) : (
        <span>No ticket available</span>
      )}
    </div>
  );
}

export default Tickets;
