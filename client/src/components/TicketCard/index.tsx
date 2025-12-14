import { Ticket } from "@acme/shared-models";
import { useNavigate } from "react-router-dom";
import skeletonStyles from "./skeleton.module.css";
import styles from "./ticketCard.module.css";

export interface TicketCardProps {
  ticket: Ticket;
  assigneeName: string;
}

function TicketCard({ ticket, assigneeName }: TicketCardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/${ticket.id}`);
  };

  return (
    <div className={styles["ticketCard"]} onClick={handleClick}>
      <div className={styles["ticketHeader"]}>
        <span className={styles["ticketId"]}>#{ticket.id}</span>
        <span
          className={`${styles["statusBadge"]} ${
            ticket.completed ? styles["completed"] : styles["incomplete"]
          }`}
        >
          {ticket.completed ? "Completed" : "Incomplete"}
        </span>
      </div>
      <p className={styles["ticketDescription"]}>{ticket.description}</p>
      <div className={styles["ticketFooter"]}>
        <div className={styles["assignee"]}>
          <span className={styles["assigneeLabel"]}>Assignee:</span>
          <span className={styles["assigneeName"]}>{assigneeName}</span>
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
