import { Ticket } from "@acme/shared-models";
import useGlobalStore from "client/src/store";
import { useNavigate } from "react-router-dom";
import skeletonStyles from "./skeleton.module.css";
import styles from "./ticketCard.module.css";

export interface TicketCardProps {
  ticket: Ticket;
  assigneeName: string;
}

function TicketCard({ ticket, assigneeName }: TicketCardProps) {
  const navigate = useNavigate();

  const users = useGlobalStore((state) => state.users);
  const userIds = useGlobalStore((state) => state.userIds);
  const isUpdatingTicket = useGlobalStore((state) => state.isUpdatingTicket);

  const updateTicketStatus = useGlobalStore(
    (state) => state.updateTicketStatus
  );
  const assignTicket = useGlobalStore((state) => state.assignTicket);
  const unassignTicket = useGlobalStore((state) => state.unassignTicket);

  const isUpdatingStatus = isUpdatingTicket?.ticketId === ticket.id && isUpdatingTicket?.field === 'status';
  const isUpdatingAssignee = isUpdatingTicket?.ticketId === ticket.id && isUpdatingTicket?.field === 'assignee';

  const handleClick = () => {
    navigate(`/${ticket.id}`);
  };

  const handleCheckboxChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    e.stopPropagation();
    await updateTicketStatus(ticket.id, e.target.checked);
  };

  const handleAssigneeChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    e.stopPropagation();
    const userId = parseInt(e.target.value);

    // "Unassigned" option
    if (userId === 0) {
      await unassignTicket(ticket.id);
    } else {
      await assignTicket(ticket.id, userId);
    }
  };

  return (
    <div className={styles["ticketCard"]} onClick={handleClick}>
      <div className={styles["ticketHeader"]}>
        <span className={styles["ticketId"]}>#{ticket.id}</span>
        <label
          className={styles["checkboxContainer"]}
          onClick={(e) => e.stopPropagation()}
        >
          <input
            type="checkbox"
            checked={ticket.completed}
            onChange={handleCheckboxChange}
            className={styles["checkbox"]}
            disabled={isUpdatingStatus}
          />
          <span className={styles["checkboxLabel"]}>
            {ticket.completed ? "Completed" : "Incomplete"}
          </span>
          {isUpdatingStatus && (
            <span className={styles["spinner"]}></span>
          )}
        </label>
      </div>
      <p className={styles["ticketDescription"]}>{ticket.description}</p>
      <div className={styles["ticketFooter"]}>
        <div
          className={styles["assignee"]}
          onClick={(e) => e.stopPropagation()}
        >
          <span className={styles["assigneeLabel"]}>Assignee:</span>
          <select
            value={ticket.assigneeId || 0}
            onChange={handleAssigneeChange}
            className={styles["assigneeSelect"]}
            disabled={isUpdatingAssignee}
          >
            <option value={0}>Unassigned</option>
            {userIds.map((userId) => (
              <option key={userId} value={userId}>
                {users[userId]?.name}
              </option>
            ))}
          </select>
          {isUpdatingAssignee && (
            <span className={styles["spinner"]}></span>
          )}
        </div>
      </div>
    </div>
  );
}

function TicketCardSkeleton() {
  return (
    <div className={skeletonStyles["skeletonCard"]}>
      <div className={skeletonStyles["skeletonHeader"]}>
        <div className={skeletonStyles["skeletonId"]}></div>
        <div className={skeletonStyles["skeletonBadge"]}></div>
      </div>
      <div className={skeletonStyles["skeletonDescription"]}></div>
      <div className={skeletonStyles["skeletonDescriptionShort"]}></div>
      <div className={skeletonStyles["skeletonFooter"]}>
        <div className={skeletonStyles["skeletonAssignee"]}></div>
      </div>
    </div>
  );
}

TicketCard.Skeleton = TicketCardSkeleton;

export default TicketCard;
