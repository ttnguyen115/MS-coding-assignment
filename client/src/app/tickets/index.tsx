import { Ticket } from "@acme/shared-models";
import Button from "client/src/components/Button";
import useGlobalStore from "client/src/store";
import { useEffect, useMemo, useState } from "react";
import { useShallow } from "zustand/shallow";
import styles from "./tickets.module.css";

export interface TicketsProps {
  tickets: Ticket[];
}

type FilterStatus = "all" | "completed" | "incomplete";

function Tickets() {
  const { tickets, users, ticketIds, fetchTickets, fetchUsers } =
    useGlobalStore(
      useShallow((state) => ({
        tickets: state.tickets,
        users: state.users,
        ticketIds: state.ticketIds,
        fetchTickets: state.fetchTickets,
        fetchUsers: state.fetchUsers,
      }))
    );
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

  const handleChangeFilter = (status: FilterStatus) => () => {
    setFilterStatus(status);
  };

  const renderFilterGroup = (
    <div className={styles["filterGroup"]}>
      <Button
        isActive={filterStatus === "all"}
        onClick={handleChangeFilter("all")}
      >
        All
      </Button>
      <Button
        isActive={filterStatus === "completed"}
        onClick={handleChangeFilter("completed")}
      >
        Completed
      </Button>
      <Button
        isActive={filterStatus === "incomplete"}
        onClick={handleChangeFilter("incomplete")}
      >
        Incomplete
      </Button>
    </div>
  );

  useEffect(() => {
    Promise.allSettled([fetchTickets(), fetchUsers()]);
  }, []);

  return (
    <div className={styles["container"]}>
      <div className={styles["header"]}>
        <h1 className={styles["title"]}>Tickets</h1>
        {renderFilterGroup}
      </div>

      {filteredTicketIds.length > 0 ? (
        <div className={styles["ticketList"]}>
          {filteredTicketIds.map((id) => {
            const ticket = tickets[id];
            const assigneeName = ticket.assigneeId
              ? users[ticket.assigneeId]?.name ?? "Unknown"
              : "Unassigned";

            return (
              <div key={ticket.id} className={styles["ticketCard"]}>
                <div className={styles["ticketHeader"]}>
                  <span className={styles["ticketId"]}>#{ticket.id}</span>
                  <span
                    className={`${styles["statusBadge"]} ${
                      ticket.completed
                        ? styles["completed"]
                        : styles["incomplete"]
                    }`}
                  >
                    {ticket.completed ? "Completed" : "Incomplete"}
                  </span>
                </div>
                <p className={styles["ticketDescription"]}>
                  {ticket.description}
                </p>
                <div className={styles["ticketFooter"]}>
                  <div className={styles["assignee"]}>
                    <span className={styles["assigneeLabel"]}>Assignee:</span>
                    <span className={styles["assigneeName"]}>
                      {assigneeName}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className={styles["emptyState"]}>
          <p>No tickets available</p>
        </div>
      )}
    </div>
  );
}

export default Tickets;
