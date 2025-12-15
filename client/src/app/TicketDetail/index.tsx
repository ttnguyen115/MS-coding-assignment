import AssigneeSelect from "client/src/components/AssigneeSelect";
import NotFound from "client/src/components/NotFound";
import StatusCheckbox from "client/src/components/StatusCheckbox";
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

const UNASSIGNED_OPTION = 0;

function TicketDetail() {
  const { id } = useParams<{ id: string }>();

  const tickets = useGlobalStore((state) => state.tickets);
  const users = useGlobalStore((state) => state.users);
  const userIds = useGlobalStore((state) => state.userIds);
  const activeTicket = useGlobalStore((state) => state.activeTicket);
  const activeUser = useGlobalStore((state) => state.activeUser);
  const isLoadingTickets = useGlobalStore((state) => state.isLoadingTickets);
  const isUpdatingTicket = useGlobalStore((state) => state.isUpdatingTicket);
  const ticketsError = useGlobalStore((state) => state.ticketsError);

  const setActiveTicket = useGlobalStore((state) => state.setActiveTicket);
  const setActiveUser = useGlobalStore((state) => state.setActiveUser);
  const fetchTicketById = useGlobalStore((state) => state.fetchTicketById);
  const fetchUserById = useGlobalStore((state) => state.fetchUserById);
  const updateTicketStatus = useGlobalStore(
    (state) => state.updateTicketStatus
  );
  const assignTicket = useGlobalStore((state) => state.assignTicket);
  const unassignTicket = useGlobalStore((state) => state.unassignTicket);

  useEffect(() => {
    // flag to prevent race conditions
    let isCurrent = true;

    const ticketId = Number(id);
    const existingTicket = tickets[ticketId];

    const loadTicket = async () => {
      if (!existingTicket && isCurrent) {
        await fetchTicketById(ticketId);
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
    // flag to prevent race conditions
    let isCurrent = true;

    const loadUser = async () => {
      if (activeTicket?.assigneeId && isCurrent) {
        const existingUser = users[activeTicket.assigneeId];

        if (!existingUser) {
          await fetchUserById(activeTicket.assigneeId);
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

  const isUpdatingStatus =
    isUpdatingTicket?.ticketId === activeTicket.id &&
    isUpdatingTicket?.field === "status";
  const isUpdatingAssignee =
    isUpdatingTicket?.ticketId === activeTicket.id &&
    isUpdatingTicket?.field === "assignee";

  const handleCheckboxChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    await updateTicketStatus(activeTicket.id, e.target.checked);
  };

  const handleAssigneeChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const userId = parseInt(e.target.value);

    if (userId === UNASSIGNED_OPTION) {
      await unassignTicket(activeTicket.id);
    } else {
      await assignTicket(activeTicket.id, userId);
    }
  };

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
          <AssigneeSelect
            value={activeTicket.assigneeId}
            users={users}
            userIds={userIds}
            onChange={handleAssigneeChange}
            disabled={isUpdatingAssignee}
            isLoading={isUpdatingAssignee}
            className={styles["control"]}
          />
        </div>

        <div className={styles["section"]}>
          <label className={styles["label"]}>Status</label>
          <StatusCheckbox
            checked={activeTicket.completed}
            onChange={handleCheckboxChange}
            disabled={isUpdatingStatus}
            isLoading={isUpdatingStatus}
            className={styles["control"]}
          />
        </div>
      </div>
    </TicketDetailLayout>
  );
}

export default TicketDetail;
