import { Ticket } from "@acme/shared-models";
import Button from "client/src/components/Button";
import TicketCard from "client/src/components/TicketCard";
import useGlobalStore from "client/src/store";
import { useEffect, useMemo, useState } from "react";
import { useShallow } from "zustand/shallow";
import styles from "./tickets.module.css";

export interface TicketsProps {
  tickets: Ticket[];
}

type FilterStatus = "all" | "completed" | "incomplete";

function Tickets() {
  const { tickets, users, ticketIds, fetchTickets, fetchUsers, isLoadingTickets } =
    useGlobalStore(
      useShallow((state) => ({
        tickets: state.tickets,
        users: state.users,
        ticketIds: state.ticketIds,
        fetchTickets: state.fetchTickets,
        fetchUsers: state.fetchUsers,
        isLoadingTickets: state.isLoadingTickets,
      }))
    );
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");

  const filteredTicketIds = useMemo(() => {
    return ticketIds.filter((id) => {
      const ticket = tickets[id];

      if (!ticket) return false;

      if (filterStatus === "all") return true;
      if (filterStatus === "completed") return ticket.completed === true;
      if (filterStatus === "incomplete") return ticket.completed === false;

      return true;
    });
  }, [ticketIds, tickets, filterStatus]);

  const handleChangeFilter = (status: FilterStatus) => () => {
    setFilterStatus(status);
  };

  const renderFilterGroup = () => (
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

  const renderContent = () => {
    if (isLoadingTickets) {
      return (
        <div className={styles["ticketList"]}>
          {Array.from({ length: 6 }).map((_, index) => (
            <TicketCard.Skeleton key={index} />
          ))}
        </div>
      );
    }

    if (filteredTicketIds.length === 0) {
      return (
        <div className={styles["emptyState"]}>
          <p>No tickets available</p>
        </div>
      );
    }

    return (
      <div className={styles["ticketList"]}>
        {filteredTicketIds.map((id) => {
          const ticket = tickets[id];
          const assigneeName = ticket.assigneeId
            ? users[ticket.assigneeId]?.name ?? "Unknown"
            : "Unassigned";

          return (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
              assigneeName={assigneeName}
            />
          );
        })}
      </div>
    );
  };

  useEffect(() => {
    Promise.allSettled([fetchTickets(), fetchUsers()]);
  }, []);

  return (
    <div className={styles["container"]}>
      <div className={styles["header"]}>
        <h1 className={styles["title"]}>Tickets</h1>
        {renderFilterGroup()}
      </div>
      {renderContent()}
    </div>
  );
}

export default Tickets;
