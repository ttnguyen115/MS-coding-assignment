import { User } from "@acme/shared-models";
import styles from "./assigneeSelect.module.css";

interface AssigneeSelectProps {
  value: number | null;
  users: Record<string, User>;
  userIds: number[];
  disabled?: boolean;
  isLoading?: boolean;
  showLabel?: boolean;
  className?: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const UNASSIGNED_OPTION = 0;

function AssigneeSelect({
  value,
  users,
  userIds,
  disabled = false,
  isLoading = false,
  showLabel = false,
  className = "",
  onChange,
}: AssigneeSelectProps) {
  return (
    <div className={`${styles["container"]} ${className}`}>
      {showLabel && <span className={styles["label"]}>Assignee:</span>}
      <select
        value={value || UNASSIGNED_OPTION}
        onChange={onChange}
        className={styles["select"]}
        disabled={disabled}
      >
        <option value={UNASSIGNED_OPTION}>Unassigned</option>
        {userIds.map((userId) => (
          <option key={userId} value={userId}>
            {users[userId]?.name}
          </option>
        ))}
      </select>
      {isLoading && <span className={styles["spinner"]}></span>}
    </div>
  );
}

export default AssigneeSelect;
