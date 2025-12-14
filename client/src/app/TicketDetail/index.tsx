import NotFound from "client/src/components/NotFound";
import useGlobalStore from "client/src/store";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./ticketDetails.module.css";

function TicketDetailLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/");
  };

  return (
    <div className={styles["container"]}>
      <div className={styles["header"]}>
        <button className={styles["backButton"]} onClick={handleBack}>
          Back to the main page
        </button>
      </div>
      {children}
    </div>
  );
}

function TicketDetailSkeleton() {
  return (
    <div className={styles["skeleton"]}>
      <div className={styles["skeletonHeader"]}>
        <div className={styles["skeletonTitle"]}></div>
        <div className={styles["skeletonBadge"]}></div>
      </div>
      <div className={styles["skeletonSection"]}>
        <div className={styles["skeletonLabel"]}></div>
        <div className={styles["skeletonText"]}></div>
        <div className={styles["skeletonText"]}></div>
      </div>
      <div className={styles["skeletonSection"]}>
        <div className={styles["skeletonLabel"]}></div>
        <div className={styles["skeletonText"]}></div>
      </div>
      <div className={styles["skeletonSection"]}>
        <div className={styles["skeletonLabel"]}></div>
        <div className={styles["skeletonText"]}></div>
      </div>
    </div>
  );
}

function TicketDetail() {
  const { id } = useParams<{ id: string }>();

  const tickets = useGlobalStore((state) => state.tickets);
  const users = useGlobalStore((state) => state.users);
  const activeTicket = useGlobalStore((state) => state.activeTicket);
  const activeUser = useGlobalStore((state) => state.activeUser);
  const isLoadingTickets = useGlobalStore((state) => state.isLoadingTickets);
  const ticketsError = useGlobalStore((state) => state.ticketsError);

  const setActiveTicket = useGlobalStore((state) => state.setActiveTicket);
  const setActiveUser = useGlobalStore((state) => state.setActiveUser);
  const fetchTicketById = useGlobalStore((state) => state.fetchTicketById);
  const fetchUserById = useGlobalStore((state) => state.fetchUserById);

  useEffect(() => {
    let isCurrent = true;
    const ticketId = Number(id);
    const existingTicket = tickets[ticketId];

    const loadTicket = () => {
      if (!existingTicket) {
        fetchTicketById(ticketId);
      } else if (isCurrent && (!activeTicket || activeTicket.id !== ticketId)) {
        setActiveTicket(existingTicket);
      }
    };

    loadTicket();

    return () => {
      isCurrent = false;
    };
  }, [id, tickets]);

  useEffect(() => {
    let isCurrent = true;

    const loadUser = () => {
      if (activeTicket?.assigneeId && isCurrent) {
        const existingUser = users[activeTicket.assigneeId];

        if (!existingUser) {
          fetchUserById(activeTicket.assigneeId);
        } else if (
          isCurrent &&
          (!activeUser || activeUser.id !== activeTicket.assigneeId)
        ) {
          setActiveUser(existingUser);
        }
      }
    };

    loadUser();

    return () => {
      isCurrent = false;
    };
  }, [activeTicket, users]);

  // handle loading state when fetching ticket and user info
  if (
    isLoadingTickets ||
    (!activeTicket && !ticketsError) ||
    (activeTicket && activeTicket.id !== Number(id))
  ) {
    return (
      <TicketDetailLayout>
        <TicketDetailSkeleton />
      </TicketDetailLayout>
    );
  }

  // if there are fetching errors or no ticket found
  if (ticketsError || !activeTicket) {
    return (
      <TicketDetailLayout>
        <NotFound title="Ticket not found" message="Cannot find your ticket" />
      </TicketDetailLayout>
    );
  }

  const assigneeName = activeTicket.assigneeId
    ? activeUser?.name ?? "Unknown"
    : "Unassigned";

  return (
    <TicketDetailLayout>
      <div className={styles["card"]}>
        <div className={styles["cardHeader"]}>
          <h1 className={styles["title"]}>Ticket #{activeTicket.id}</h1>
        </div>

        <div className={styles["section"]}>
          <label className={styles["label"]}>Description</label>
          <p className={styles["text"]}>{activeTicket.description}</p>
        </div>

        <div className={styles["section"]}>
          <label className={styles["label"]}>Assignee</label>
          <p className={styles["text"]}>{assigneeName}</p>
        </div>

        <div className={styles["section"]}>
          <label className={styles["label"]}>Status</label>
          <p className={styles["text"]}>
            {activeTicket.completed ? "Completed" : "Incomplete"}
          </p>
        </div>
      </div>
    </TicketDetailLayout>
  );
}

export default TicketDetail;
