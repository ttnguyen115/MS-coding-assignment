import styles from "./statusCheckbox.module.css";

interface StatusCheckboxProps {
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  isLoading?: boolean;
  className?: string;
}

function StatusCheckbox({
  checked,
  onChange,
  disabled = false,
  isLoading = false,
  className = "",
}: StatusCheckboxProps) {
  return (
    <label className={`${styles["container"]} ${className}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className={styles["checkbox"]}
        disabled={disabled}
      />
      <span className={styles["label"]}>
        {checked ? "Completed" : "Incomplete"}
      </span>
      {isLoading && <span className={styles["spinner"]}></span>}
    </label>
  );
}

export default StatusCheckbox;
