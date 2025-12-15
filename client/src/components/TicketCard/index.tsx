import { Ticket } from "@acme/shared-models";
import useGlobalStore from "client/src/store";
import { useNavigate } from "react-router-dom";
import AssigneeSelect from "../AssigneeSelect";
import StatusCheckbox from "../StatusCheckbox";
import skeletonStyles from "./skeleton.module.css";
import styles from "./ticketCard.module.css";

export interface TicketCardProps {
  ticket: Ticket;
}

const UNASSIGNED_OPTION = 0;

function TicketCard({ ticket }: TicketCardProps) {
  const navigate = useNavigate();

  const users = useGlobalStore((state) => state.users);
  const userIds = useGlobalStore((state) => state.userIds);
  const isUpdatingTicket = useGlobalStore((state) => state.isUpdatingTicket);

  const updateTicketStatus = useGlobalStore(
    (state) => state.updateTicketStatus
  );
  const assignTicket = useGlobalStore((state) => state.assignTicket);
  const unassignTicket = useGlobalStore((state) => state.unassignTicket);

  const isUpdatingStatus =
    isUpdatingTicket?.ticketId === ticket.id &&
    isUpdatingTicket?.field === "status";
  const isUpdatingAssignee =
    isUpdatingTicket?.ticketId === ticket.id &&
    isUpdatingTicket?.field === "assignee";

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

    if (userId === UNASSIGNED_OPTION) {
      await unassignTicket(ticket.id);
    } else {
      await assignTicket(ticket.id, userId);
    }
  };

  return (
    <div className={styles["ticketCard"]} onClick={handleClick}>
      <div className={styles["ticketHeader"]}>
        <span className={styles["ticketId"]}>#{ticket.id}</span>
        <div onClick={(e) => e.stopPropagation()}>
          <StatusCheckbox
            checked={ticket.completed}
            onChange={handleCheckboxChange}
            disabled={isUpdatingStatus}
            isLoading={isUpdatingStatus}
          />
        </div>
      </div>
      <p className={styles["ticketDescription"]}>{ticket.description}</p>
      <div className={styles["ticketFooter"]}>
        <div onClick={(e) => e.stopPropagation()}>
          <AssigneeSelect
            value={ticket.assigneeId}
            users={users}
            userIds={userIds}
            onChange={handleAssigneeChange}
            disabled={isUpdatingAssignee}
            isLoading={isUpdatingAssignee}
            showLabel={true}
          />
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
