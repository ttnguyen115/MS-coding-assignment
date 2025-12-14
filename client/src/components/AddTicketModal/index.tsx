import { useEffect, useId, useRef, useState } from "react";
import { validateDescription } from "../../utils/sanitize";
import Button from "../Button";
import styles from "./addTicketModal.module.css";

interface AddTicketModalProps {
  isOpen: boolean;
  isLoading?: boolean;
  onClose: () => void;
  onSubmit: (description: string) => Promise<void>;
}

function AddTicketModal({
  isOpen,
  isLoading = false,
  onClose,
  onSubmit,
}: AddTicketModalProps) {
  const inputId = useId();

  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const isMountedRef = useRef(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateDescription(description);
    if (!validation.isValid) {
      setError(validation.error || "Invalid description");
      return;
    }

    try {
      setError("");
      await onSubmit(description);

      // only update state if component is still mounted
      if (isMountedRef.current) {
        setDescription("");
        onClose();
      }
    } catch (err: any) {
      if (isMountedRef.current) {
        setError(err.message || "Failed to create ticket");
      }
    }
  };

  const handleClose = () => {
    setDescription("");
    setError("");
    onClose();
  };

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  if (!isOpen) return null;

  return (
    <div className={styles["overlay"]} onClick={handleClose}>
      <div className={styles["modal"]} onClick={(e) => e.stopPropagation()}>
        <div className={styles["header"]}>
          <h2>Add New Ticket</h2>
          <button className={styles["closeButton"]} onClick={handleClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles["content"]}>
            <label htmlFor={inputId} className={styles["label"]}>
              Description
            </label>
            <textarea
              id={inputId}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter ticket description..."
              className={styles["textarea"]}
              rows={4}
              disabled={isLoading}
            />
            {error && <div className={styles["error"]}>{error}</div>}
          </div>

          <div className={styles["footer"]}>
            <Button type="button" onClick={handleClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !description.trim()}
              className={styles["primaryButton"]}
            >
              {isLoading ? "Creating..." : "Create Ticket"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddTicketModal;
