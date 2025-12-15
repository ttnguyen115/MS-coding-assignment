import styles from "./statusCheckbox.module.css";

interface StatusCheckboxProps {
  checked: boolean;
  disabled?: boolean;
  isLoading?: boolean;
  className?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function StatusCheckbox({
  checked,
  disabled = false,
  isLoading = false,
  className = "",
  onChange,
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
