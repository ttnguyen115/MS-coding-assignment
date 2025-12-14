import { Ticket } from "@acme/shared-models";
import AddTicketModal from "client/src/components/AddTicketModal";
import Button from "client/src/components/Button";
import NotFound from "client/src/components/NotFound";
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
  const {
    tickets,
    users,
    ticketIds,
    isLoadingTickets,
    fetchTickets,
    fetchUsers,
    createTicket,
  } = useGlobalStore(
    useShallow((state) => ({
      tickets: state.tickets,
      users: state.users,
      ticketIds: state.ticketIds,
      isLoadingTickets: state.isLoadingTickets,
      fetchTickets: state.fetchTickets,
      fetchUsers: state.fetchUsers,
      createTicket: state.createTicket,
    }))
  );
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredTicketIds = useMemo(
    () =>
      ticketIds.filter((id) => {
        const ticket = tickets[id];

        if (!ticket) return false;

        if (filterStatus === "all") return true;
        if (filterStatus === "completed") return ticket.completed === true;
        if (filterStatus === "incomplete") return ticket.completed === false;

        return true;
      }),
    [ticketIds, tickets, filterStatus]
  );

  const handleChangeFilter = (status: FilterStatus) => () => {
    setFilterStatus(status);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleCreateTicket = async (description: string) => {
    await createTicket(description);
  };

  const renderFilterGroup = () => (
    <div className={styles["filterGroup"]}>
      {(["all", "completed", "incomplete"] as FilterStatus[]).map(
        (status, index) => (
          <Button
            key={`Tickets-${status}-${index}`}
            isActive={filterStatus === status}
            onClick={handleChangeFilter(status)}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Button>
        )
      )}
    </div>
  );

  const renderAddButton = () => (
    <Button onClick={handleOpenModal}>+ Add Ticket</Button>
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
        <NotFound
          title="No tickets found"
          message={
            filterStatus === "all"
              ? "No tickets available"
              : `No ${filterStatus} tickets`
          }
        />
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
        <div className={styles["buttonRow"]}>
          {renderFilterGroup()}
          {renderAddButton()}
        </div>
      </div>
      {renderContent()}

      <AddTicketModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleCreateTicket}
        isLoading={isLoadingTickets}
      />
    </div>
  );
}

export default Tickets;
